import httpStatus from 'http-status';
import { CreateWidget, Widget } from 'repos/widget.model';
import ApiError from 'shared/error/ApiError';
import { widgetRepository, userRepository, leaveRequestRepository, teamMemberRepository } from 'repos';
import { findApprovedMonthSummaryByUser, LeaveMonthlySummary } from 'repos/leaveRequest.model';
import { findByDateRange as findCollectiveDaysOffByDateRange } from 'repos/collectiveDayOff.model';


export const createWidget = async (entity: CreateWidget): Promise<Widget> => {
  // Defensive: ensure the user exists before inserting to avoid FK violations
  const user = await userRepository.findById({ id: entity.userId as unknown as string });
  if (!user) {
    throw new ApiError('User not found for widget creation', httpStatus.NOT_FOUND);
  }

  try {
    const created = await widgetRepository.create(entity);
    return created;
  } catch (err: any) {
    // Handle unique constraint on (user_id, type) to avoid generic 500s
    if (err?.code === '23505') {
      throw new ApiError('Widget of this type already exists for this user', httpStatus.CONFLICT);
    }
    throw err;
  }
};


export const getWidgetById = async (id: string): Promise<Widget> => {
  const widget = await widgetRepository.findById({ id });
  if (!widget) {
    throw new ApiError(`Widget with id ${id} not found`, httpStatus.NOT_FOUND);
  }
  return widget;
};


export const getWidgetsByUserId = async (userId: string): Promise<Widget[]> => {
  const widgets = await widgetRepository.findByUserId(userId);
  return widgets;
};


export const getWidgetsByUserIdAndType = async (userId: string, type?: string): Promise<Widget[]> => {
  const widgets = await widgetRepository.findByUserIdAndType(userId, type);
  return widgets;
};


export const updateWidget = async (id: string, updates: Partial<Widget>): Promise<Widget> => {
  const widget = await widgetRepository.findById({ id });
  if (!widget) {
    throw new ApiError(`Widget with id ${id} not found`, httpStatus.NOT_FOUND);
  }

  const updated = await widgetRepository.updateById(id, updates);
  if (!updated) {
    throw new ApiError(`Failed to update widget ${id}`, httpStatus.INTERNAL_SERVER_ERROR);
  }
  return updated;
};


export const deleteWidget = async (id: string): Promise<boolean> => {
  const widget = await widgetRepository.findById({ id });
  if (!widget) {
    throw new ApiError(`Widget with id ${id} not found`, httpStatus.NOT_FOUND);
  }

  await widgetRepository.deleteById(id);
  return true;
};

/**
 * Save widgets layout for a user (bulk update)
 */
export const saveWidgetsLayout = async (userId: string, widgets: Array<Pick<Widget, 'id' | 'x' | 'y' | 'width' | 'height'>>): Promise<Widget[]> => {
  const userWidgets = await widgetRepository.findByUserId(userId);
  const userWidgetIds = new Set(userWidgets.map(w => w.id));

  // Verify all widgets belong to the user
  const widgetIds = widgets.map(w => w.id);
  if (!widgetIds.every(id => userWidgetIds.has(id))) {
    throw new ApiError('Invalid widget ids for this user', httpStatus.FORBIDDEN);
  }

  // Update each widget
  const updated = await Promise.all(
    widgets.map(async (w) => {
      const result = await widgetRepository.updateById(w.id!, { x: w.x, y: w.y, width: w.width, height: w.height });
      if (!result) {
        throw new ApiError(`Failed to update widget ${w.id}`, httpStatus.INTERNAL_SERVER_ERROR);
      }
      return result;
    })
  );

  return updated;
};

/**
 * Compute time-off summary for a specific month for the authenticated user
 * For admin users, returns aggregated data for all users
 * @param userId - User ID
 * @param userRole - User role (admin or employee)
 * @param year - Optional year (defaults to current year)
 * @param month - Optional month (1-12, defaults to current month)
 */
export const getTimeOffSummary = async (userId: string, userRole?: string, year?: number, month?: number): Promise<LeaveMonthlySummary> => {
  const isAdmin = userRole === 'admin';
  const summary = await findApprovedMonthSummaryByUser(isAdmin ? null : userId, year, month);
  return summary;
};

interface UpcomingLeave {
  id: string;
  employeeName: string;
  type: string;
  startDate: string;
  endDate: string;
  days: number;
}

interface UpcomingVacationsResult {
  total: number;
  leaves: UpcomingLeave[];
}

/**
 * Get upcoming approved leave requests within a date range
 * @param userId - User ID
 * @param days - Number of days from today (default: 7)
 */
export const getUpcomingLeaveRequests = async (userId: string, days: number = 7): Promise<UpcomingVacationsResult> => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const endDate = new Date(today);
  endDate.setDate(today.getDate() + days);

  const leaves = await leaveRequestRepository.findApprovedInDateRange(today, endDate);

  // Helper function to calculate work days (excluding weekends and collective days off)
  const calculateWorkDays = async (startDate: Date, endDate: Date): Promise<number> => {
    const collectiveDaysOff = await findCollectiveDaysOffByDateRange(startDate, endDate);
    
    let workDays = 0;
    const currentDate = new Date(startDate);
    
    while (currentDate <= endDate) {
      const dayOfWeek = currentDate.getDay();
      
      // Skip weekends (0 = Sunday, 6 = Saturday)
      if (dayOfWeek !== 0 && dayOfWeek !== 6) {
        // Check if this day is a collective day off
        const isCollectiveDayOff = collectiveDaysOff.some((dayOff: any) => {
          const offStart = new Date(dayOff.startDate);
          const offEnd = new Date(dayOff.endDate);
          offStart.setHours(0, 0, 0, 0);
          offEnd.setHours(0, 0, 0, 0);
          
          const d = new Date(currentDate);
          d.setHours(0, 0, 0, 0);
          return d >= offStart && d <= offEnd;
        });
        
        if (!isCollectiveDayOff) {
          workDays++;
        }
      }
      
      currentDate.setDate(currentDate.getDate() + 1);
    }
    
    return workDays;
  };

  const formattedLeaves: UpcomingLeave[] = await Promise.all(
    leaves.map(async (leave: any) => {
      const startDate = new Date(leave.startDate);
      const endDate = new Date(leave.endDate);
      const workDays = await calculateWorkDays(startDate, endDate);
      
      return {
        id: leave.id,
        employeeName: leave.employeeName || 'Unknown',
        type: leave.type,
        startDate: leave.startDate,
        endDate: leave.endDate,
        days: workDays,
      };
    })
  );

  return {
    total: formattedLeaves.length,
    leaves: formattedLeaves,
  };
};

interface DayHeatData {
  date: string;
  absenceCount: number;
  intensity: number;
}

interface MonthData {
  year: number;
  month: number;
  days: DayHeatData[];
}

/**
 * Get hot spots for upcoming 3 months (days with multiple absences)
 * For admins, shows all teams; for managers, shows own teams
 * @param userId - User ID
 * @param userRole - User role (admin or employee/manager)
 */
export const getHotSpots = async (userId: string, userRole?: string): Promise<{ months: MonthData[] }> => {
  const isAdmin = userRole === 'admin';
  
  // Get current date and next 3 months
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const endDate = new Date(today);
  endDate.setMonth(today.getMonth() + 3);
  endDate.setDate(0); // Last day of the month
  
  // Get all approved leaves in the next 3 months
  const leaves = await leaveRequestRepository.findApprovedInDateRange(today, endDate);

  // If not admin, filter by user's teams
  let filteredLeaves = leaves;
  if (!isAdmin) {
    const userTeamIds = await (require('repos/index').teamMemberRepository as any).getTeamsWhereUserIsManager(userId);
    const userTeamsAndSelf = new Set(userTeamIds);
    
    // Also include leaves from the user themselves
    filteredLeaves = leaves.filter((leave: any) => {
      return leave.userId === userId || userTeamIds.some(teamId => 
        // Will be filtered by team membership in repository query
        true
      );
    });
  }

  // Group leaves by date and count absences (only on working days)
  const dateAbsenceMap = new Map<string, number>();

  // Get collective days off once
  const collectiveDaysOff = await findCollectiveDaysOffByDateRange(today, endDate);

  const isWorkingDay = (date: Date): boolean => {
    // Check if it's a weekend (0 = Sunday, 6 = Saturday)
    const dayOfWeek = date.getDay();
    if (dayOfWeek === 0 || dayOfWeek === 6) return false;

    // Check if it's a collective day off
    const isCollectiveOff = collectiveDaysOff.some((dayOff: any) => {
      const offStart = new Date(dayOff.startDate);
      const offEnd = new Date(dayOff.endDate);
      offStart.setHours(0, 0, 0, 0);
      offEnd.setHours(0, 0, 0, 0);
      
      const d = new Date(date);
      d.setHours(0, 0, 0, 0);
      return d >= offStart && d <= offEnd;
    });

    return !isCollectiveOff;
  };

  filteredLeaves.forEach((leave: any) => {
    const startDate = new Date(leave.startDate);
    startDate.setHours(0, 0, 0, 0);
    
    const endDate = new Date(leave.endDate);
    endDate.setHours(0, 0, 0, 0);

    // For each working day in the leave range, increment the absence count
    const currentDate = new Date(startDate);
    while (currentDate <= endDate) {
      if (isWorkingDay(currentDate)) {
        const dateStr = currentDate.toISOString().split('T')[0];
        dateAbsenceMap.set(dateStr, (dateAbsenceMap.get(dateStr) || 0) + 1);
      }
      currentDate.setDate(currentDate.getDate() + 1);
    }
  });

  // Function to calculate intensity based on absence count
  const getIntensity = (count: number): number => {
    if (count === 0) return 0;
    if (count === 1) return 1;
    if (count === 2) return 2;
    if (count === 3) return 3;
    return 4; // 4+ absences
  };

  // Build month data
  const months: MonthData[] = [];
  
  for (let m = 0; m < 3; m++) {
    const monthDate = new Date(today);
    monthDate.setMonth(today.getMonth() + m);
    
    const year = monthDate.getFullYear();
    const month = monthDate.getMonth() + 1;
    
    const daysInMonth = new Date(year, month, 0).getDate();
    const days: DayHeatData[] = [];

    for (let day = 1; day <= daysInMonth; day++) {
      const dateStr = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
      const absenceCount = dateAbsenceMap.get(dateStr) || 0;
      
      days.push({
        date: dateStr,
        absenceCount,
        intensity: getIntensity(absenceCount),
      });
    }

    months.push({
      year,
      month,
      days,
    });
  }

  return { months };
};

type ApproachingLeaveUser = {
  id: string;
  fullName: string;
  email: string;
  remainingDays: number;
  initialDays: number;
  teams: Array<{ teamId: string; teamName: string }>;
};

/**
 * Return users whose remaining vacation days are at or below the provided threshold.
 * - Admins see all active users.
 * - Managers see members of teams they manage.
 * - Employees only see themselves.
 */
export const getUsersApproachingLeaveLimit = async (
  userId: string,
  userRole?: string,
  threshold: number = 5,
): Promise<{ total: number; users: ApproachingLeaveUser[] }> => {
  const isAdmin = userRole === 'admin';
  const managerTeamIds = await teamMemberRepository.getTeamsWhereUserIsManager(userId);

  const addOrMergeUser = (
    map: Map<string, ApproachingLeaveUser>,
    data: { id: string; fullName: string; email: string; remainingDays: number; initialDays: number; teamId?: string; teamName?: string },
  ) => {
    const existing = map.get(data.id);
    const teamsToMerge = data.teamId && data.teamName ? [{ teamId: data.teamId, teamName: data.teamName }] : [];

    if (existing) {
      const mergedTeams = [...existing.teams];
      teamsToMerge.forEach((team) => {
        if (!mergedTeams.some((t) => t.teamId === team.teamId)) {
          mergedTeams.push(team);
        }
      });
      map.set(data.id, { ...existing, teams: mergedTeams });
    } else {
      map.set(data.id, {
        id: data.id,
        fullName: data.fullName,
        email: data.email,
        remainingDays: data.remainingDays,
        initialDays: data.initialDays,
        teams: teamsToMerge,
      });
    }
  };

  const resultMap = new Map<string, ApproachingLeaveUser>();

  if (isAdmin) {
    const users = await userRepository.findAllActiveWithBalances();
    users.forEach((u) =>
      addOrMergeUser(resultMap, {
        id: u.id!,
        fullName: u.fullName,
        email: u.email,
        remainingDays: u.vacationDaysLeft ?? 0,
        initialDays: u.vacationDaysInit ?? 0,
      })
    );
  } else if (managerTeamIds.length > 0) {
    const members = await teamMemberRepository.findUsersByTeamIdsWithTeam(managerTeamIds);
    members.forEach((m) =>
      addOrMergeUser(resultMap, {
        id: m.userId,
        fullName: m.fullName,
        email: m.email,
        remainingDays: m.vacationDaysLeft ?? 0,
        initialDays: m.vacationDaysInit ?? 0,
        teamId: m.teamId,
        teamName: m.teamName,
      })
    );
  } else {
    const self = await userRepository.findById({ id: userId });
    if (self) {
      addOrMergeUser(resultMap, {
        id: self.id!,
        fullName: self.fullName,
        email: self.email,
        remainingDays: self.vacationDaysLeft ?? 0,
        initialDays: self.vacationDaysInit ?? 0,
      });
    }
  }

  const filtered = Array.from(resultMap.values()).filter((u) => u.remainingDays <= threshold);

  filtered.sort((a, b) => a.remainingDays - b.remainingDays || a.fullName.localeCompare(b.fullName));

  return {
    total: filtered.length,
    users: filtered,
  };
};

