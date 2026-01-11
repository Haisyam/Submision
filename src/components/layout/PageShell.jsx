import AnimatedBackground from '../visual/AnimatedBackground'

function PageShell({ children, className = '' }) {
  return (
    <div className={`page-shell ${className}`}>
      <AnimatedBackground />
      <div className="page-shell__content">{children}</div>
    </div>
  )
}

export default PageShell
