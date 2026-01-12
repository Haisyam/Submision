import { useEffect, useMemo, useRef, useState } from 'react'

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
  options = [],
  placeholder = 'Pilih Ormawa',
  searchable = false,
  className = '',
  ...props
}) {
  const {
    onChange,
    name,
    required,
    disabled,
    value: fieldValue,
    ...rest
  } = props
  const value = fieldValue ?? ''
  const wrapperRef = useRef(null)
  const inputRef = useRef(null)
  const [isOpen, setIsOpen] = useState(false)
  const [search, setSearch] = useState('')

  const selectedLabel = options.find((option) => option === value) ?? ''
  const filterText = search.trim().toLowerCase()
  const filteredOptions = useMemo(() => {
    if (!filterText) {
      return options
    }
    return options.filter((option) =>
      option.toLowerCase().includes(filterText),
    )
  }, [options, filterText])

  const findMatch = (text) =>
    options.find((option) => option.toLowerCase() === text.toLowerCase())

  const updateValidity = (text) => {
    if (!inputRef.current) {
      return
    }
    if (!text) {
      inputRef.current.setCustomValidity('')
      return
    }
    inputRef.current.setCustomValidity(
      findMatch(text) ? '' : 'Pilih dari daftar.',
    )
  }

  useEffect(() => {
    if (!isOpen) {
      setSearch('')
    }
  }, [value, isOpen])

  useEffect(() => {
    if (!isOpen) {
      updateValidity(selectedLabel)
    }
  }, [selectedLabel, isOpen])

  const handleOpen = () => {
    if (disabled) {
      return
    }
    setIsOpen(true)
    setSearch('')
  }

  const handleInputChange = (event) => {
    if (disabled) {
      return
    }
    if (!isOpen) {
      setIsOpen(true)
    }
    const nextValue = event.target.value
    setSearch(nextValue)
    updateValidity(nextValue)
    if (!nextValue && onChange) {
      onChange({ target: { name, value: '' } })
      return
    }
    const match = findMatch(nextValue)
    if (match && onChange) {
      onChange({ target: { name, value: match } })
    }
  }

  const handleSelect = (option) => {
    setIsOpen(false)
    setSearch('')
    updateValidity(option)
    if (onChange) {
      onChange({
        target: {
          name,
          value: option,
        },
      })
    }
  }

  const handleKeyDown = (event) => {
    if (event.key === 'Escape') {
      setIsOpen(false)
      setSearch('')
      return
    }

    if (event.key === 'Enter' && isOpen) {
      event.preventDefault()
      if (filteredOptions.length) {
        handleSelect(filteredOptions[0])
      }
    }
  }

  const handleBlur = (event) => {
    if (!wrapperRef.current?.contains(event.relatedTarget)) {
      setIsOpen(false)
      setSearch('')
      updateValidity(selectedLabel)
    }
  }

  if (!searchable) {
    const isPlaceholder = value === ''

    return (
      <label className={`field ${className}`} htmlFor={id}>
        <span className="field__label">{label}</span>
        {description ? <span className="field__hint">{description}</span> : null}
        <div className="field__control">
          <select
            id={id}
            className={`field__select${isPlaceholder ? ' is-placeholder' : ''}`}
            {...rest}
            name={name}
            value={value}
            onChange={onChange}
            required={required}
            disabled={disabled}
          >
            <option value="" disabled>
              {placeholder}
            </option>
            {options.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>
      </label>
    )
  }

  return (
    <label className={`field ${className}`} htmlFor={id}>
      <span className="field__label">{label}</span>
      {description ? <span className="field__hint">{description}</span> : null}
      <div
        className={`field__control${isOpen ? ' is-open' : ''}`}
        ref={wrapperRef}
      >
        <input
          id={id}
          type="search"
          name={name}
          className="field__select-input"
          autoComplete="off"
          placeholder={selectedLabel || placeholder}
          value={isOpen ? search : selectedLabel}
          onFocus={handleOpen}
          onClick={handleOpen}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onBlur={handleBlur}
          readOnly={!isOpen}
          required={required}
          disabled={disabled}
          aria-expanded={isOpen}
          aria-controls={`${id}-listbox`}
          aria-autocomplete="list"
          role="combobox"
          ref={inputRef}
          {...rest}
        />
        {isOpen ? (
          <div
            className="field__select-menu"
            id={`${id}-listbox`}
            role="listbox"
          >
            {filteredOptions.length ? (
              filteredOptions.map((option) => (
                <button
                  key={option}
                  type="button"
                  className={`field__select-option${
                    option === value ? ' is-active' : ''
                  }`}
                  role="option"
                  aria-selected={option === value}
                  onMouseDown={() => handleSelect(option)}
                >
                  {option}
                </button>
              ))
            ) : (
              <div className="field__select-empty">
                Divisi tidak ditemukan.
              </div>
            )}
          </div>
        ) : null}
      </div>
    </label>
  )
}
