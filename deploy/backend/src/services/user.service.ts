import { userRepository } from 'repos/index';
import QueryParams from 'repos/utils/query/QueryParams';
import { PaginatedResult } from 'repos/utils/pagination';

/**
 * Search users by name or email
 */
export const searchUsers = async (searchQuery: string): Promise<any[]> => {
  return userRepository.searchByNameOrEmail(searchQuery);
};

export const findAll = async (query: QueryParams): Promise<PaginatedResult<any>> => {
  return userRepository.findAll({ queryParams: query });
};


