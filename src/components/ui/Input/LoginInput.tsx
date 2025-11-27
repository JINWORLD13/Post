interface InputProps {
  className?: string;
  type?: string;
  id?: string;
  name?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onFocus?: (e: React.FocusEvent<HTMLInputElement>) => void;
  onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void;
  value?: string;
  placeholder?: string;
  label?: string | undefined;
  required?: boolean;
}

const LoginInput = ({
  className,
  type,
  id,
  name,
  onChange,
  onFocus,
  onBlur,
  value,
  placeholder,
  label,
  required,
  ...props
}: InputProps) => {
  return (
    <>
      <input
        type={type || ""}
        id={id || ""}
        name={name || ""}
        className={`${className || ""}`}
        onChange={onChange}
        onFocus={onFocus}
        onBlur={onBlur}
        value={value || ""}
        placeholder={placeholder || ""}
        required={required || false}
      />

      <div className={"underline"} />
      {label && <label htmlFor={id}>{label}</label>}
    </>
  );
};

export default LoginInput;
