import { useState, useRef, useEffect } from "react";
import styles from "./index.module.css";

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

export default function Select() {
  const options = [
    "Option One",
    "Option Two",
    "Option Three",
    "Option Four",
  ];

  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState(options[0]);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: any) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className={styles.container} ref={dropdownRef}>
      {/* Trigger */}
      <button
        onClick={() => setOpen(!open)}
        className={styles.trigger}
      >
        <span className={styles.label}>{selected}</span>
        <ChevronDownIcon className={styles.icon} />
      </button>

      {/* Dropdown */}
      {open && (
        <div className={styles.dropdown}>
          {options.map((option) => (
            <div
              key={option}
              onClick={() => {
                setSelected(option);
                setOpen(false);
              }}
              className={styles.option}
            >
              <span className={styles.optionText}>{option}</span>

              {/* Checkmark */}
              {selected === option && (
                <CheckIcon className={styles.checkIcon} />
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}