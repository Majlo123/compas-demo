import { collectiveDayOffRepository } from 'repos/index';
import logger from 'config/logger';
import ApiError from 'shared/error/ApiError';
import httpStatus from 'http-status';

const mapCollectiveDayOff = (day: any) => ({
  id: day.id,
  startDate: day.startDate.toISOString().split('T')[0],
  endDate: day.endDate.toISOString().split('T')[0],
  description: day.description,
  createdAt: day.createdAt?.toISOString(),
});

/**
 * Get all collective days off
 */
export const getAllCollectiveDaysOff = async (): Promise<any[]> => {
  try {
    const result = await collectiveDayOffRepository.findAllCollectiveDaysOff();
    logger.info(`Fetched ${result.length} collective days off`);
    return result.map(mapCollectiveDayOff);
  } catch (error) {
    const err = error instanceof Error ? error : new Error('Failed to fetch collective days off');
    logger.error(err);
    throw err;
  }
};

/**
 * Get collective days off within a date range
 */
export const getCollectiveDaysOffByDateRange = async (startDate: string, endDate: string): Promise<any[]> => {
  try {
    const start = new Date(startDate);
    const end = new Date(endDate);

    const result = await collectiveDayOffRepository.findByDateRange(start, end);
    logger.info(`Fetched ${result.length} collective days off for date range ${startDate} to ${endDate}`);

    return result.map(mapCollectiveDayOff);
  } catch (error) {
    const err = error instanceof Error ? error : new Error('Failed to fetch collective days off');
    logger.error(err);
    throw err;
  }
};

/**
 * Delete a collective day off by ID
 */
export const deleteCollectiveDayOff = async (id: string): Promise<void> => {
  try {
    const existing = await collectiveDayOffRepository.findById({ id });
    if (!existing) {
      throw new Error('Collective day off not found');
    }
    
    await collectiveDayOffRepository.deleteById(id);
    logger.info(`Deleted collective day off with ID: ${id}`);
  } catch (error) {
    const err = error instanceof Error ? error : new Error('Failed to delete collective day off');
    logger.error(err);
    throw err;
  }
};

/**
 * Create a new collective day off
 */
export const createCollectiveDayOff = async (data: {
  startDate: string;
  endDate: string;
  description: string;
}): Promise<any> => {
  try {
    const startDate = new Date(data.startDate);
    const endDate = new Date(data.endDate);

    // Validate date range
    if (endDate < startDate) {
      throw new ApiError('End date must be on or after start date', httpStatus.BAD_REQUEST);
    }

    // Check for duplicate/overlapping dates
    const hasOverlap = await collectiveDayOffRepository.checkDateOverlap(startDate, endDate);
    if (hasOverlap) {
      throw new ApiError('A collective day off already exists for the selected date range', httpStatus.CONFLICT);
    }

    const newDayOff = await collectiveDayOffRepository.createCollectiveDayOff({
      startDate,
      endDate,
      description: data.description,
    });

    logger.info(`Created collective day off: ${data.description} (${data.startDate} - ${data.endDate})`);

    return mapCollectiveDayOff(newDayOff);
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    const err = error instanceof Error ? error : new Error('Failed to create collective day off');
    logger.error(err);
    throw err;
  }
};
