import { useState } from "react";
import styles from "./Auth.module.scss";
import { Navigate } from "react-router-dom";
import { loginApi } from "../../api/auth/authApi";

interface Auth {
  email: string;
  password: string;
}

const Auth = () => {
  const [authForm, setAuthForm] = useState<Auth>({
    email: "",
    password: "",
  });
  const [isLogin, setIsLogin] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    setAuthForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const fetchLogin = async (signal?: AbortSignal) => {
    try {
      if (isLoading) return;
      setIsLoading(true);
      const result = await loginApi({
        email: authForm.email,
        password: authForm.password,
        signal,
      });
      setIsLogin(result?.success);
      return result;
    } catch (error) {
      setIsLogin(false);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    await fetchLogin();
  };

  if (isLogin) return <Navigate to="/" />;

  return <></>;
};

export default Auth;
