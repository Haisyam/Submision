function SectionHeader({ eyebrow, title, subtitle, align = 'left' }) {
  return (
    <div className={`section-header section-header--${align}`}>
      {eyebrow ? <span className="section-header__eyebrow">{eyebrow}</span> : null}
      <h2 className="section-header__title">{title}</h2>
      {subtitle ? <p className="section-header__subtitle">{subtitle}</p> : null}
    </div>
  )
}

export default SectionHeader
