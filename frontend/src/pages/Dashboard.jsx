import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Users, Brain, Calendar, TrendingUp, ArrowRight, Zap, Clock, AlertTriangle, CheckCircle, Bell } from 'lucide-react'
import StatCard from '../components/ui/StatCard'
import Badge from '../components/ui/Badge'
import Avatar from '../components/ui/Avatar'
import HiringFunnelChart from '../components/charts/HiringFunnelChart'
import ScoreDistributionChart from '../components/charts/ScoreDistributionChart'
import CandidateStatusPie from '../components/charts/CandidateStatusPie'
import {
  getDashboardStats, getDashboardFunnel,
  getRecentApplications, getRecentScreening,
  getNotifications, getAnalyticsOverview
} from '../services/api'
import { formatDate, formatScore, scoreColor } from '../utils/formatters'
import { NOTIFICATION_ICONS } from '../utils/constants'
import useAppStore from '../store/useAppStore'

function SectionHeader({ title, subtitle, action, actionTo }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
      <div>
        <h2 style={{ fontSize: 16, fontWeight: 600, color: '#0F172A' }}>{title}</h2>
        {subtitle && <p style={{ fontSize: 13, color: '#94A3B8', marginTop: 2 }}>{subtitle}</p>}
      </div>
      {action && (
        <Link to={actionTo} style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 13, fontWeight: 500, color: '#4F46E5', textDecoration: 'none' }}>
          {action} <ArrowRight size={14} />
        </Link>
      )}
    </div>
  )
}

export default function Dashboard() {
  const { user, setNotifications } = useAppStore()
  const [stats, setStats] = useState(null)
  const [funnel, setFunnel] = useState([])
  const [recentApps, setRecentApps] = useState([])
  const [recentScreening, setRecentScreening] = useState([])
  const [notifications, setLocalNotifications] = useState([])
  const [overview, setOverview] = useState(null)
  const [loading, setLoading] = useState(true)

  const hour = new Date().getHours()
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening'

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [s, f, ra, rs, n, ov] = await Promise.all([
          getDashboardStats(), getDashboardFunnel(),
          getRecentApplications(), getRecentScreening(),
          getNotifications(), getAnalyticsOverview()
        ])
        setStats(s.data)
        setFunnel(f.data)
        setRecentApps(ra.data)
        setRecentScreening(rs.data)
        setLocalNotifications(n.data)
        setNotifications(n.data)
        setOverview(ov.data)
      } catch (e) {
        console.error(e)
      } finally {
        setLoading(false)
      }
    }
    fetchAll()
  }, [])

  const quickActions = [
    { label: 'View Candidates', to: '/candidates', icon: Users, color: '#4F46E5' },
    { label: 'AI Screening',    to: '/screening',  icon: Brain,  color: '#7C3AED' },
    { label: 'Question Bank',   to: '/questions',  icon: Calendar, color: '#06B6D4' },
    { label: 'Bias Audit',      to: '/bias-audit', icon: AlertTriangle, color: '#F59E0B' },
    { label: 'Analytics',       to: '/analytics',  icon: TrendingUp, color: '#10B981' },
    { label: 'Job Postings',    to: '/jobs',        icon: Zap,    color: '#EF4444' },
  ]

  return (
    <div className="animate-fade-up">
      {/* Welcome Banner */}
      <div style={{
        borderRadius: 16, padding: '28px 32px', marginBottom: 24,
        background: 'linear-gradient(135deg, #4F46E5 0%, #7C3AED 60%, #4C1D95 100%)',
        color: 'white', position: 'relative', overflow: 'hidden'
      }}>
        <div style={{ position: 'absolute', top: -40, right: -40, width: 200, height: 200, borderRadius: '50%', background: 'rgba(255,255,255,0.06)' }} />
        <div style={{ position: 'absolute', bottom: -30, right: 120, width: 140, height: 140, borderRadius: '50%', background: 'rgba(255,255,255,0.04)' }} />
        <div style={{ position: 'relative', zIndex: 1 }}>
          <p style={{ fontSize: 15, opacity: 0.75, marginBottom: 6 }}>
            {greeting}, {user?.name?.split(' ')[0] || 'HR Manager'} 👋
          </p>
          <h1 style={{ fontSize: 26, fontWeight: 700, marginBottom: 8 }}>AI-Powered Recruitment Dashboard</h1>
          <p style={{ fontSize: 14, opacity: 0.65 }}>
            {new Date().toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
            &nbsp;·&nbsp; 3 open roles &nbsp;·&nbsp; 30 total candidates
          </p>
        </div>
      </div>

      {/* KPI Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 24 }}>
        <StatCard icon={Users}     label="Total Candidates"     value={stats?.total_candidates}      trend={12}  trendLabel="vs last month"   color="#4F46E5" loading={loading} />
        <StatCard icon={Brain}     label="Shortlisted by AI"    value={stats?.shortlisted}            trend={8}   trendLabel="AI screening"    color="#7C3AED" loading={loading} />
        <StatCard icon={Calendar}  label="Interviews Scheduled" value={stats?.interviews_scheduled}   trend={-3}  trendLabel="this week"       color="#F59E0B" loading={loading} />
        <StatCard icon={TrendingUp}label="Offers Extended"      value={stats?.offers_extended}        trend={5}   trendLabel="this quarter"    color="#10B981" loading={loading} />
      </div>

      {/* Funnel + Score Distribution */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 24 }}>
        <div className="card" style={{ padding: 20 }}>
          <SectionHeader title="Hiring Funnel" subtitle="Pipeline stage conversion" action="View Analytics" actionTo="/analytics" />
          <HiringFunnelChart data={funnel} />
        </div>
        <div className="card" style={{ padding: 20 }}>
          <SectionHeader title="Resume Score Distribution" subtitle="AI score breakdown across 30 candidates" />
          <ScoreDistributionChart data={overview?.score_distribution} />
        </div>
      </div>

      {/* Recent Applications + Recent Screening */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 24 }}>
        {/* Recent Applications */}
        <div className="card" style={{ padding: 20 }}>
          <SectionHeader title="Recent Applications" subtitle="Latest 5 applicants" action="View All" actionTo="/candidates" />
          <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {loading
              ? Array(5).fill(0).map((_, i) => <div key={i} className="skeleton" style={{ height: 44, borderRadius: 8, marginBottom: 4 }} />)
              : recentApps.map(c => (
                <Link key={c.id} to={`/candidates/${c.id}`} style={{ textDecoration: 'none' }}>
                  <div className="table-row" style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 8px', borderRadius: 8 }}>
                    <Avatar name={c.name} size={32} fontSize={12} />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: 13, fontWeight: 600, color: '#0F172A', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{c.name}</div>
                      <div style={{ fontSize: 11, color: '#94A3B8' }}>{c.applied_role} · {formatDate(c.applied_date)}</div>
                    </div>
                    <Badge label={c.status} type="status" />
                  </div>
                </Link>
              ))
            }
          </div>
        </div>

        {/* Recent Screening */}
        <div className="card" style={{ padding: 20 }}>
          <SectionHeader title="Recent Screening Activity" subtitle="Latest AI scoring events" action="View All" actionTo="/screening" />
          <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {loading
              ? Array(5).fill(0).map((_, i) => <div key={i} className="skeleton" style={{ height: 44, borderRadius: 8, marginBottom: 4 }} />)
              : recentScreening.map(s => (
                <div key={s.candidate_id} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 8px', borderRadius: 8 }}>
                  <div style={{ width: 36, height: 36, borderRadius: 8, background: '#EEF2FF', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Brain size={16} color="#4F46E5" />
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 13, fontWeight: 600, color: '#0F172A' }}>{s.candidate_name}</div>
                    <div style={{ fontSize: 11, color: '#94A3B8' }}>{s.role} · {s.screened_at}</div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: 15, fontWeight: 700, color: scoreColor(s.overall_score) }}>{formatScore(s.overall_score)}</div>
                    <Badge label={s.screening_status} type="screening" />
                  </div>
                </div>
              ))
            }
          </div>
        </div>
      </div>

      {/* Status Pie + Quick Actions */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 24 }}>
        <div className="card" style={{ padding: 20 }}>
          <SectionHeader title="Candidate Status Breakdown" subtitle="Current pipeline distribution" />
          <CandidateStatusPie data={overview?.status_breakdown} />
        </div>

        <div className="card" style={{ padding: 20 }}>
          <SectionHeader title="Quick Actions" subtitle="Jump to key platform sections" />
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginTop: 4 }}>
            {quickActions.map(({ label, to, icon: Icon, color }) => (
              <Link key={to} to={to} style={{ textDecoration: 'none' }}>
                <div style={{
                  display: 'flex', alignItems: 'center', gap: 10, padding: '12px 14px',
                  borderRadius: 10, border: '1px solid #E2E8F0', cursor: 'pointer',
                  transition: 'all 0.15s ease', background: 'white',
                }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = color; e.currentTarget.style.background = color + '08' }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = '#E2E8F0'; e.currentTarget.style.background = 'white' }}
                >
                  <div style={{ width: 32, height: 32, borderRadius: 8, background: color + '18', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Icon size={15} color={color} />
                  </div>
                  <span style={{ fontSize: 13, fontWeight: 500, color: '#374151' }}>{label}</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Notifications */}
      <div className="card" style={{ padding: 20 }}>
        <SectionHeader title="Notifications" subtitle="Recent system activity" />
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {notifications.map(n => (
            <div key={n.id} style={{
              display: 'flex', alignItems: 'center', gap: 12, padding: '12px 14px',
              borderRadius: 10, background: n.read ? '#FAFAFA' : '#EEF2FF',
              border: `1px solid ${n.read ? '#F1F5F9' : '#C7D2FE'}`
            }}>
              <div style={{ fontSize: 20 }}>{NOTIFICATION_ICONS[n.type] || '📋'}</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 13, fontWeight: n.read ? 400 : 600, color: '#0F172A' }}>{n.message}</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 11, color: '#94A3B8', marginTop: 2 }}>
                  <Clock size={11} /> {n.time}
                </div>
              </div>
              {!n.read && <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#4F46E5', flexShrink: 0 }} />}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
