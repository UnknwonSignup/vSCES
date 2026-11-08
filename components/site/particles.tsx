const PARTICLES = Array.from({ length: 28 }, (_, i) => {
  const seed = (i * 9301 + 49297) % 233280
  const r = seed / 233280
  return {
    left: `${(i * 37 + r * 20) % 100}%`,
    top: `${40 + ((i * 53) % 60)}%`,
    size: 4 + Math.round(r * 8),
    duration: `${6 + (i % 7)}s`,
    delay: `${(i % 9) * 0.7}s`,
  }
})

export function Particles() {
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
      {PARTICLES.map((p, i) => (
        <span
          key={i}
          className="particle absolute rounded-full bg-primary/80 shadow-[0_0_12px_2px] shadow-primary/60"
          style={{
            left: p.left,
            top: p.top,
            width: p.size,
            height: p.size,
            animationDuration: p.duration,
            animationDelay: p.delay,
          }}
        />
      ))}
    </div>
  )
}
