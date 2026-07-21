import { useRef } from "react";

export const EditableLabel = ({ value, onChange, testId, className = "" }) => {
  const ref = useRef(null);

  const handleBlur = (e) => {
    const next = e.currentTarget.textContent?.trim() || "";
    if (next && next !== value) onChange(next);
    else if (!next) e.currentTarget.textContent = value;
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      ref.current?.blur();
    }
    if (e.key === "Escape") {
      e.preventDefault();
      if (ref.current) ref.current.textContent = value;
      ref.current?.blur();
    }
  };

  return (
    <span
      ref={ref}
      contentEditable
      suppressContentEditableWarning
      role="textbox"
      aria-label="Editable person name"
      data-testid={testId}
      onBlur={handleBlur}
      onKeyDown={handleKeyDown}
      className={`editable-label cursor-text px-0.5 ${className}`}
      title="Click to rename"
    >
      {value}
    </span>
  );
};
