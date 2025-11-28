import { ApiResponse, PaginatedApiResponse } from '@/api/shared.types';

export type Team = {
  id: string;
  name: string;
  description?: string;
  memberCount?: number;
  createdAt?: string;
  updatedAt?: string;
};

export type CreateTeamData = {
  name: string;
  description?: string;
};

export type TeamMember = {
  id: string;
  teamId: string;
  userId: string;
  isManager?: boolean;
  joinedAt?: string;
};

export type CreateTeamMemberData = {
  userId: string;
  isManager?: boolean;
};

export type BulkAddMembersData = {
  members: Array<{ userId: string; isManager?: boolean }>;
};

export type BulkRemoveMembersData = {
  userIds: string[];
};

export type BulkUpdateMembersManagerData = {
  members: Array<{ userId: string; isManager: boolean }>;
};

export type TeamListResponse = Team[];

export type PaginatedTeamResponse = PaginatedApiResponse<Team>;

export type CreateTeamResponse = ApiResponse<Team>;

export default {} as never;
