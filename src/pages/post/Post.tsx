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
import PostDetailModal from "../../components/post/postDetailModal/PostDetailModal";
import DeleteConfirmationModal from "../../components/post/deleteConfirmationModal/DeleteConfirmationModal";
import {
  createPostApi,
  getPostsApi,
  updatePostByIdApi,
  deletePostByIdApi,
} from "../../api/post/postApi";
import useAuth from "../../hooks/useAuth";
import AlertModal from "../../components/ui/alertModal/AlertModal";
import { showToast } from "../../components/ui/toast/toastUtils";

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
  const [selectedPost, setSelectedPost] = useState<PostType | null>(null);
  const [detailModalOpen, setDetailModalOpen] = useState<boolean>(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState<boolean>(false);
  const [postToDelete, setPostToDelete] = useState<PostType | null>(null);
  const [isDeleting, setIsDeleting] = useState<boolean>(false);
  const [errorModalOpen, setErrorModalOpen] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>("");

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
        userId, // Mock 모드에서 사용자별 필터링을 위해 추가
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

      // Mock 모드가 아닐 경우에만 클라이언트에서 필터링
      // Mock 모드에서는 서버에서 이미 필터링됨
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
        showToast("게시글이 성공적으로 저장되었습니다.", "success");
      } else {
        setErrorMessage(
          "게시글 저장에 실패했습니다.\n네트워크 연결을 확인하고 다시 시도해주세요."
        );
        setErrorModalOpen(true);
      }
      return result;
    } catch (error) {
      const axiosError = error as {
        response?: { data?: { message?: string } };
        message?: string;
      };
      const errorMsg =
        axiosError?.response?.data?.message ||
        axiosError?.message ||
        "알 수 없는 오류가 발생했습니다.";
      setErrorMessage(
        `게시글 저장 중 오류가 발생했습니다.\n\n오류 내용: ${errorMsg}`
      );
      setErrorModalOpen(true);
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

  const handleDelete = (id: string) => {
    const post = posts.find((p) => p.id === id);
    if (post) {
      setPostToDelete(post);
      setDeleteModalOpen(true);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!postToDelete || isDeleting) return;

    try {
      setIsDeleting(true);
      await deletePostByIdApi(postToDelete.id);
      await fetchPosts(); // 목록 새로고침
      setDeleteModalOpen(false);
      setPostToDelete(null);
    } catch (error) {
      const axiosError = error as {
        response?: { data?: { message?: string } };
        message?: string;
      };
      const errorMsg =
        axiosError?.response?.data?.message ||
        axiosError?.message ||
        "알 수 없는 오류가 발생했습니다.";
      setErrorMessage(
        `게시글 삭제 중 오류가 발생했습니다.\n\n오류 내용: ${errorMsg}`
      );
      setErrorModalOpen(true);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleDeleteModalClose = () => {
    if (!isDeleting) {
      setDeleteModalOpen(false);
      setPostToDelete(null);
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

  const handleTitleClick = (post: PostType) => {
    setSelectedPost(post);
    setDetailModalOpen(true);
  };

  const handleDetailModalClose = () => {
    setDetailModalOpen(false);
    setSelectedPost(null);
  };
  return (
    <div className={`${styles.container}`}>
      {/* 제목 */}
      <div>
        <h1>게시글</h1>
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
        <PostTable
          posts={posts}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onTitleClick={handleTitleClick}
        />
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
        {/* 게시글 상세 모달 */}
        <PostDetailModal
          post={selectedPost}
          open={detailModalOpen}
          onClose={handleDetailModalClose}
        />
        {/* 삭제 확인 모달 */}
        <DeleteConfirmationModal
          open={deleteModalOpen}
          onClose={handleDeleteModalClose}
          onConfirm={handleDeleteConfirm}
          postTitle={postToDelete?.title}
          isLoading={isDeleting}
        />
        {/* 에러 알림 모달 */}
        <AlertModal
          open={errorModalOpen}
          onClose={() => setErrorModalOpen(false)}
          message={errorMessage}
          title="오류 발생"
        />
      </div>
    </div>
  );
};

export default Post;
