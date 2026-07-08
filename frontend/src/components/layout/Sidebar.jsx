import { NavLink, useNavigate } from 'react-router-dom'
import {
  LayoutDashboard, Users, FileText, Brain, Calendar,
  Scale, BarChart3, Briefcase, Building2, Settings,
  ChevronLeft, ChevronRight, LogOut, Sparkles
} from 'lucide-react'
import useAppStore from '../../store/useAppStore'
import { logout } from '../../services/api'

const NAV_ITEMS = [
  { label: 'Dashboard',        icon: LayoutDashboard, to: '/' },
  { label: 'Candidates',       icon: Users,           to: '/candidates' },
  { label: 'AI Screening',     icon: Brain,           to: '/screening' },
  { label: 'Question Bank',    icon: Calendar,        to: '/questions' },
  { label: 'Bias Audit',       icon: Scale,           to: '/bias-audit' },
  { label: 'Analytics',        icon: BarChart3,       to: '/analytics' },
  { label: 'Job Descriptions', icon: Briefcase,       to: '/jobs' },
  { label: 'Company Profile',  icon: Building2,       to: '/company' },
  { label: 'Settings',         icon: Settings,        to: '/settings' },
]

export default function Sidebar() {
  const { sidebarCollapsed, toggleSidebar, clearUser } = useAppStore()
  const navigate = useNavigate()

  const handleLogout = async () => {
    try { await logout() } catch {}
    clearUser()
    navigate('/login')
  }

  return (
    <aside
      style={{
        width: sidebarCollapsed ? 72 : 260,
        transition: 'width 0.25s ease',
        flexShrink: 0,
        height: '100vh',
        position: 'sticky',
        top: 0,
        display: 'flex',
        flexDirection: 'column',
        background: 'white',
        borderRight: '1px solid #E2E8F0',
        overflow: 'hidden',
        zIndex: 40,
      }}
    >
      {/* Logo */}
      <div style={{ padding: '20px 16px 16px', display: 'flex', alignItems: 'center', gap: 10, minHeight: 64 }}>
        <div style={{
          width: 36, height: 36, borderRadius: 10, flexShrink: 0,
          background: 'linear-gradient(135deg, #4F46E5, #7C3AED)',
          display: 'flex', alignItems: 'center', justifyContent: 'center'
        }}>
          <Sparkles size={18} color="white" />
        </div>
        {!sidebarCollapsed && (
          <div>
            <div style={{ fontSize: 15, fontWeight: 700, color: '#0F172A', lineHeight: 1.2 }}>TalentAI</div>
            <div style={{ fontSize: 11, color: '#94A3B8', fontWeight: 400 }}>Recruitment Platform</div>
          </div>
        )}
      </div>

      {/* Nav */}
      <nav style={{ flex: 1, padding: '8px 10px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 2 }}>
        {!sidebarCollapsed && (
          <div style={{ fontSize: 11, fontWeight: 600, color: '#94A3B8', padding: '6px 4px 4px', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
            Navigation
          </div>
        )}
        {NAV_ITEMS.map(({ label, icon: Icon, to }) => (
          <NavLink
            key={to}
            to={to}
            end={to === '/'}
            className={({ isActive }) => `nav-item${isActive ? ' active' : ''}`}
            style={{ justifyContent: sidebarCollapsed ? 'center' : 'flex-start' }}
            title={sidebarCollapsed ? label : undefined}
          >
            <Icon size={18} style={{ flexShrink: 0 }} />
            {!sidebarCollapsed && <span>{label}</span>}
          </NavLink>
        ))}
      </nav>

      {/* Bottom */}
      <div style={{ padding: '12px 10px', borderTop: '1px solid #F1F5F9', display: 'flex', flexDirection: 'column', gap: 4 }}>
        <button
          onClick={handleLogout}
          className="nav-item"
          style={{ width: '100%', border: 'none', background: 'none', cursor: 'pointer', color: '#EF4444', justifyContent: sidebarCollapsed ? 'center' : 'flex-start' }}
          title={sidebarCollapsed ? 'Logout' : undefined}
        >
          <LogOut size={18} />
          {!sidebarCollapsed && <span>Logout</span>}
        </button>
        <button
          onClick={toggleSidebar}
          className="nav-item"
          style={{ width: '100%', border: 'none', background: 'none', cursor: 'pointer', justifyContent: sidebarCollapsed ? 'center' : 'flex-start' }}
          title={sidebarCollapsed ? 'Expand' : 'Collapse'}
        >
          {sidebarCollapsed ? <ChevronRight size={18} /> : <><ChevronLeft size={18} /><span>Collapse</span></>}
        </button>
      </div>
    </aside>
  )
}
