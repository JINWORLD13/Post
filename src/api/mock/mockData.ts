import type {
  Post,
  PostCreateRequest,
  PostUpdateRequest,
  Category,
  SortField,
  SortOrder,
} from "../../types/post";

// Mock 사용자 데이터
export const MOCK_USER = {
  id: "user-123",
  email: "jinworld13@gmail.com",
  password: "123",
};

// Mock 게시글 데이터 (로컬 스토리지 키)
const MOCK_POSTS_STORAGE_KEY = "mock_posts";

// 로컬 스토리지에서 게시글 목록 가져오기
export const getMockPosts = (): Post[] => {
  try {
    const stored = localStorage.getItem(MOCK_POSTS_STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (error) {
    console.error("Failed to load mock posts:", error);
  }
  return [];
};

// 로컬 스토리지에 게시글 목록 저장하기
export const saveMockPosts = (posts: Post[]): void => {
  try {
    localStorage.setItem(MOCK_POSTS_STORAGE_KEY, JSON.stringify(posts));
    console.log(`로컬 스토리지에 게시글 ${posts.length}개 저장됨`);
  } catch (error) {
    console.error("Failed to save mock posts:", error);
    throw error;
  }
};

// Mock 로그인 함수
export const mockLogin = (email: string, password: string) => {
  if (email === MOCK_USER.email && password === MOCK_USER.password) {
    return {
      token: "mock-token-12345",
      user: {
        id: MOCK_USER.id,
        email: MOCK_USER.email,
      },
      userId: MOCK_USER.id,
    };
  }
  throw new Error("Invalid email or password");
};

// Mock 게시글 생성 (로컬 스토리지에 저장)
export const mockCreatePost = (
  postData: PostCreateRequest,
  userId: string
): Post => {
  const posts = getMockPosts();
  const newPost: Post = {
    id: `post-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    ...postData,
    userId,
    createdAt: new Date().toISOString(),
  };
  posts.push(newPost);
  // 로컬 스토리지에 저장
  saveMockPosts(posts);
  console.log("게시글 생성됨 (로컬 스토리지 저장):", newPost.id);
  return newPost;
};

// Mock 게시글 수정 (로컬 스토리지에 저장)
export const mockUpdatePost = (
  id: string,
  postData: PostUpdateRequest
): Post | null => {
  const posts = getMockPosts();
  const index = posts.findIndex((post) => post.id === id);
  if (index === -1) return null;

  posts[index] = {
    ...posts[index],
    ...postData,
  };
  // 로컬 스토리지에 저장
  saveMockPosts(posts);
  console.log("게시글 수정됨 (로컬 스토리지 저장):", id);
  return posts[index];
};

// Mock 게시글 삭제 (로컬 스토리지에서 제거)
export const mockDeletePost = (id: string): boolean => {
  const posts = getMockPosts();
  const filtered = posts.filter((post) => post.id !== id);
  if (filtered.length === posts.length) return false;
  // 로컬 스토리지에 저장 (삭제된 항목 제외)
  saveMockPosts(filtered);
  console.log("게시글 삭제됨 (로컬 스토리지에서 제거):", id);
  return true;
};

// Mock 게시글 조회 (필터링 및 정렬)
export const mockGetPosts = (params?: {
  search?: string;
  category?: Category;
  sortField?: SortField;
  sortOrder?: SortOrder;
  userId?: string;
}): { items: Post[] } => {
  let posts = getMockPosts();

  // userId로 필터링
  if (params?.userId) {
    posts = posts.filter((post) => post.userId === params.userId);
  }

  // 검색어로 필터링
  if (params?.search) {
    const searchLower = params.search.toLowerCase();
    posts = posts.filter(
      (post) =>
        post.title.toLowerCase().includes(searchLower) ||
        post.body.toLowerCase().includes(searchLower) ||
        post.tags.some((tag) => tag.toLowerCase().includes(searchLower))
    );
  }

  // 카테고리로 필터링
  if (params?.category && params.category !== "All") {
    posts = posts.filter((post) => post.category === params.category);
  }

  // 정렬
  if (params?.sortField) {
    posts.sort((a, b) => {
      let aValue: string;
      let bValue: string;

      if (params.sortField === "title") {
        aValue = a.title.toLowerCase();
        bValue = b.title.toLowerCase();
      } else {
        aValue = a.createdAt;
        bValue = b.createdAt;
      }

      if (params.sortOrder === "asc") {
        return aValue > bValue ? 1 : aValue < bValue ? -1 : 0;
      } else {
        return aValue < bValue ? 1 : aValue > bValue ? -1 : 0;
      }
    });
  }

  return { items: posts };
};
