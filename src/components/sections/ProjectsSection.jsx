import ShelfScene from '../Scene/ShelfScene'
import LiquidEther from '../Scene/LiquidEther'

export default function ProjectsSection() {
  return (
    <section
      id="projects"
      className="section-fullscreen-fixed"
      style={{
        position: 'relative',
        overflow: 'hidden',
        background: '#1a1715',
      }}
    >
      {/* Fluid background layer */}
      <div style={{ position: 'absolute', inset: 0, zIndex: 0 }}>
        <LiquidEther
          colors={['#5227FF', '#FF9FFC', '#B19EEF']}
          mouseForce={20}
          cursorSize={100}
          isViscous
          viscous={30}
          iterationsViscous={32}
          iterationsPoisson={32}
          resolution={0.5}
          isBounce={false}
          autoDemo
          autoSpeed={0.5}
          autoIntensity={2.2}
          takeoverDuration={0.25}
          autoResumeDelay={3000}
          autoRampDuration={0.6}
        />
      </div>

      {/* 3D scene on top with transparent background */}
      <div style={{ position: 'relative', zIndex: 1, width: '100%', height: '100%' }}>
        <ShelfScene />
      </div>
    </section>
  )
}
