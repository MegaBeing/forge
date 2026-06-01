import styles from './index.module.css'
import React from "react";
interface IProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "onChange" | "value"> {
  label?: string;
  onChange?: ((value: string) => void) | React.ChangeEventHandler<HTMLInputElement>;
  value?: string;
  required?: boolean;
}
export const TextInput = React.forwardRef<HTMLInputElement, IProps>(
  ({ label = "Text Input", onChange, value, required, ...rest }, ref) => {
    // If value and onChange are provided, use controlled mode, else let react-hook-form handle
    const inputProps: React.InputHTMLAttributes<HTMLInputElement> = {
      className: styles.input,
      placeholder: "Type your text",
      required,
      type: "text",
      ...rest,
    };
    if (typeof value !== "undefined" && typeof onChange === "function" && onChange.length === 1) {
      // If onChange expects a string (custom controlled)
      inputProps.value = value;
      inputProps.onChange = (e: React.ChangeEvent<HTMLInputElement>) => (onChange as (value: string) => void)(e.target.value);
    } else if (typeof onChange === "function") {
      // If onChange is from react-hook-form (expects event)
      inputProps.onChange = onChange as React.ChangeEventHandler<HTMLInputElement>;
    }
    return (
      <>
        <div>{label}</div>
        <div className={styles.form}>
          <button type="button">
            <svg
              width="17"
              height="16"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              role="img"
              aria-labelledby="search"
            >
              <path
                d="M7.667 12.667A5.333 5.333 0 107.667 2a5.333 5.333 0 000 10.667zM14.334 14l-2.9-2.9"
                stroke="currentColor"
                strokeWidth="1.333"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
          <input ref={ref} {...inputProps} />
          <button className={styles.reset} type="reset">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
      </>
    );
  }
);
TextInput.displayName = "TextInput";
