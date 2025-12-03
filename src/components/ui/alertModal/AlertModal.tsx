import styles from "./AlertModal.module.scss";
import Button from "../button/Button";
import Modal from "../modal/Modal";

interface AlertModalProps {
  open: boolean;
  onClose: () => void;
  message: string;
  title?: string;
}

const AlertModal = ({
  open,
  onClose,
  message,
  title = "알림",
}: AlertModalProps) => {
  return (
    <Modal open={open} onClose={onClose}>
      <div className={styles["alert-modal"]}>
        <div className={styles["alert-modal-header"]}>
          <h2 className={styles["alert-modal-title"]}>{title}</h2>
          <button
            className={styles["close-button"]}
            onClick={onClose}
            aria-label="닫기"
          >
            ×
          </button>
        </div>

        <div className={styles["alert-modal-content"]}>
          <p className={styles["alert-modal-message"]}>{message}</p>
        </div>

        <div className={styles["alert-modal-footer"]}>
          <Button onClick={onClose}>확인</Button>
        </div>
      </div>
    </Modal>
  );
};

export default AlertModal;

