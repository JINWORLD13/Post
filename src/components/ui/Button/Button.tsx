import React from "react";
import styles from "./Button.module.scss";

interface ButtonProps {
  className?: string;
  type?: "button" | "submit" | "reset";
  onClick?: () => void;
  disabled?: boolean;
}

const Button = (
  props: ButtonProps
) => {
  return (
    <button
      className={`${styles.button} ${props?.className || "" }`}
      type={props.type}
      onClick={props.onClick}
      disabled={props.disabled || false}
    >
      {props.children}
    </button>
  );
};

export default Button;
