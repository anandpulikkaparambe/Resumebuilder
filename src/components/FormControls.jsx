export function TextField({ label, value, onChange, type = 'text', placeholder, onKeyDown }) {
  return (
    <label className="field">
      <span className="field-label">{label}</span>
      <input
        type={type}
        className="field-input"
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={onKeyDown}
      />
    </label>
  )
}

export function TextAreaField({ label, value, onChange, placeholder, rows = 4 }) {
  return (
    <label className="field">
      <span className="field-label">{label}</span>
      <textarea
        className="field-input"
        rows={rows}
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
      />
    </label>
  )
}

export function CheckboxField({ label, checked, onChange }) {
  return (
    <label className="field-checkbox">
      <input type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)} />
      <span>{label}</span>
    </label>
  )
}
