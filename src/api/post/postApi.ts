import type {
  PostCreateRequest,
  PostUpdateRequest,
  Category,
  SortField,
  SortOrder,
} from "../../types/post";
import apiClient from "../axios";
import { USE_MOCK_MODE } from "../../config/apiConfig";
import {
  mockGetPostsApi,
  mockCreatePostApi,
  mockUpdatePostApi,
  mockDeletePostApi,
} from "../mock/mockServer";

interface GetPostsParams {
  search?: string;
  category?: Category;
  sortField?: SortField;
  sortOrder?: SortOrder;
  page?: number;
  limit?: number;
  userId?: string;
}

export const getPostsApi = async (params?: GetPostsParams) => {
  // Mock 모드일 경우 Mock 서버 사용
  if (USE_MOCK_MODE) {
    return await mockGetPostsApi({
      search: params?.search,
      category: params?.category,
      sortField: params?.sortField,
      sortOrder: params?.sortOrder,
      userId: params?.userId,
    });
  }

  // 실제 API 호출
  const queryParams = new URLSearchParams();

  if (params?.search) {
    queryParams.append("search", params.search);
  }
  if (params?.category && params.category !== "All") {
    queryParams.append("category", params.category);
  }
  if (params?.sortField) {
    queryParams.append("sort", params.sortField);
  }
  if (params?.sortOrder) {
    queryParams.append("order", params.sortOrder);
  }
  if (params?.page) {
    queryParams.append("page", params.page.toString());
  }
  if (params?.limit) {
    queryParams.append("limit", params.limit.toString());
  }

  const queryString = queryParams.toString();
  const url = queryString ? `/posts?${queryString}` : "/posts";

  const response = await apiClient.get(url);
  return response?.data;
};

export const getPostByIdApi = async (id: string) => {
  // Mock 모드에서는 getPostsApi를 사용하여 필터링
  if (USE_MOCK_MODE) {
    const result = await mockGetPostsApi({});
    const post = result.items.find((p) => p.id === id);
    if (!post) {
      throw new Error("Post not found");
    }
    return post;
  }

  const response = await apiClient.get(`/posts/${id}`);
  return response?.data;
};

export const createPostApi = async ({
  post,
  signal,
}: {
  post: PostCreateRequest;
  signal: AbortSignal;
}) => {
  // Mock 모드일 경우 Mock 서버 사용
  if (USE_MOCK_MODE) {
    return await mockCreatePostApi({ post, signal });
  }

  // 실제 API 호출
  const response = await apiClient.post("/posts", post, { signal });
  return response?.data;
};

export const deletePostByIdApi = async (id: string) => {
  // Mock 모드일 경우 Mock 서버 사용
  if (USE_MOCK_MODE) {
    return await mockDeletePostApi(id);
  }

  // 실제 API 호출
  const response = await apiClient.delete(`/posts/${id}`);
  return response?.data;
};

export const deletePostsApi = async () => {
  // Mock 모드에서는 지원하지 않음 (전체 삭제는 위험)
  if (USE_MOCK_MODE) {
    throw new Error("Bulk delete not supported in mock mode");
  }

  const response = await apiClient.delete(`/posts`);
  return response?.data;
};

export const updatePostByIdApi = async (
  id: string,
  post: PostUpdateRequest
) => {
  // Mock 모드일 경우 Mock 서버 사용
  if (USE_MOCK_MODE) {
    return await mockUpdatePostApi(id, post);
  }

  // 실제 API 호출
  const response = await apiClient.patch(`/posts/${id}`, post);
  return response?.data;
};
