import React, { useState, useRef, useEffect } from "react";
import styles from "./index.module.css";
import { Option } from "./types";

// Inline SVG icons (no external icon library)
function ChevronDownIcon({ className = "" }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M6 9l6 6 6-6" />
    </svg>
  );
}

function CheckIcon({ className = "" }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M20 6L9 17l-5-5" />
    </svg>
  );
}

export interface IProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "onChange" | "onSelect" | "type" | "value"> {
  options?: Option[];
  label?: string;
  onChange?: (value: Option["value"]) => void;
  value?: string | number;
}

const Select = React.forwardRef<HTMLInputElement, IProps>(
  ({
    options = [
      { label: "Option 1", value: "OPTION_1" },
      { label: "Option 2", value: "OPTION_2" },
      { label: "Option 3", value: "OPTION_3" },
    ],
    onChange,
    onBlur,
    name,
    value,
    label = "Select an option:",
    ...rest
  }: IProps,
  ref) => {
    const [open, setOpen] = useState(false);
    const [selected, setSelected] = useState<Option>(options[0]);
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
      if (typeof value !== "undefined") {
        const defaultOption = options.find((option) => option.value === value);
        if (defaultOption) {
          setSelected(defaultOption);
        }
      }
    }, [options, value]);

    useEffect(() => {
      const handleClickOutside = (e: MouseEvent) => {
        if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
          setOpen(false);
        }
      };
      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
      <div className={styles.container} ref={dropdownRef}>
        <label className={styles.labelStyle}>{label}</label>
        <button type="button" onClick={() => setOpen(!open)} className={styles.trigger}>
          <span className={styles.label}>{selected.label}</span>
          <ChevronDownIcon className={styles.icon} />
        </button>

        <input
          type="hidden"
          name={name}
          value={selected.value}
          onBlur={onBlur}
          ref={ref as React.Ref<HTMLInputElement>}
          readOnly
          {...rest}
        />

        {open && (
          <div className={styles.dropdown}>
            {options.map((option) => (
              <div
                key={option.value}
                onClick={() => {
                  if (onChange) {
                    onChange(option.value);
                  }
                  setSelected(option);
                  setOpen(false);
                }}
                className={styles.option}
              >
                <span className={styles.optionText}>{option.label}</span>
                {selected.label === option.label && <CheckIcon className={styles.checkIcon} />}
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }
);

Select.displayName = "Select";

export default Select;
