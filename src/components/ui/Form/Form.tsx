interface FormProps extends React.PropsWithChildren {
  className?: string;
  onSubmit?: (e: React.FormEvent<HTMLFormElement>) => void;
}

const Form = (props: FormProps) => {
  return (
    <form className={`${props.className || ""}`} onSubmit={props.onSubmit}>
      {props.children}
    </form>
  );
};

export default Form;
