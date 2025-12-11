import createBaseRepository from 'repos/utils/baseRepository';
import pool from 'config/database';
import QueryParams from 'repos/utils/query/QueryParams';
import { PaginatedResult } from 'repos/utils/pagination';

export type LeaveRequestStatus = 'approved' | 'pending' | 'declined';

export type LeaveRequestType = 'vacation' | 'sick' | 'personal' | 'other';

export type LeaveRequest = {
  id?: string;
  userId: string;
  type: LeaveRequestType;
  startDate: Date;
  endDate: Date;
  status: LeaveRequestStatus;
  reason?: string;
  createdAt?: Date;
  updatedAt?: Date;
};

export type LeaveRequestWithEmployee = LeaveRequest & {
  employeeName?: string;
};

export type LeaveMonthlySummary = {
  totalDays: number;
  breakdown: Array<{ type: LeaveRequestType; days: number }>;
};

export type CreateLeaveRequest = Omit<LeaveRequest, 'id' | 'createdAt' | 'updatedAt'>;

const { create, findById, findByField, findAll, updateById, deleteById } =
  createBaseRepository<LeaveRequest>('leave_requests');

/**
 * Find all leave requests for a specific user
 */
export const findByUserId = async (userId: string): Promise<LeaveRequest[]> => {
  const query = {
    text: 'SELECT * FROM leave_requests WHERE user_id = $1 ORDER BY start_date DESC',
    values: [userId],
  };

  const result = await pool.query(query);
  return result.rows.map((row) => ({
    id: row.id,
    userId: row.user_id,
    type: row.type,
    startDate: row.start_date,
    endDate: row.end_date,
    status: row.status,
    reason: row.reason,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  }));
};

/**
 * Aggregate approved leave days for a specific month by type for a user
 * Counts the overlap of each request with the specified month (inclusive of boundaries)
 * @param userId - User ID (null for all users - admin view)
 * @param year - Optional year (defaults to current year)
 * @param month - Optional month (1-12, defaults to current month)
 */
export const findApprovedMonthSummaryByUser = async (
  userId: string | null,
  year?: number,
  month?: number
): Promise<LeaveMonthlySummary> => {
  const query = {
    text: `
      WITH month_bounds AS (
        SELECT 
          CASE 
            WHEN $2::int IS NOT NULL AND $3::int IS NOT NULL THEN
              make_date($2::int, $3::int, 1)
            ELSE
              DATE_TRUNC('month', NOW()::DATE)::DATE
          END AS start_month,
          CASE 
            WHEN $2::int IS NOT NULL AND $3::int IS NOT NULL THEN
              (make_date($2::int, $3::int, 1) + INTERVAL '1 month' - INTERVAL '1 day')::DATE
            ELSE
              (DATE_TRUNC('month', NOW()::DATE) + INTERVAL '1 month' - INTERVAL '1 day')::DATE
          END AS end_month
      ),
      filtered_requests AS (
        SELECT
          lr.type,
          GREATEST(lr.start_date, mb.start_month)::DATE AS overlap_start,
          LEAST(lr.end_date, mb.end_month)::DATE AS overlap_end
        FROM leave_requests lr
        CROSS JOIN month_bounds mb
        WHERE ($1::uuid IS NULL OR lr.user_id = $1)
          AND lr.status = 'approved'
          AND lr.start_date <= mb.end_month
          AND lr.end_date >= mb.start_month
      ),
      per_type AS (
        SELECT 
          type,
          SUM((overlap_end::DATE - overlap_start::DATE + 1))::int AS days
        FROM filtered_requests
        GROUP BY type
      )
      SELECT type, days FROM per_type;
    `,
    values: [userId, year || null, month || null],
  };

  const result = await pool.query(query);
  const breakdown = result.rows.map((row) => ({ type: row.type as LeaveRequestType, days: Number(row.days) }));
  const totalDays = breakdown.reduce((sum, b) => sum + b.days, 0);
  return { totalDays, breakdown };
};

/**
 * Find all leave requests with pagination and filtering
 * For admins: returns all leave requests
 * For team managers: returns only requests from users in specified teams
 */
export const findAllWithFilters = async (
  queryParams: QueryParams,
  teamIds?: string[]
): Promise<PaginatedResult<LeaveRequestWithEmployee>> => {
  const page = queryParams.pagination?.page || 1;
  const pageSize = queryParams.pagination?.pageSize || 20;
  const offset = (page - 1) * pageSize;

  const allowedSortFields = ['start_date', 'end_date', 'created_at', 'status', 'type'];
  const sortBy = queryParams.sort?.by || 'start_date';
  const sortField = allowedSortFields.includes(sortBy) ? sortBy : 'start_date';
  const sortDirection = queryParams.sort?.direction || 'desc';
  const sortDir = sortDirection.toLowerCase() === 'asc' ? 'ASC' : 'DESC';
  
  // Use custom ordering: status (pending, approved, declined), then start_date DESC, then end_date DESC
  const useCustomSort = !queryParams.sort?.by; // Only use custom sort if user hasn't specified sorting

  // Build WHERE clause from filters
  const whereClauses: string[] = [];
  const whereValues: any[] = [];
  let paramIndex = 1;

  // Filter by team membership if teamIds provided (for team managers)
  if (teamIds && teamIds.length > 0) {
    whereClauses.push(`lr.user_id IN (SELECT user_id FROM team_members WHERE team_id = ANY($${paramIndex}))`);
    whereValues.push(teamIds);
    paramIndex++;
  }

  queryParams.filters?.forEach((filter) => {
    if (filter.filterKey === 'employeeName') {
      whereClauses.push(`u.full_name ILIKE $${paramIndex}`);
      whereValues.push(`%${filter.value}%`);
      paramIndex++;
    } else if (filter.filterKey === 'type') {
      whereClauses.push(`lr.type = $${paramIndex}`);
      whereValues.push(filter.value);
      paramIndex++;
    } else if (filter.filterKey === 'status') {
      whereClauses.push(`lr.status = $${paramIndex}`);
      whereValues.push(filter.value);
      paramIndex++;
    } else if (filter.filterKey === 'teamId') {
      whereClauses.push(`lr.user_id IN (SELECT user_id FROM team_members WHERE team_id = $${paramIndex})`);
      whereValues.push(filter.value);
      paramIndex++;
    } else if (filter.filterKey === 'requestId') {
      whereClauses.push(`lr.id = $${paramIndex}`);
      whereValues.push(filter.value);
      paramIndex++;
    }
  });

  // Get total count with filters
  const countQuery = {
    text: `SELECT COUNT(*) FROM leave_requests lr LEFT JOIN users u ON lr.user_id = u.id ${whereClauses.length > 0 ? `WHERE ${whereClauses.join(' AND ')}` : ''}`,
    values: whereValues,
  };
  const countResult = await pool.query(countQuery);
  const totalItems = parseInt(countResult.rows[0].count, 10);

  // Get paginated data with dynamic sorting and filters
  const orderByClause = useCustomSort
    ? `ORDER BY 
        CASE lr.status 
          WHEN 'pending' THEN 1 
          WHEN 'approved' THEN 2 
          WHEN 'declined' THEN 3 
          ELSE 4 
        END ASC,
        lr.start_date DESC,
        lr.end_date DESC`
    : `ORDER BY lr.${sortField} ${sortDir}`;

  const dataQuery = {
    text: `
      SELECT 
        lr.*,
        u.full_name as employee_name
      FROM leave_requests lr
      LEFT JOIN users u ON lr.user_id = u.id
      ${whereClauses.length > 0 ? `WHERE ${whereClauses.join(' AND ')}` : ''}
      ${orderByClause}
      LIMIT $${paramIndex} OFFSET $${paramIndex + 1}
    `,
    values: [...whereValues, pageSize, offset],
  };

  const dataResult = await pool.query(dataQuery);
  const data = dataResult.rows.map((row) => ({
    id: row.id,
    userId: row.user_id,
    type: row.type,
    startDate: row.start_date,
    endDate: row.end_date,
    status: row.status,
    reason: row.reason,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    employeeName: row.employee_name,
  }));

  return {
    data,
    page,
    pageSize,
    totalItems,
    totalPages: Math.ceil(totalItems / pageSize),
  };
};

/**
 * Find all leave requests for calendar views (no pagination)
 */
export const findAllForCalendar = async (filters?: {
  teamIds?: string[];
  userId?: string;
  startDate?: Date | null;
  endDate?: Date | null;
}): Promise<LeaveRequestWithEmployee[]> => {
  const whereClauses: string[] = [];
  const values: any[] = [];
  let idx = 1;

  if (filters?.userId) {
    whereClauses.push(`lr.user_id = $${idx}`);
    values.push(filters.userId);
    idx++;
  }

  if (filters?.teamIds && filters.teamIds.length > 0) {
    // limit to users who are members of the provided teams
    whereClauses.push(`lr.user_id IN (SELECT user_id FROM team_members WHERE team_id = ANY($${idx}))`);
    values.push(filters.teamIds);
    idx++;
  }

  if (filters?.startDate) {
    whereClauses.push(`lr.start_date >= $${idx}`);
    values.push(filters.startDate);
    idx++;
  }

  if (filters?.endDate) {
    whereClauses.push(`lr.end_date <= $${idx}`);
    values.push(filters.endDate);
    idx++;
  }

  const whereSql = whereClauses.length > 0 ? `WHERE ${whereClauses.join(' AND ')}` : '';

  const query = {
    text: `
      SELECT lr.*, u.full_name as employee_name
      FROM leave_requests lr
      LEFT JOIN users u ON lr.user_id = u.id
      ${whereSql}
      ORDER BY lr.start_date DESC
    `,
    values,
  };

  const result = await pool.query(query);
  return result.rows.map((row) => ({
    id: row.id,
    userId: row.user_id,
    type: row.type,
    startDate: row.start_date,
    endDate: row.end_date,
    status: row.status,
    reason: row.reason,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    employeeName: row.employee_name,
  }));
};

/**
 * Update leave request status
 */
export const updateStatus = async (id: string, status: LeaveRequestStatus): Promise<LeaveRequest | null> => {
  const query = {
    text: 'UPDATE leave_requests SET status = $1, updated_at = NOW() WHERE id = $2 RETURNING *',
    values: [status, id],
  };

  const result = await pool.query(query);
  
  if (result.rows.length === 0) {
    return null;
  }

  const row = result.rows[0];
  return {
    id: row.id,
    userId: row.user_id,
    type: row.type,
    startDate: row.start_date,
    endDate: row.end_date,
    status: row.status,
    reason: row.reason,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
};

/**
 * Find approved leave requests within a date range
 */
export const findApprovedInDateRange = async (startDate: Date, endDate: Date): Promise<LeaveRequestWithEmployee[]> => {
  const query = {
    text: `
      SELECT lr.*, u.full_name as employee_name
      FROM leave_requests lr
      LEFT JOIN users u ON lr.user_id = u.id
      WHERE lr.status = 'approved'
        AND lr.start_date <= $2
        AND lr.end_date >= $1
      ORDER BY lr.start_date ASC
    `,
    values: [startDate, endDate],
  };

  const result = await pool.query(query);
  return result.rows.map((row) => ({
    id: row.id,
    userId: row.user_id,
    type: row.type,
    startDate: row.start_date,
    endDate: row.end_date,
    status: row.status,
    reason: row.reason,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    employeeName: row.employee_name,
  }));
};

export { create, findById, findByField, findAll, updateById, deleteById };
