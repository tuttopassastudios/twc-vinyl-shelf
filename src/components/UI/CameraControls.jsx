import useCameraStore from '../../stores/cameraStore'

const sliders = [
  { key: 'distance', label: 'Distance', min: 3, max: 10, step: 0.1, setter: 'setDistance' },
  { key: 'fov', label: 'FOV', min: 30, max: 70, step: 1, setter: 'setFov' },
  { key: 'height', label: 'Height', min: 0, max: 2, step: 0.1, setter: 'setHeight' },
]

export default function CameraControls() {
  const store = useCameraStore()

  return (
    <div
      style={{
        position: 'fixed',
        bottom: 20,
        right: 20,
        zIndex: 220,
        background: 'rgba(247,245,240,0.85)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        borderRadius: 10,
        padding: '12px 16px',
        minWidth: 180,
        border: '1px solid var(--color-surface-light)',
        fontFamily: 'var(--font-body, monospace)',
        fontSize: 11,
        color: 'var(--color-cream)',
      }}
    >
      <div
        style={{
          fontSize: 10,
          textTransform: 'uppercase',
          letterSpacing: 1.5,
          marginBottom: 10,
          color: 'var(--color-text-muted)',
        }}
      >
        Camera
      </div>

      {sliders.map(({ key, label, min, max, step, setter }) => (
        <div key={key} style={{ marginBottom: 8 }}>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              marginBottom: 2,
            }}
          >
            <span>{label}</span>
            <span style={{ color: 'var(--color-amber)' }}>
              {store[key].toFixed(step < 1 ? 1 : 0)}
            </span>
          </div>
          <input
            type="range"
            min={min}
            max={max}
            step={step}
            value={store[key]}
            onChange={(e) => store[setter](parseFloat(e.target.value))}
            style={{ width: '100%', accentColor: 'var(--color-amber)' }}
          />
        </div>
      ))}
    </div>
  )
}
