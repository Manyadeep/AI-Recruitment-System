import { scoreColor } from '../../utils/formatters'

export default function ProgressBar({ value = 0, max = 100, height = 6, showLabel = false, color }) {
  const pct = Math.min(100, Math.max(0, (value / max) * 100))
  const barColor = color || scoreColor(value)
  return (
    <div>
      {showLabel && (
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
          <span style={{ fontSize: 12, color: '#64748B' }}>{value}</span>
          <span style={{ fontSize: 12, fontWeight: 600, color: barColor }}>{pct.toFixed(0)}%</span>
        </div>
      )}
      <div style={{ background: '#F1F5F9', borderRadius: 999, height, overflow: 'hidden' }}>
        <div style={{
          height: '100%', width: `${pct}%`,
          background: barColor, borderRadius: 999,
          transition: 'width 0.6s ease',
        }} />
      </div>
    </div>
  )
}
