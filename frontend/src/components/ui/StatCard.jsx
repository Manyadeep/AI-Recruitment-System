import { TrendingUp, TrendingDown } from 'lucide-react'

export default function StatCard({ icon: Icon, label, value, trend, trendLabel, color = '#4F46E5', loading }) {
  if (loading) return (
    <div className="card" style={{ padding: 20 }}>
      <div className="skeleton" style={{ height: 16, width: '60%', marginBottom: 12 }} />
      <div className="skeleton" style={{ height: 32, width: '40%', marginBottom: 8 }} />
      <div className="skeleton" style={{ height: 12, width: '50%' }} />
    </div>
  )

  const isPositive = trend >= 0

  return (
    <div className="card animate-fade-up" style={{ padding: 20 }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 12 }}>
        <div style={{
          width: 42, height: 42, borderRadius: 10,
          background: color + '18',
          display: 'flex', alignItems: 'center', justifyContent: 'center'
        }}>
          <Icon size={20} color={color} />
        </div>
        {trend !== undefined && (
          <div style={{
            display: 'flex', alignItems: 'center', gap: 3,
            fontSize: 12, fontWeight: 500,
            color: isPositive ? '#10B981' : '#EF4444'
          }}>
            {isPositive ? <TrendingUp size={13} /> : <TrendingDown size={13} />}
            {Math.abs(trend)}%
          </div>
        )}
      </div>
      <div style={{ fontSize: 28, fontWeight: 700, color: '#0F172A', lineHeight: 1, marginBottom: 4 }}>{value ?? '—'}</div>
      <div style={{ fontSize: 13, color: '#64748B', fontWeight: 500 }}>{label}</div>
      {trendLabel && <div style={{ fontSize: 11, color: '#94A3B8', marginTop: 4 }}>{trendLabel}</div>}
    </div>
  )
}
