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

  // post prop이 변경될 때 formData를 업데이트 (수정 버튼 클릭 시 게시물 내용으로 채우기)
  useEffect(() => {
    setFormData(initialFormData);
  }, [initialFormData]);

  const handleSubmit = () => {
    if (!userId) {
      return;
    }

    // 새 게시글 작성 시 API 스펙에 맞게 id와 createdAt 제거
    if (post) {
      // 수정 모드: 변경된 필드만 전송
      const updateData: PostUpdateRequest = {
        title: formData.title,
        body: formData.body,
        category: formData.category,
        tags: formData.tags,
      };
      // 타입 호환성을 위해 Post로 변환 (실제로는 PostUpdateRequest가 전송됨)
      onSubmit({ ...post, ...updateData } as Post);
    } else {
      // 생성 모드: PostCreateRequest 형식으로 전송
      const createData: PostCreateRequest = {
        title: formData.title,
        body: formData.body,
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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    // tags 필드
    if (name === "tags") {
      const tagsArray = value
        .split(",")
        .map((tag) => tag.trim())
        .filter((tag) => tag.length > 0)
        .filter((tag) => tag.length <= 24) // 각 태그 24자 이내
        .slice(0, 5); // 최대 5개

      // Set으로 중복 제거
      const newTags = Array.from(new Set(tagsArray));

      setFormData({ ...formData, [name]: newTags });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const categoryOptions = [
    { value: Category.ALL, label: "All" },
    { value: Category.NOTICE, label: "Notice" },
    { value: Category.QNA, label: "Q&A" },
    { value: Category.FREE, label: "Free" },
  ];

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>{post ? "게시글 수정" : "게시글 작성"}</h2>
      <Form className={styles.form}>
        <FormControl className={styles["form-field"]}>
          <Input
            type="text"
            label="Title"
            name="title"
            onChange={handleInputChange}
            value={formData.title}
            placeholder="제목을 입력하세요"
          />
        </FormControl>
        <FormControl className={styles["form-field"]}>
          <Select
            label="Category"
            name="category"
            onChange={handleSelectChange}
            value={formData.category}
            options={categoryOptions}
          />
        </FormControl>
        <FormControl className={styles.body}>
          <Textarea
            label="Body"
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
            label="Tags"
            name="tags"
            onChange={handleInputChange}
            value={Array.isArray(formData.tags) ? formData.tags.join(", ") : ""}
            placeholder="태그를 쉼표로 구분하여 입력하세요 (최대 5개)"
          />
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
            disabled={
              isLoading ||
              (formData.title === "" && formData.body === "") ||
              !userId
            }
          >
            {isLoading ? "처리 중..." : "제출"}
          </Button>
        </div>
      </Form>
    </div>
  );
};

export default PostForm;
