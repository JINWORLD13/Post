import styles from "./DeleteConfirmationModal.module.scss";
import Button from "../../ui/button/Button";
import Modal from "../../ui/modal/Modal";

interface DeleteConfirmationModalProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  postTitle?: string;
  isLoading?: boolean;
}

const DeleteConfirmationModal = ({
  open,
  onClose,
  onConfirm,
  postTitle,
  isLoading = false,
}: DeleteConfirmationModalProps) => {
  const handleConfirm = () => {
    onConfirm();
  };

  return (
    <Modal open={open} onClose={onClose} contentClassName={styles["delete-modal-content"]}>
      <div className={styles["delete-confirmation-modal"]}>
        <div className={styles["delete-confirmation-header"]}>
          <h2 className={styles["delete-confirmation-title"]}>
            게시글 삭제
          </h2>
          <button
            className={styles["close-button"]}
            onClick={onClose}
            aria-label="닫기"
            disabled={isLoading}
          >
            ×
          </button>
        </div>

        <div className={styles["delete-confirmation-content"]}>
          <p className={styles["delete-confirmation-message"]}>
            이 게시글을 정말 삭제하시겠습니까?
          </p>
          {postTitle && (
            <div className={styles["post-title-preview"]}>
              <span className={styles["preview-label"]}>삭제할 게시글</span>
              <span className={styles["preview-value"]}>{postTitle}</span>
            </div>
          )}
          <p className={styles["delete-confirmation-warning"]}>
            삭제된 게시글은 복구할 수 없습니다. 신중히 결정해주세요.
          </p>
        </div>

        <div className={styles["delete-confirmation-footer"]}>
          <Button
            className={styles["button-cancel"]}
            onClick={onClose}
            disabled={isLoading}
          >
            취소
          </Button>
          <Button
            className={styles["button-delete"]}
            onClick={handleConfirm}
            disabled={isLoading}
          >
            {isLoading ? "삭제 중..." : "삭제"}
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default DeleteConfirmationModal;

