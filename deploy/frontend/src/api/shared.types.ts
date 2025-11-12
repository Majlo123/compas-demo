export type ApiError = {
  code: number;
  message: string;
  removeUser?: boolean;
};

export type DefaultResponse = {
  success: boolean;
  message?: string;
  error?: ApiError;
  content?: any;
};

type ApiSuccessResponse<T> = {
  success: true;
  content: T;
  message?: string;
};

export type ApiErrorResponse = {
  success: false;
  error: ApiError;
  message?: string;
};

export type ApiResponse<T> = ApiSuccessResponse<T> | ApiErrorResponse;

export const isApiSuccess = <T>(
  response: ApiResponse<T>
): response is ApiSuccessResponse<T> => {
  return response.success === true;
};

export type PaginatedContent<T> = {
  data: T[];
  page: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
};

export type PaginatedApiResponse<T> = ApiResponse<PaginatedContent<T>>;

export type BaseModel = {
  _id: string;
  createdAt: Date;
  updatedAt: Date;
};
