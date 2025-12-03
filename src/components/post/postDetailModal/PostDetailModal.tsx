import styles from "./PostDetailModal.module.scss";
import { type Post } from "../../../types/post";
import Button from "../../ui/button/Button";
import Modal from "../../ui/modal/Modal";

interface PostDetailModalProps {
  post: Post | null;
  open: boolean;
  onClose: () => void;
}

const PostDetailModal = ({ post, open, onClose }: PostDetailModalProps) => {
  if (!post) return null;

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("ko-KR", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <Modal open={open} onClose={onClose}>
      <div className={styles["post-detail-modal"]}>
        <div className={styles["post-detail-header"]}>
          <button
            className={styles["close-button"]}
            onClick={onClose}
            aria-label="닫기"
          >
            ×
          </button>
        </div>

        <div className={styles["post-detail-content"]}>
          <div className={styles["post-detail-meta"]}>
            <div className={styles["meta-item"]}>
              <span className={styles["meta-label"]}>카테고리:</span>
              <span className={styles["meta-value"]}>{post.category}</span>
            </div>
            <div className={styles["meta-item"]}>
              <span className={styles["meta-label"]}>작성자:</span>
              <span className={styles["meta-value"]}>
                {post.email || post.userId}
              </span>
            </div>
            <div className={styles["meta-item"]}>
              <span className={styles["meta-label"]}>작성일:</span>
              <span className={styles["meta-value"]}>
                {formatDate(post.createdAt)}
              </span>
            </div>
            {post.tags && post.tags.length > 0 && (
              <div className={styles["meta-item"]}>
                <span className={styles["meta-label"]}>태그:</span>
                <div className={styles["tags-container"]}>
                  {post.tags.map((tag, index) => (
                    <span key={index} className={styles.tag}>
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          <h2 className={styles["post-detail-title"]}>{post.title}</h2>

          <div className={styles["post-detail-body"]}>
            <div className={styles["body-content"]}>{post.body}</div>
          </div>
        </div>

        <div className={styles["post-detail-footer"]}>
          <Button onClick={onClose}>닫기</Button>
        </div>
      </div>
    </Modal>
  );
};

export default PostDetailModal;
