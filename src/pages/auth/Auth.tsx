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
  const [error, setError] = useState<string | null>(null);
  const { login, isAuthenticated } = useAuth();

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
      setError(null);
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
      if (result?.token && result?.user) {
        login(result.token, result.user);
      } else {
        setError("로그인에 실패했습니다. 이메일과 비밀번호를 확인해주세요.");
      }
      return result;
    } catch (error: unknown) {
      let errorMessage =
        "로그인에 실패했습니다. 이메일과 비밀번호를 확인해주세요.";
      if (error && typeof error === "object" && "response" in error) {
        const axiosError = error as {
          response?: { data?: { message?: string } };
        };
        errorMessage = axiosError.response?.data?.message || errorMessage;
      } else if (error instanceof Error) {
        errorMessage = error.message || errorMessage;
      }
      setError(errorMessage);
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
      <Card className={`${styles["login-container"]}`}>
        <Form onSubmit={onSubmit}>
          <FormControl inputDataClassName={formControlStyles.login}>
            <LoginInput
              type="email"
              name="email"
              onChange={handleInputChange}
              onFocus={handleEmailFocus}
              onBlur={handleEmailBlur}
              value={authForm.email}
              placeholder={isEmailFocused ? "Email" : ""}
              label={authForm?.email ? "" : "Email"}
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
              placeholder={isPasswordFocused ? "Password" : ""}
              label={authForm?.password ? "" : "Password"}
              required
            />
          </FormControl>
          {error && <div className={`${styles["error-message"]}`}>{error}</div>}
          <div className={`${styles["login-button-box"]}`}>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "로그인 중..." : "Login"}
            </Button>
          </div>
        </Form>
      </Card>
    </div>
  );
};

export default Auth;
