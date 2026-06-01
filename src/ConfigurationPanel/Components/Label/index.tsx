import { KeyboardEvent, useEffect, useRef, useState } from "react";

interface IProps {
  value: string;
  fallback?: string;
  className?: string;
  onChange: (value: string) => void;
}

export default function EditableLabel({
  value,
  fallback = "Component",
  className = "",
  onChange,
}: IProps) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(value || fallback);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!editing) {
      setDraft(value || fallback);
    }
  }, [editing, fallback, value]);

  useEffect(() => {
    if (editing) {
      inputRef.current?.focus();
      inputRef.current?.select();
    }
  }, [editing]);

  const commit = () => {
    const nextValue = draft.trim() || fallback;
    setEditing(false);
    if (nextValue !== value) {
      onChange(nextValue);
    }
  };

  const cancel = () => {
    setDraft(value || fallback);
    setEditing(false);
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      commit();
    }

    if (event.key === "Escape") {
      cancel();
    }
  };

  if (editing) {
    return (
      <input
        ref={inputRef}
        value={draft}
        onChange={(event) => setDraft(event.target.value)}
        onBlur={commit}
        onKeyDown={handleKeyDown}
        className={`${className} min-w-0 rounded-md border border-violet-300/30 bg-white/[0.06] px-1 outline-none ring-2 ring-violet-300/20`}
      />
    );
  }

  return (
    <button
      type="button"
      onClick={() => setEditing(true)}
      className={`${className} min-w-0 cursor-text border-0 bg-transparent p-0 text-left`}
      title="Click to rename node"
    >
      {value || fallback}
    </button>
  );
}
