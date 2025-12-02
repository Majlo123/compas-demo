import { userRepository } from 'repos/index';
import QueryParams from 'repos/utils/query/QueryParams';
import { PaginatedResult } from 'repos/utils/pagination';
import { User as UserModel } from 'repos/user.model';

/**
 * Search users by name or email
 */
export const searchUsers = async (searchQuery: string): Promise<any[]> => {
  return userRepository.searchByNameOrEmail(searchQuery);
};

export type UserPublic = Pick<UserModel, 'id' | 'fullName' | 'email'>;

export const findAll = async (query: QueryParams): Promise<PaginatedResult<UserPublic>> => {
  const paginatedResult = await userRepository.findAll({ queryParams: query });
  return {
    data: paginatedResult.data.map((u: any) => ({ id: u.id, fullName: u.fullName, email: u.email })),
    page: paginatedResult.page,
    pageSize: paginatedResult.pageSize,
    totalItems: paginatedResult.totalItems,
    totalPages: paginatedResult.totalPages,
  } as PaginatedResult<UserPublic>;
};


