interface EditorPanelProps {
  id: string;
  eyebrow: string;
  title: string;
  hint: string;
  value: string;
  placeholder: string;
  onChange: (value: string) => void;
  variant?: "source" | "remove";
}

export function EditorPanel({
  id,
  eyebrow,
  title,
  hint,
  value,
  placeholder,
  onChange,
  variant = "source",
}: EditorPanelProps) {
  return (
    <section className={`editor-panel editor-panel--${variant}`} aria-label={`${title} editor panel`}>
      <div className="editor-panel__heading">
        <div>
          <p className="eyebrow">{eyebrow}</p>
          <h2 id={`${id}-title`}>{title}</h2>
        </div>
        <span className="character-count" aria-label={`${value.length} characters`}>
          {value.length.toLocaleString()} chars
        </span>
      </div>
      <label className="sr-only" htmlFor={id}>{title}</label>
      <textarea
        id={id}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        spellCheck="true"
        aria-describedby={`${id}-hint`}
      />
      <p className="field-hint" id={`${id}-hint`}>{hint}</p>
    </section>
  );
}
