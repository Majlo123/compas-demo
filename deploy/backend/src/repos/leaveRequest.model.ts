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
 * Find all leave requests (for managers)
 */
export const findAllWithQuery = async (queryParams: QueryParams): Promise<PaginatedResult<LeaveRequestWithEmployee>> => {
  const page = queryParams.pagination?.page || 1;
  const pageSize = queryParams.pagination?.pageSize || 20;
  const offset = (page - 1) * pageSize;

  const allowedSortFields = ['start_date', 'end_date', 'created_at', 'status', 'type'];
  const sortBy = queryParams.sort?.by || 'start_date';
  const sortField = allowedSortFields.includes(sortBy) ? sortBy : 'start_date';
  const sortDirection = queryParams.sort?.direction || 'desc';
  const sortDir = sortDirection.toLowerCase() === 'asc' ? 'ASC' : 'DESC';

  // Get total count
  const countQuery = 'SELECT COUNT(*) FROM leave_requests';
  const countResult = await pool.query(countQuery);
  const totalItems = parseInt(countResult.rows[0].count, 10);

  // Get paginated data with dynamic sorting, joined with users table
  const dataQuery = {
    text: `
      SELECT 
        lr.*,
        u.full_name as employee_name
      FROM leave_requests lr
      LEFT JOIN users u ON lr.user_id = u.id
      ORDER BY lr.${sortField} ${sortDir}
      LIMIT $1 OFFSET $2
    `,
    values: [pageSize, offset],
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

export { create, findById, findByField, findAll, updateById, deleteById };
