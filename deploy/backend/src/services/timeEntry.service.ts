import httpStatus from 'http-status';
import { timeEntryRepository, userRepository } from 'repos/index';
import { TimeEntry, CreateTimeEntry } from 'repos/timeEntry.model';
import ApiError from 'shared/error/ApiError';

/**
 * Helper function to format a Date object as YYYY-MM-DD string
 * and calculate the date 5 days later.
 */
const DateHelper = {
    // Note: Assumes input is a valid date string or Date object
    formatDate: (dateInput) => {
        const date = new Date(dateInput);
        if (isNaN(date)) {
            throw new ApiError('Invalid date provided.', httpStatus.BAD_REQUEST);
        }
        // Gets YYYY-MM-DD regardless of local timezone
        return date.toISOString().split('T')[0];
    },

    // Calculates the date 5 days after the start date, formatted as YYYY-MM-DD
    calculateEndDate: (startDateInput) => {
        const startDate = new Date(startDateInput);
        if (isNaN(startDate)) {
            throw new ApiError('Invalid start date provided.', httpStatus.BAD_REQUEST);
        }
        // Add 5 full days (5 * 24 * 60 * 60 * 1000 milliseconds)
        startDate.setDate(startDate.getDate() + 5);
        return DateHelper.formatDate(startDate);
    },

    // Validation (same as before)
    validateTimeEntryData: (entity) => {
        if (!entity.projectName || entity.projectName.trim().length === 0) {
            throw new ApiError('Project name is required', httpStatus.BAD_REQUEST);
        }
        // Check for positive integer, max 480 minutes (8 hours)
        if (!entity.timeSpentMinutes || !Number.isInteger(entity.timeSpentMinutes) || entity.timeSpentMinutes <= 0 || entity.timeSpentMinutes > 480) {
            throw new ApiError('Time spent must be a positive integer lower than 480 minutes', httpStatus.BAD_REQUEST);
        }
        if (entity.isOvertime !== undefined && typeof entity.isOvertime !== 'boolean') {
            entity.isOvertime = entity.isOvertime === 'true';
        }
    }
};

// --- CRUD Operations ---

/**
 * Create a new time entry
 */
export const createTimeEntry = async (entity: CreateTimeEntry): Promise<TimeEntry> => {
    DateHelper.validateTimeEntryData(entity);
    // Assuming project existence is validated elsewhere or handled by DB Foreign Key
    
    const created = await timeEntryRepository.create(entity);
    return created;
};

/**
 * Retrieve a single time entry by ID
 */
export const getTimeEntryById = async (id: string): Promise<TimeEntry> => {
    const entity = await timeEntryRepository.findById({ id });
    if (!entity) {
        throw new ApiError(`Time Entry with id ${id} not found`, httpStatus.NOT_FOUND);
    }
    return entity;
};

/**
 * Update an existing time entry
 */
export const updateTimeEntry = async (id: string, entity: Partial<CreateTimeEntry>): Promise<TimeEntry> => {
    const existing = await timeEntryRepository.findById({ id });
    if (!existing) {
        throw new ApiError(`Time Entry with id ${id} not found`, httpStatus.NOT_FOUND);
    }
    
    // Validate only the fields that were provided
    const validationEntity = { ...existing, ...entity };
    DateHelper.validateTimeEntryData(validationEntity);

    const updated = await timeEntryRepository.updateById(id, entity);
    if (!updated) {
        throw new ApiError('Failed to update time entry', httpStatus.INTERNAL_SERVER_ERROR);
    }
    return updated;
};

/**
 * Delete a time entry by id
 */
export const deleteTimeEntryById = async (id: string): Promise<TimeEntry> => {
    const timeEntry = await timeEntryRepository.findById({ id });
    if (!timeEntry) {
        throw new ApiError('Time Entry not found', httpStatus.NOT_FOUND);
    }

    const deleted = await timeEntryRepository.deleteById(id);
    if (!deleted) {
        throw new ApiError('Failed to delete time entry', httpStatus.INTERNAL_SERVER_ERROR);
    }

    return deleted;
};

/**
 * Get all time entries for a user with optional date range filtering
 */
export const getUserTimeEntries = async (userId: string, filters?: { startDate?: string; endDate?: string }) => {
    const entries = await timeEntryRepository.findByUserId(userId);
    
    // Apply date range filters if provided
    if (filters?.startDate || filters?.endDate) {
        return entries.filter((entry: any) => {
            const entryDate = new Date(entry.startate || entry.start_date).getTime();
            const startDate = filters.startDate ? new Date(filters.startDate).getTime() : 0;
            const endDate = filters.endDate ? new Date(filters.endDate).getTime() + 86400000 : Infinity; // +1 day for inclusive end
            return entryDate >= startDate && entryDate <= endDate;
        });
    }
    
    return entries;
};

/**
 * Delete a time entry
 */
export const deleteTimeEntry = async (id: string): Promise<boolean> => {
    const deleted = await timeEntryRepository.deleteById(id);
    return !!deleted;
};

// --- LIST Operations ---

/**
 * List all time entries (simplest find all)
 */
export const listAllTimeEntries = async (): Promise<TimeEntry[]> => {
    const result = await timeEntryRepository.findAll({});
    return Array.isArray(result) ? result : (result.data || []);
};