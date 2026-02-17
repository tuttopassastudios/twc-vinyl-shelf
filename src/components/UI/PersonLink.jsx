import useRouterStore from '../../stores/routerStore'
import { personSlug } from '../../utils/people'

export default function PersonLink({ name }) {
  const navigate = useRouterStore((s) => s.navigate)

  const handleClick = (e) => {
    e.preventDefault()
    navigate('/person/' + personSlug(name))
  }

  return (
    <a
      href={'#/person/' + personSlug(name)}
      onClick={handleClick}
      style={{
        color: 'var(--color-amber)',
        textDecoration: 'none',
        borderBottom: '1px dotted var(--color-amber)',
        cursor: 'pointer',
        transition: 'opacity 0.2s',
      }}
      onMouseEnter={(e) => (e.target.style.opacity = '0.8')}
      onMouseLeave={(e) => (e.target.style.opacity = '1')}
    >
      {name}
    </a>
  )
}
