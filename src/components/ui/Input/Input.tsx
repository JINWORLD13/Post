import React from "react";

const Input = (
  props: React.PropsWithChildren<{
    className?: string;
    type?: string;
    id?: string;
    name?: string;
    onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
    value?: string;
    placeholder?: string;
    label?: string;
    required?: boolean;
  }>
) => {
  return (
    <>
      <input
        type={props?.type}
        id={props?.id}
        name={props?.name}
        className={`${props?.className}`}
        onChange={props?.onChange}
        value={props?.value}
        placeholder={props?.placeholder}
        required={props?.required}
      />
      <div className={"underline"} />
      <label htmlFor={props?.id}>{props?.label}</label>
    </>
  );
};

export default Input;
