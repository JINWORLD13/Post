import styles from "./Modal.module.scss";

interface ModalProps {
  className?: string;
  contentClassName?: string;
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

const Modal = (props: ModalProps) => {
  if (!props.open) return null;

  return (
    <div
      className={`${styles.modal} ${props?.className || ""}`}
      onClick={props?.onClose}
    >
      <div
        className={`${styles["modal-content"]} ${
          props?.contentClassName || ""
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        {props?.children}
      </div>
    </div>
  );
};

export default Modal;
