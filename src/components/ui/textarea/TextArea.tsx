interface TextareaProps {
  className?: string;
  id?: string;
  name?: string;
  onChange?: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  onFocus?: (e: React.FocusEvent<HTMLTextAreaElement>) => void;
  onBlur?: (e: React.FocusEvent<HTMLTextAreaElement>) => void;
  value?: string;
  placeholder?: string;
  label?: string;
  required?: boolean;
  rows?: number;
  maxLength?: number;
}

const Textarea = ({
  className,
  id,
  name,
  onChange,
  onFocus,
  onBlur,
  value,
  placeholder,
  label,
  required,
  rows = 5,
  maxLength,
}: TextareaProps) => {
  return (
    <>
      {label && <label htmlFor={id || ""}>{label}</label>}
      <textarea
        id={id || ""}
        name={name || ""}
        className={className || ""}
        onChange={onChange}
        onFocus={onFocus}
        onBlur={onBlur}
        value={value || ""}
        placeholder={placeholder}
        required={required || false}
        rows={rows}
        maxLength={maxLength}
      />
    </>
  );
};

export default Textarea;
