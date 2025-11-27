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

export type TeamListResponse = Team[];

export type PaginatedTeamResponse = PaginatedApiResponse<Team>;

export type CreateTeamResponse = ApiResponse<Team>;

export default {} as never;
