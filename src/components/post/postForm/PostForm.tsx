import { useState, useMemo, useEffect } from "react";
import {
  Category,
  type Post,
  type PostCreateRequest,
  type PostUpdateRequest,
} from "../../../types/post";
import Form from "../../ui/form/Form";
import FormControl from "../../ui/formControl/FormControl";
import Input from "../../ui/input/Input";
import Textarea from "../../ui/textarea/TextArea";
import styles from "./PostForm.module.scss";
import Button from "../../ui/button/Button";
import Select from "../../ui/select/Select";
import useAuth from "../../../hooks/useAuth";
import Modal from "../../ui/modal/Modal";
import { showToast } from "../../ui/toast/toastUtils";

interface PostFormProps {
  post?: Post;
  onSubmit: (post: Post) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

const PostForm = ({ post, onSubmit, onCancel, isLoading }: PostFormProps) => {
  const { userId } = useAuth();

  // post prop에 따라 초기값 계산
  const initialFormData = useMemo(() => {
    if (post) {
      return {
        id: post.id,
        title: post.title || "",
        body: post.body || "",
        category: post.category || Category.NOTICE,
        tags: post.tags || [],
        createdAt: post.createdAt || "",
        userId: post.userId || "",
      };
    }
    return {
      id: "",
      title: "",
      body: "",
      category: Category.NOTICE,
      tags: [],
      createdAt: "",
      userId: userId || "",
    };
  }, [post, userId]);

  // key prop으로 컴포넌트가 리마운트되므로 useState 초기화가 자동으로 처리됨
  const [formData, setFormData] = useState(initialFormData);
  const [errorModalOpen, setErrorModalOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [tagInput, setTagInput] = useState("");

  // post prop이 변경될 때 formData를 업데이트 (수정 버튼 클릭 시 게시물 내용으로 채우기)
  useEffect(() => {
    setFormData(initialFormData);
    setTagInput("");
  }, [initialFormData]);

  const handleSubmit = (e?: React.FormEvent<HTMLFormElement>) => {
    if (e) {
      e.preventDefault();
    }

    if (!userId) {
      return;
    }

    // 제목과 본문 유효성 검사
    const trimmedTitle = formData.title.trim();
    const trimmedBody = formData.body.trim();

    // 빈값인 필드들을 모두 수집
    const emptyFields: string[] = [];
    if (!trimmedTitle) {
      emptyFields.push("제목");
    }
    if (!trimmedBody) {
      emptyFields.push("본문");
    }

    // 빈값이 있으면 모달 및 토스트 알림 표시 및 제출 방지
    if (emptyFields.length > 0) {
      const fieldNames = emptyFields.join(", ");
      const errorMsg = `다음 항목을 입력해주세요:\n${fieldNames}`;
      setErrorMessage(errorMsg);
      setErrorModalOpen(true);
      showToast(`${fieldNames}을(를) 입력해주세요.`, "error");
      return;
    }

    // 수정 모드에서 변경사항 체크
    if (post) {
      // 원본 데이터와 현재 폼 데이터 비교
      const hasChanges =
        post.title.trim() !== trimmedTitle ||
        post.body.trim() !== trimmedBody ||
        post.category !== formData.category ||
        JSON.stringify(post.tags || []) !== JSON.stringify(formData.tags || []);

      if (!hasChanges) {
        setErrorMessage(
          "수정된 내용이 없습니다.\n변경사항이 있을 때만 저장할 수 있습니다."
        );
        setErrorModalOpen(true);
        return;
      }

      // 수정 모드: 변경된 필드만 전송
      const updateData: PostUpdateRequest = {
        title: trimmedTitle,
        body: trimmedBody,
        category: formData.category,
        tags: formData.tags,
      };
      // 타입 호환성을 위해 Post로 변환 (실제로는 PostUpdateRequest가 전송됨)
      onSubmit({ ...post, ...updateData } as Post);
    } else {
      // 생성 모드: PostCreateRequest 형식으로 전송
      const createData: PostCreateRequest = {
        title: trimmedTitle,
        body: trimmedBody,
        category: formData.category,
        tags: formData.tags,
      };
      // 타입 호환성을 위해 Post로 변환 (실제로는 PostCreateRequest가 전송됨)
      onSubmit({
        ...createData,
        id: "",
        userId,
        createdAt: "",
      } as Post);
    }
  };

  // 엔터 키로 제출 (Input 필드에서만, tags 필드 제외)
  const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    const target = e.target as HTMLInputElement;
    // tags 필드는 handleTagKeyDown에서 처리
    if (target.name === "tags") {
      return;
    }

    if (e.key === "Enter") {
      e.preventDefault();
      // 에러 모달이 열려있으면 제출하지 않음
      if (errorModalOpen) {
        return;
      }
      // 제출 버튼이 비활성화되지 않았을 때만 제출
      const isSubmitDisabled = isLoading || !userId;
      if (!isSubmitDisabled) {
        handleSubmit();
      }
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    // tags 필드는 tagInput state로 관리
    if (name === "tags") {
      setTagInput(value);
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleTagKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addTag();
    }
  };

  const addTag = () => {
    const trimmedTag = tagInput.trim();

    // 빈 값이면 무시
    if (!trimmedTag) {
      return;
    }

    // 이미 최대 개수에 도달했으면 무시
    if (formData.tags.length >= 5) {
      return;
    }

    // # 제거 (이미 있으면 제거하고 다시 추가)
    const tagWithoutHash = trimmedTag.startsWith("#")
      ? trimmedTag.slice(1).trim()
      : trimmedTag;

    // 빈 값이면 무시
    if (!tagWithoutHash) {
      return;
    }

    // 24자 제한
    if (tagWithoutHash.length > 24) {
      return;
    }

    // 중복 체크
    if (formData.tags.includes(tagWithoutHash)) {
      setTagInput("");
      return;
    }

    // 태그 추가
    const newTags = [...formData.tags, tagWithoutHash];
    setFormData({ ...formData, tags: newTags });
    setTagInput("");
  };

  const removeTag = (indexToRemove: number) => {
    const newTags = formData.tags.filter((_, index) => index !== indexToRemove);
    setFormData({ ...formData, tags: newTags });
  };

  const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const categoryOptions = [
    { value: Category.ALL, label: "전체" },
    { value: Category.NOTICE, label: "공지" },
    { value: Category.QNA, label: "Q&A" },
    { value: Category.FREE, label: "자유" },
  ];

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>{post ? "게시글 수정" : "게시글 작성"}</h2>
      <Form className={styles.form} onSubmit={handleSubmit}>
        <FormControl className={styles["form-field"]}>
          <Input
            type="text"
            label="제목"
            name="title"
            onChange={handleInputChange}
            onKeyDown={handleInputKeyDown}
            value={formData.title}
            placeholder="제목을 입력하세요"
          />
        </FormControl>
        <FormControl className={styles["form-field"]}>
          <Select
            label="카테고리"
            name="category"
            onChange={handleSelectChange}
            value={formData.category}
            options={categoryOptions}
          />
        </FormControl>
        <FormControl className={styles.body}>
          <Textarea
            label="본문"
            name="body"
            onChange={handleTextareaChange}
            value={formData.body}
            rows={10}
            maxLength={2000}
            placeholder="본문을 입력하세요 (최대 2000자)"
          />
        </FormControl>
        <FormControl className={styles.tags}>
          <Input
            type="text"
            label="태그"
            name="tags"
            onChange={handleInputChange}
            onKeyDown={handleTagKeyDown}
            value={tagInput}
            placeholder={
              formData.tags.length < 5
                ? "태그 입력 후 엔터 (최대 5개)"
                : "최대 5개까지 추가할 수 있습니다"
            }
            disabled={formData.tags.length >= 5}
          />
          {formData.tags.length > 0 && (
            <div className={styles["tags-list"]}>
              {formData.tags.map((tag, index) => (
                <div key={index} className={styles["tag-chip"]}>
                  <span className={styles["tag-text"]}>#{tag}</span>
                  <button
                    type="button"
                    className={styles["tag-remove"]}
                    onClick={() => removeTag(index)}
                    aria-label={`${tag} 태그 제거`}
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          )}
        </FormControl>
        <div className={styles["button-box"]}>
          <Button
            className={styles["button-cancel"]}
            onClick={onCancel}
            disabled={isLoading}
          >
            취소
          </Button>
          <Button
            className={styles["button-submit"]}
            onClick={handleSubmit}
            disabled={isLoading || !userId}
          >
            {isLoading ? "처리 중..." : post ? "수정" : "제출"}
          </Button>
        </div>
      </Form>
      {/* 에러 모달 - blink 모드로 하단 중앙에 잠깐 표시 */}
      <Modal
        open={errorModalOpen}
        onClose={() => setErrorModalOpen(false)}
        blink={true}
      >
        <p className={styles["error-modal-message"]}>{errorMessage}</p>
      </Modal>
    </div>
  );
};

export default PostForm;
