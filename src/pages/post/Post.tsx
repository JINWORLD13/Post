import PostFilters from "../../components/post/postfilters/PostFilters";
import PostTable from "../../components/post/postTable/PostTable";
import styles from "./Post.module.scss";
import Button from "../../components/ui/button/Button";
import Modal from "../../components/ui/modal/Modal";
import { useRef, useState, useEffect, useCallback } from "react";
import {
  Category,
  type Post as PostType,
  type SortField,
  type SortOrder,
} from "../../types/post";
import PostForm from "../../components/post/postForm/PostForm";
import {
  createPostApi,
  getPostsApi,
  updatePostByIdApi,
  deletePostByIdApi,
} from "../../api/post/postApi";
import useAuth from "../../hooks/useAuth";

const Post = () => {
  const { userId, isAuthenticated } = useAuth();
  const abortControllerRef = useRef<AbortController | null>(null);
  const [open, setOpen] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortField, setSortField] = useState<SortField>("createdAt");
  const [sortOrder, setSortOrder] = useState<SortOrder>("desc");
  const [categoryFilter, setCategoryFilter] = useState<Category>(Category.ALL);
  const [posts, setPosts] = useState<PostType[]>([]);
  const [editingPost, setEditingPost] = useState<PostType | null>(null);

  const handleSearchQueryChange = (query: string) => {
    setSearchQuery(query);
  };
  const handleSortFieldChange = (field: SortField) => {
    setSortField(field);
  };
  const handleSortOrderChange = (order: SortOrder) => {
    setSortOrder(order);
  };
  const handleCategoryFilterChange = (category: Category) => {
    setCategoryFilter(category);
  };
  // 게시글 목록 가져오기 (내가 쓴 게시물만)
  const fetchPosts = useCallback(async () => {
    if (!userId) {
      setPosts([]);
      return;
    }

    try {
      const params = {
        search: searchQuery || undefined,
        category: categoryFilter !== Category.ALL ? categoryFilter : undefined,
        sortField,
        sortOrder,
      };

      const result = await getPostsApi(params);

      // API 응답 구조: { items: [...], nextCursor: "...", prevCursor: "..." }
      let allPosts: PostType[] = [];
      if (result?.items && Array.isArray(result.items)) {
        allPosts = result.items;
      } else if (result && Array.isArray(result)) {
        // 배열로 직접 반환되는 경우 (예외 처리)
        allPosts = result;
      }

      // 현재 로그인한 사용자의 게시물만 필터링
      const myPosts = allPosts.filter((post) => post.userId === userId);
      setPosts(myPosts);
    } catch {
      // 에러 처리
      setPosts([]);
    }
  }, [searchQuery, sortField, sortOrder, categoryFilter, userId]);

  // 필터 상태 변경 시 데이터 재조회
  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  const handleSubmit = async (post: PostType) => {
    try {
      if (isLoading) return;
      setIsLoading(true);
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
      const abortController = new AbortController();
      abortControllerRef.current = abortController;

      let result;
      if (editingPost) {
        // 수정 모드: PostUpdateRequest 형식으로 변환 (id, userId, createdAt 제외)
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { id, userId, createdAt, ...updateData } = post;
        result = await updatePostByIdApi(editingPost.id, updateData);
      } else {
        // 생성 모드: PostCreateRequest 형식으로 변환 (id, userId, createdAt 제외)
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { id, userId, createdAt, ...createData } = post;
        result = await createPostApi({
          post: createData,
          signal: abortController.signal,
        });
      }

      if (result) {
        await fetchPosts(); // 목록 새로고침
        handleClose();
        setEditingPost(null);
        alert("게시글이 성공적으로 저장되었습니다.");
      } else {
        alert("게시글 저장에 실패했습니다. 다시 시도해주세요.");
      }
      return result;
    } catch (error) {
      const axiosError = error as {
        response?: { data?: { message?: string } };
        message?: string;
      };
      const errorMessage =
        axiosError?.response?.data?.message ||
        axiosError?.message ||
        "게시글 저장 중 오류가 발생했습니다.";
      alert(`게시글 저장 실패: ${errorMessage}`);
      return null;
    } finally {
      setIsLoading(false);
      abortControllerRef.current = null;
    }
  };

  const handleEdit = (post: PostType) => {
    setEditingPost(post);
    setOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("정말 삭제하시겠습니까?")) {
      return;
    }
    try {
      await deletePostByIdApi(id);
      await fetchPosts(); // 목록 새로고침
    } catch {
      // 에러 처리
    }
  };

  const handleOpen = () => {
    setEditingPost(null);
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
    setEditingPost(null);
  };
  return (
    <div className={`${styles.container}`}>
      {/* 제목 */}
      <div>
        <h1>Post</h1>
      </div>
      <div className={`${styles["post-wrapper"]}`}>
        {/* 필터 */}
        <PostFilters
          searchQuery={searchQuery}
          onSearchChange={handleSearchQueryChange}
          sortField={sortField}
          onSortFieldChange={handleSortFieldChange}
          sortOrder={sortOrder}
          onSortOrderChange={handleSortOrderChange}
          categoryFilter={categoryFilter}
          onCategoryFilterChange={handleCategoryFilterChange}
        />
        {/* 글작성 버튼 */}
        {isAuthenticated && (
          <div className={`${styles["button-box"]}`}>
            <Button onClick={handleOpen}>글작성</Button>
          </div>
        )}
        {/* 게시글 테이블 */}
        <PostTable posts={posts} onEdit={handleEdit} onDelete={handleDelete} />
        {/* 글작성/수정 */}
        <Modal open={open} onClose={handleClose}>
          <PostForm
            key={editingPost?.id || "new"}
            post={editingPost || undefined}
            onSubmit={handleSubmit}
            onCancel={handleClose}
            isLoading={isLoading}
          />
        </Modal>
      </div>
    </div>
  );
};

export default Post;
