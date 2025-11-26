import React from "react";
import styles from "./Button.module.scss";

const Button = (
  props: React.PropsWithChildren<{
    className?: string;
    type?: "button" | "submit" | "reset";
    onClick?: () => void;
  }>
) => {
  return (
    <button
      className={`${styles.button} ${props.className}`}
      type={props.type || "button"}
      onClick={props.onClick}
    >
      {props.children}
    </button>
  );
};

export default Button;
