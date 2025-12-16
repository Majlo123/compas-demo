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

// --- LIST Operations ---

/**
 * List all time entries (simplest find all)
 */
export const listAllTimeEntries = async (): Promise<TimeEntry[]> => {
    // Assuming findAll without queryParams returns all data
    const result = await timeEntryRepository.findAll({}); 
    // The result from the repository is expected to be TimeEntry[] here
    return result.data || result; 
};

/**
 * List time entries associated with a specific user ID
 */
export const listTimeEntriesByUserId = async (userId: string): Promise<TimeEntry[]> => {
    const user = await userRepository.findById({ id: userId });
    if (!user) {
        throw new ApiError(`User with id ${userId} not found`, httpStatus.NOT_FOUND);
    }

    // Assuming findAllByUserId is adapted to return TimeEntry[] (not PaginatedResult)
    const result = await timeEntryRepository.findAllByUserId(userId); 
    return result;
};

/**
 * List time entries by userId and a date range (start up to 5 days later)
 * @param {string} userId - The ID of the user.
 * @param {string} startDate - The start date (e.g., '2025-12-15').
 */
export const listTimeEntriesByUserIdAndDateRange = async (userId: string, startDate: string): Promise<TimeEntry[]> => {
    const user = await userRepository.findById({ id: userId });
    if (!user) {
        throw new ApiError(`User with id ${userId} not found`, httpStatus.NOT_FOUND);
    }

    // 1. Calculate the end date (start date + 5 days)
    const endDate = DateHelper.calculateEndDate(startDate);
    
    // 2. Format the start date for comparison (important for ignoring time)
    const formattedStartDate = DateHelper.formatDate(startDate);
    
    // 3. Call a new repository method to handle the range query
    // This new repository method must perform a date-only comparison in SQL:
    // WHERE user_id = :userId AND created_at >= :startDate AND created_at < :endDate
    // (Note: Using < endDate ensures we only get entries *before* midnight of the 6th day)
    
    const result = await timeEntryRepository.findByUserIdAndDateRange(
        userId, 
        formattedStartDate, 
        endDate
    );

    return result;
};

// Backwards-compatible aliases
export const create = createTimeEntry;
export const findById = getTimeEntryById;
export const findAll = listAllTimeEntries; // Changed name to avoid conflict with listTimeEntriesByUserId
export const findByUserId = listTimeEntriesByUserId;
export const deleteEntry = deleteTimeEntryById;