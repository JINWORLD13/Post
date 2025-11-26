import { useRef, useState } from "react";
import styles from "./Auth.module.scss";
import { Navigate } from "react-router-dom";
import { loginApi } from "../../api/auth/authApi";
import Card from "../../components/ui/Card/Card";
import Input from "../../components/ui/Input/Input";
import FormControl from "../../components/ui/FormControl/FormControl";
import Form from "../../components/ui/Form/Form";
import Button from "../../components/ui/Button/Button";
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
      login(result?.token);
      return result;
    } catch (error) {
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
      <Card className={`${styles["login-container"]}`}>
        <Form onSubmit={onSubmit}>
          <FormControl>
            <Input
              type="email"
              name="email"
              onChange={handleInputChange}
              onFocus={handleEmailFocus}
              onBlur={handleEmailBlur}
              value={authForm.email}
              placeholder={isEmailFocused ? "Email" : ""}
              label="Email"
              required
            />
          </FormControl>
          <FormControl>
            <Input
              type="password"
              name="password"
              onChange={handleInputChange}
              onFocus={handlePasswordFocus}
              onBlur={handlePasswordBlur}
              value={authForm.password}
              placeholder={isPasswordFocused ? "Password" : ""}
              label="Password"
              required
            />
          </FormControl>
          <div className={`${styles["login-button-box"]}`}>
            <Button type="submit" disabled={isLoading}>
              Login
            </Button>
          </div>
        </Form>
      </Card>
    </div>
  );
};

export default Auth;
