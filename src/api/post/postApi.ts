import type {
  PostCreateRequest,
  PostUpdateRequest,
  Category,
  SortField,
  SortOrder,
} from "../../types/post";
import apiClient from "../axios";

interface GetPostsParams {
  search?: string;
  category?: Category;
  sortField?: SortField;
  sortOrder?: SortOrder;
  page?: number;
  limit?: number;
}

export const getPostsApi = async (params?: GetPostsParams) => {
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
  const response = await apiClient.post("/posts", post, { signal });
  return response?.data;
};

export const deletePostByIdApi = async (id: string) => {
  const response = await apiClient.delete(`/posts/${id}`);
  return response?.data;
};

export const deletePostsApi = async () => {
  const response = await apiClient.delete(`/posts`);
  return response?.data;
};

export const updatePostByIdApi = async (
  id: string,
  post: PostUpdateRequest
) => {
  const response = await apiClient.patch(`/posts/${id}`, post);
  return response?.data;
};
