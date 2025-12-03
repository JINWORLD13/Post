interface InputProps {
  className?: string;
  type?: string;
  id?: string;
  name?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onFocus?: (e: React.FocusEvent<HTMLInputElement>) => void;
  onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void;
  onKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  value?: string;
  placeholder?: string;
  label?: string | undefined;
  required?: boolean;
  disabled?: boolean;
}

const Input = ({
  className,
  type,
  id,
  name,
  onChange,
  onFocus,
  onBlur,
  onKeyDown,
  value,
  placeholder,
  label,
  required,
  disabled,
}: InputProps) => {
  return (
    <>
      {label && <label htmlFor={id || ""}>{label}</label>}
      <input
        type={type || ""}
        id={id || ""}
        name={name || ""}
        className={`${className || ""}`}
        onChange={onChange}
        onFocus={onFocus}
        onBlur={onBlur}
        onKeyDown={onKeyDown}
        value={value || ""}
        placeholder={placeholder}
        required={required || false}
        disabled={disabled || false}
      />
    </>
  );
};

export default Input;
