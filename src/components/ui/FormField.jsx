export function InputField({
  id,
  label,
  description,
  className = '',
  ...props
}) {
  return (
    <label className={`field ${className}`} htmlFor={id}>
      <span className="field__label">{label}</span>
      {description ? <span className="field__hint">{description}</span> : null}
      <input id={id} className="field__input" {...props} />
    </label>
  )
}

export function SelectField({
  id,
  label,
  description,
  options,
  className = '',
  ...props
}) {
  return (
    <label className={`field ${className}`} htmlFor={id}>
      <span className="field__label">{label}</span>
      {description ? <span className="field__hint">{description}</span> : null}
      <select id={id} className="field__select" {...props}>
        <option value="" disabled>
          Pilih divisi
        </option>
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </label>
  )
}
