import { Bell, Search, ChevronDown } from 'lucide-react'
import useAppStore from '../../store/useAppStore'
import { getInitials, getAvatarColor } from '../../utils/formatters'

export default function TopBar({ title = '' }) {
  const { user, notificationCount } = useAppStore()
  const initials = getInitials(user?.name || 'HR')
  const avatarBg = getAvatarColor(user?.name || 'HR')

  return (
    <header style={{
      height: 64,
      background: 'white',
      borderBottom: '1px solid #E2E8F0',
      display: 'flex',
      alignItems: 'center',
      padding: '0 24px',
      gap: 16,
      position: 'sticky',
      top: 0,
      zIndex: 30,
    }}>
      {/* Page title */}
      <div style={{ flex: 1 }}>
        {title && <h1 style={{ fontSize: 18, fontWeight: 600, color: '#0F172A' }}>{title}</h1>}
      </div>

      {/* Search */}
      <div style={{ position: 'relative', width: 280 }}>
        <Search size={15} style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: '#94A3B8' }} />
        <input
          className="input"
          placeholder="Search candidates, roles..."
          style={{ paddingLeft: 32, fontSize: 13, height: 38 }}
          readOnly
        />
      </div>

      {/* Notifications */}
      <button style={{ position: 'relative', background: 'none', border: 'none', cursor: 'pointer', padding: 8, borderRadius: 8, display: 'flex', alignItems: 'center', color: '#475569' }}>
        <Bell size={20} />
        {notificationCount > 0 && (
          <span style={{
            position: 'absolute', top: 4, right: 4,
            width: 16, height: 16, borderRadius: '50%',
            background: '#EF4444', color: 'white',
            fontSize: 10, fontWeight: 600,
            display: 'flex', alignItems: 'center', justifyContent: 'center'
          }}>
            {notificationCount}
          </span>
        )}
      </button>

      {/* User */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer', padding: '6px 10px', borderRadius: 8, border: '1px solid #E2E8F0' }}>
        <div style={{
          width: 32, height: 32, borderRadius: '50%',
          background: avatarBg, color: 'white',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 13, fontWeight: 600, flexShrink: 0
        }}>
          {initials}
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1.3 }}>
          <span style={{ fontSize: 13, fontWeight: 600, color: '#0F172A' }}>{user?.name || 'HR Manager'}</span>
          <span style={{ fontSize: 11, color: '#94A3B8' }}>{user?.role || 'Administrator'}</span>
        </div>
        <ChevronDown size={14} color="#94A3B8" />
      </div>
    </header>
  )
}
