import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import styles from "./Modal.module.scss";

interface ModalProps {
  className?: string;
  contentClassName?: string;
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
  blink?: boolean;
}

const Modal = (props: ModalProps) => {
  const modalRef = useRef<HTMLDivElement>(null);
  const { open, onClose, blink } = props;

  // blink 모드일 때 자동으로 닫기
  useEffect(() => {
    if (blink && open) {
      const timer = setTimeout(() => {
        onClose();
      }, 2000); // 2초 후 자동 닫기

      return () => clearTimeout(timer);
    }
  }, [blink, open, onClose]);

  // ESC 키로 모달 닫기, 엔터 키로 제출/삭제 버튼 클릭
  useEffect(() => {
    if (!open) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      // 모달이 열려있지 않거나 ref가 없으면 무시
      if (!modalRef.current) return;

      // ESC 키로 모달 닫기
      if (e.key === "Escape" || e.keyCode === 27) {
        e.preventDefault();
        onClose();
        return;
      }

      // 엔터 키 처리
      if (e.key === "Enter" || e.keyCode === 13) {
        // 모달 ref 내부에서 포커스된 요소 확인
        const activeElement = modalRef.current.querySelector(
          ":focus"
        ) as HTMLElement | null;

        // 입력 필드에 포커스가 있으면 기본 동작 허용 (폼 제출 등)
        if (
          activeElement &&
          (activeElement.tagName === "INPUT" ||
            activeElement.tagName === "TEXTAREA" ||
            activeElement.tagName === "SELECT")
        ) {
          // 입력 필드가 포커스되어 있으면 기본 동작 허용
          return;
        }

        // 모달 내부의 모든 버튼 찾기
        const buttons = modalRef.current.querySelectorAll("button");
        const buttonArray = Array.from(buttons).filter((btn) => !btn.disabled);

        // 활성화된 버튼이 없으면 무시
        if (buttonArray.length === 0) {
          return;
        }

        // 버튼이 1개만 있는 경우 (확인, 닫기 버튼만 있는 모달)
        if (buttonArray.length === 1) {
          e.preventDefault();
          buttonArray[0].click();
          return;
        }

        // 취소 버튼 제외한 버튼들 (주요 액션 버튼)
        const nonCancelButtons = buttonArray.filter((btn) => {
          const text = btn.textContent?.trim().toLowerCase() || "";
          const className = btn.className?.toLowerCase() || "";
          const ariaLabel = btn.getAttribute("aria-label")?.toLowerCase() || "";

          // 닫기 버튼(×) 제외
          if (
            text === "×" ||
            ariaLabel === "닫기" ||
            className.includes("close")
          ) {
            return false;
          }

          return (
            text !== "취소" && !className.includes("cancel") && !btn.disabled
          );
        });

        // 취소 버튼 찾기
        const cancelButtons = buttonArray.filter((btn) => {
          const text = btn.textContent?.trim().toLowerCase() || "";
          const className = btn.className?.toLowerCase() || "";
          return text === "취소" || className.includes("cancel");
        });

        // 취소 버튼과 함께 2개 이상 버튼이 있는 경우
        if (cancelButtons.length >= 1 && nonCancelButtons.length >= 1) {
          // 주요 액션 버튼 찾기 (제출, 수정, 삭제, 확인 등)
          const primaryButton = nonCancelButtons.find((btn) => {
            const text = btn.textContent?.trim().toLowerCase() || "";
            const className = btn.className?.toLowerCase() || "";

            return (
              text === "제출" ||
              text.includes("제출") ||
              text === "수정" ||
              text.includes("수정") ||
              text === "삭제" ||
              text.includes("삭제") ||
              text === "확인" ||
              text.includes("확인") ||
              className.includes("submit") ||
              className.includes("edit") ||
              className.includes("delete") ||
              className.includes("confirm") ||
              className.includes("button-submit") ||
              className.includes("button-delete") ||
              className.includes("button-edit")
            );
          });

          if (primaryButton && !primaryButton.disabled) {
            e.preventDefault();
            primaryButton.click();
            return;
          }
        }

        // 위 조건에 맞지 않으면 첫 번째 활성화된 버튼 클릭
        if (nonCancelButtons.length > 0 && !nonCancelButtons[0].disabled) {
          e.preventDefault();
          nonCancelButtons[0].click();
        }
      }
    };

    // window 객체에 이벤트 리스너 추가 (document 대신)
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [open, onClose]);

  if (!props.open) return null;

  const modalContent = (
    <div
      ref={modalRef}
      className={`${styles.modal} ${props?.className || ""} ${
        blink ? styles["blink-modal"] : ""
      }`}
      onClick={blink ? undefined : props?.onClose}
      tabIndex={-1}
    >
      <div
        className={`${styles["modal-content"]} ${
          props?.contentClassName || ""
        } ${blink ? styles["blink-content"] : ""}`}
        onClick={(e) => e.stopPropagation()}
      >
        {props?.children}
      </div>
    </div>
  );

  // Portal을 사용하여 body에 직접 렌더링
  return createPortal(modalContent, document.body);
};

export default Modal;
