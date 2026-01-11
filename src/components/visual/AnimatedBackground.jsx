const particles = [
  { top: '10%', left: '8%', size: '140px', delay: '0s', duration: '18s' },
  { top: '20%', left: '78%', size: '90px', delay: '1s', duration: '14s' },
  { top: '38%', left: '18%', size: '120px', delay: '2s', duration: '20s' },
  { top: '55%', left: '70%', size: '160px', delay: '0.5s', duration: '22s' },
  { top: '68%', left: '32%', size: '110px', delay: '1.5s', duration: '17s' },
  { top: '78%', left: '82%', size: '130px', delay: '2.4s', duration: '19s' },
]

function AnimatedBackground() {
  return (
    <div className="ambient-bg" aria-hidden="true">
      <div className="ambient-bg__glow" />
      <div className="ambient-bg__grid" />
      <div className="ambient-bg__particles">
        {particles.map((particle, index) => (
          <span
            key={`particle-${index}`}
            className="particle"
            style={{
              top: particle.top,
              left: particle.left,
              '--size': particle.size,
              '--delay': particle.delay,
              '--duration': particle.duration,
            }}
          />
        ))}
      </div>
    </div>
  )
}

export default AnimatedBackground
