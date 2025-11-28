import createBaseRepository from 'repos/utils/baseRepository';
import pool from 'config/database';

export type TeamMember = {
  id?: string;
  teamId: string;
  userId: string;
  isManager?: boolean;
  joinedAt?: Date;
};

export type CreateTeamMember = Omit<TeamMember, 'id' | 'joinedAt'>;

const { create, findById, findByField, findAll, updateById, deleteById } =
  createBaseRepository<TeamMember>('team_members');

export const findByTeamId = async (teamId: string): Promise<TeamMember[]> => {
  const query = {
    text: 'SELECT * FROM team_members WHERE team_id = $1 ORDER BY joined_at DESC',
    values: [teamId],
  };

  const result = await pool.query(query);
  return result.rows.map((row) => ({
    id: row.id,
    teamId: row.team_id,
    userId: row.user_id,
    joinedAt: row.joined_at,
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

export { create, findById, findByField, findAll, updateById, deleteById };
