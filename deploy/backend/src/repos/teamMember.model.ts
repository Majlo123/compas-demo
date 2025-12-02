import createBaseRepository from 'repos/utils/baseRepository';
import pool from 'config/database';

export type TeamMember = {
  id?: string;
  teamId: string;
  userId: string;
  isManager?: boolean;
  joinedAt?: Date;
  fullName?: string;
  email?: string;
};

export type CreateTeamMember = Omit<TeamMember, 'id' | 'joinedAt'>;

const { create, findById, findByField, findAll, updateById, deleteById } =
  createBaseRepository<TeamMember>('team_members');

export const findByTeamId = async (teamId: string): Promise<TeamMember[]> => {
  const query = {
    text: `
      SELECT 
        tm.id,
        tm.team_id,
        tm.user_id,
        tm.is_manager,
        tm.joined_at,
        u.full_name,
        u.email
      FROM team_members tm
      JOIN users u ON tm.user_id = u.id
      WHERE tm.team_id = $1 
      ORDER BY tm.joined_at DESC
    `,
    values: [teamId],
  };

  const result = await pool.query(query);
  return result.rows.map((row) => ({
    id: row.id,
    teamId: row.team_id,
    userId: row.user_id,
    isManager: row.is_manager,
    joinedAt: row.joined_at,
    fullName: row.full_name,
    email: row.email,
  }));
};

export const findByUserId = async (userId: string): Promise<TeamMember[]> => {
  const query = {
    text: 'SELECT * FROM team_members WHERE user_id = $1 ORDER BY joined_at DESC',
    values: [userId],
  };

  const result = await pool.query(query);
  return result.rows.map((row) => ({
    id: row.id,
    teamId: row.team_id,
    userId: row.user_id,
    isManager: row.is_manager,
    joinedAt: row.joined_at,
  }));
};

export const updateTeamMemberManager = async (
  teamId: string,
  userId: string,
  isManager: boolean
): Promise<TeamMember | null> => {
  const members = await findByTeamId(teamId);
  const member = members.find((m) => m.userId === userId);
  
  if (!member || !member.id) {
    return null;
  }

  return updateById(member.id, { isManager });
};

/**
 * Check if user is a manager in any team
 */
export const isUserManagerOfAnyTeam = async (userId: string): Promise<boolean> => {
  const query = {
    text: 'SELECT COUNT(*) as count FROM team_members WHERE user_id = $1 AND is_manager = true',
    values: [userId],
  };

  const result = await pool.query(query);
  return parseInt(result.rows[0].count, 10) > 0;
};

/**
 * Get all team IDs where user is a manager
 */
export const getTeamsWhereUserIsManager = async (userId: string): Promise<string[]> => {
  const query = {
    text: 'SELECT team_id FROM team_members WHERE user_id = $1 AND is_manager = true',
    values: [userId],
  };

  const result = await pool.query(query);
  return result.rows.map((row) => row.team_id);
};

/**
 * Check if user is a manager in a specific team
 */
export const isManagerForTeam = async (userId: string, teamId: string): Promise<boolean> => {
  const query = {
    text: 'SELECT is_manager FROM team_members WHERE user_id = $1 AND team_id = $2',
    values: [userId, teamId],
  };

  const result = await pool.query(query);
  return result.rows.length > 0 && result.rows[0].is_manager === true;
};

export { create, findById, findByField, findAll, updateById, deleteById };
