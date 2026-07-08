import { getInitials, getAvatarColor } from '../../utils/formatters'

export default function Avatar({ name, size = 36, fontSize = 14 }) {
  const initials = getInitials(name)
  const bg = getAvatarColor(name)
  return (
    <div style={{
      width: size, height: size, borderRadius: '50%',
      background: bg, color: 'white',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontSize, fontWeight: 600, flexShrink: 0, userSelect: 'none'
    }}>
      {initials}
    </div>
  )
}
