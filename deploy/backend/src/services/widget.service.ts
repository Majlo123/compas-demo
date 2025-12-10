import httpStatus from 'http-status';
import { CreateWidget, Widget } from 'repos/widget.model';
import ApiError from 'shared/error/ApiError';
import { widgetRepository, userRepository } from 'repos';
import { findApprovedMonthSummaryByUser, LeaveMonthlySummary } from 'repos/leaveRequest.model';


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
 * Compute time-off summary for the current month for the authenticated user
 */
export const getTimeOffSummary = async (userId: string): Promise<LeaveMonthlySummary> => {
  const summary = await findApprovedMonthSummaryByUser(userId);
  return summary;
};
