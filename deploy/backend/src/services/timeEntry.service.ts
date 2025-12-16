import httpStatus from 'http-status';
import { timeEntryRepository, userRepository } from 'repos/index';
import { TimeEntry, CreateTimeEntry } from 'repos/timeEntry.model';
import ApiError from 'shared/error/ApiError';

/**
 * Helper function to format a Date object as YYYY-MM-DD string
 * and calculate the date 5 days later.
 */
const DateHelper = {
    validateTimeEntryData: (entity) => {
        if (!entity.projectName || entity.projectName.trim().length === 0) {
            throw new ApiError('Project name is required', httpStatus.BAD_REQUEST);
        }
        
        // Validate start and end times
        const startTime = new Date(entity.startTime);
        const endTime = new Date(entity.endTime);
        
        if (isNaN(startTime.getTime())) {
            throw new ApiError('Invalid start time provided', httpStatus.BAD_REQUEST);
        }
        
        if (isNaN(endTime.getTime())) {
            throw new ApiError('Invalid end time provided', httpStatus.BAD_REQUEST);
        }
        
        if (endTime <= startTime) {
            throw new ApiError('End time must be after start time', httpStatus.BAD_REQUEST);
        }
        
        // Check maximum duration (24 hours)
        const diffMs = endTime.getTime() - startTime.getTime();
        const diffHours = diffMs / (1000 * 60 * 60);
        if (diffHours > 24) {
            throw new ApiError('Time entry cannot exceed 24 hours', httpStatus.BAD_REQUEST);
        }
        
        if (entity.isOvertime !== undefined && typeof entity.isOvertime !== 'boolean') {
            entity.isOvertime = entity.isOvertime === 'true';
        }
        
        if (entity.isBillable !== undefined && typeof entity.isBillable !== 'boolean') {
            entity.isBillable = entity.isBillable === 'true';
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
            const entryStartTime = new Date(entry.start_time || entry.startTime);
            const entryDate = entryStartTime.toISOString().split('T')[0]; // Get YYYY-MM-DD
            
            const startDate = filters.startDate || '1970-01-01';
            const endDate = filters.endDate || '9999-12-31';
            
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