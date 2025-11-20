import createBaseRepository from 'repos/utils/baseRepository';
import pool from 'config/database';

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

export { create, findById, findByField, findAll, updateById, deleteById };
