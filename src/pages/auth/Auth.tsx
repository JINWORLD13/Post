import { useRef, useState } from "react";
import styles from "./Auth.module.scss";
import formControlStyles from "../../components/ui/formControl/FormControl.module.scss";
import { Navigate } from "react-router-dom";
import { loginApi } from "../../api/auth/authApi";
import Card from "../../components/ui/card/Card";
import LoginInput from "../../components/ui/input/LoginInput";
import FormControl from "../../components/ui/formControl/FormControl";
import Form from "../../components/ui/form/Form";
import Button from "../../components/ui/button/Button";
import useAuth from "../../hooks/useAuth";

interface Auth {
  email: string;
  password: string;
}

const Auth = () => {
  const abortControllerRef = useRef<AbortController | null>(null);
  const [authForm, setAuthForm] = useState<Auth>({
    email: "",
    password: "",
  });

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isPasswordFocused, setIsPasswordFocused] = useState<boolean>(false);
  const [isEmailFocused, setIsEmailFocused] = useState<boolean>(false);
  const { login, logout, isAuthenticated } = useAuth();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    setAuthForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  // focus 이벤트 핸들러(placeholder용)
  const handleEmailFocus = () => {
    setIsEmailFocused(true);
  };
  const handlePasswordFocus = () => {
    setIsPasswordFocused(true);
  };
  // blur 이벤트 핸들러(placeholder용)
  const handleEmailBlur = () => {
    setIsEmailFocused(false);
  };
  const handlePasswordBlur = () => {
    setIsPasswordFocused(false);
  };

  const fetchLogin = async () => {
    try {
      if (isLoading) return;
      setIsLoading(true);
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
      const abortController = new AbortController();
      abortControllerRef.current = abortController;

      const result = await loginApi({
        email: authForm.email,
        password: authForm.password,
        signal: abortController.signal,
      });
      // API 응답에서 user 정보가 있으면 사용하고, 없으면 email로부터 생성
      const user = result?.user || {
        id: result?.userId || "",
        email: authForm.email,
      };
      login(result?.token, user);
      // 로그인 성공 후 홈 화면으로 이동하면서 새로고침
      window.location.href = "/";
      return result;
    } catch {
      logout();
      return null;
    } finally {
      setIsLoading(false);
      abortControllerRef.current = null;
    }
  };

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    await fetchLogin();
  };

  if (isAuthenticated) return <Navigate to="/" />;

  return (
    <div className={`${styles.container}`}>
      <div className={styles["background-decoration"]}>
        <div className={styles["gradient-orb"]}></div>
        <div className={styles["gradient-orb"]}></div>
        <div className={styles["gradient-orb"]}></div>
      </div>
      <Card className={`${styles["login-container"]}`}>
        <div className={styles["login-header"]}>
          <h2 className={styles["login-title"]}>환영합니다</h2>
          <p className={styles["login-subtitle"]}>계정에 로그인하여 시작하세요</p>
        </div>
        <Form onSubmit={onSubmit}>
          <FormControl inputDataClassName={formControlStyles.login}>
            <LoginInput
              type="email"
              name="email"
              onChange={handleInputChange}
              onFocus={handleEmailFocus}
              onBlur={handleEmailBlur}
              value={authForm.email}
              placeholder={isEmailFocused ? "이메일" : ""}
              label={authForm?.email ? "" : "이메일"}
              required
            />
          </FormControl>
          <FormControl inputDataClassName={formControlStyles.login}>
            <LoginInput
              type="password"
              name="password"
              onChange={handleInputChange}
              onFocus={handlePasswordFocus}
              onBlur={handlePasswordBlur}
              value={authForm.password}
              placeholder={isPasswordFocused ? "비밀번호" : ""}
              label={authForm?.password ? "" : "비밀번호"}
              required
            />
          </FormControl>
          <div className={`${styles["login-button-box"]}`}>
            <Button type="submit" disabled={isLoading} className={styles["login-button"]}>
              {isLoading ? "로그인 중..." : "로그인"}
            </Button>
          </div>
        </Form>
      </Card>
    </div>
  );
};

export default Auth;
