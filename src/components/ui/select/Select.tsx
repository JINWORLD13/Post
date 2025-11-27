interface SelectProps {
  className?: string;
  id?: string;
  name?: string;
  onChange?: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  value?: string;
  label?: string | undefined;
  required?: boolean;
  options: { value: string; label: string }[];
}

const Select: React.FC<SelectProps> = ({
  className,
  id,
  name,
  onChange,
  value,
  label,
  required,
  options,
} : SelectProps) => {
  return (
    <>
      {label && <label htmlFor={id}>{label}</label>}
      <select
        id={id || ""}
        name={name || ""}
        className={className || ""}
        onChange={onChange}
        value={value || ""}
        required={required || false}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </>
  );
};

export default Select;
