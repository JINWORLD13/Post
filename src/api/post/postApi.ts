import type { Post } from "../../types/post";
import apiClient from "../axios";


export const getPostsApi = async () => {
  const response = await apiClient.get("/posts");
  return response?.data;
};

export const getPostByIdApi = async (id: string) => {
  const response = await apiClient.get(`/posts/${id}`);
  return response?.data;
};

export const createPostApi = async (post: Post) => {
  const response = await apiClient.post("/posts", post);
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

export const updatePostByIdApi = async (id: string, post: Post) => {
  const response = await apiClient.patch(`/posts/${id}`, post);
  return response?.data;
};
