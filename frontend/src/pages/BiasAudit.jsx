import { useEffect, useState } from 'react'
import { AlertTriangle, CheckCircle, XCircle, Info } from 'lucide-react'
import { getBiasReport, getBiasMetrics } from '../services/api'
import GenderParityChart from '../components/charts/GenderParityChart'
import { RISK_COLORS } from '../utils/constants'
import { PageSpinner } from '../components/ui/Spinner'

export default function BiasAudit() {
  const [reports, setReports] = useState([])
  const [metrics, setMetrics] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([getBiasReport(), getBiasMetrics()])
      .then(([r, m]) => { setReports(r.data); setMetrics(m.data); setLoading(false) })
      .catch(() => setLoading(false))
  }, [])

  if (loading) return <PageSpinner />

  const overall = reports.find(r => r.role === 'Overall') || reports[0]
  const roleReports = reports.filter(r => r.role !== 'Overall')

  const RiskBadge = ({ level }) => {
    const colors = RISK_COLORS[level] || RISK_COLORS.Medium
    const Icon = level === 'Low' ? CheckCircle : level === 'High' ? XCircle : AlertTriangle
    return (
      <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '6px 14px', borderRadius: 8, background: colors.bg, border: `1px solid ${colors.border}`, color: colors.text, fontWeight: 600, fontSize: 14 }}>
        <Icon size={16} />
        {level} Risk
      </div>
    )
  }

  return (
    <div className="animate-fade-up">
      {/* Hero Risk Card */}
      {overall && (
        <div className="card" style={{ padding: '28px 32px', marginBottom: 20, background: 'linear-gradient(135deg, #FFF7ED, #FFFBEB)', border: '1px solid #FCD34D' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16 }}>
            <div>
              <div style={{ fontSize: 12, fontWeight: 600, color: '#92400E', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 8 }}>Overall Bias Risk Assessment</div>
              <RiskBadge level={overall.bias_risk_level} />
              <p style={{ fontSize: 14, color: '#78350F', marginTop: 12, maxWidth: 560 }}>
                Audit completed across 30 candidates for 3 roles. Gender parity score: <strong>{overall.gender_parity_score}%</strong>.
                {overall.age_bias_flag ? ' Age bias flag detected.' : ' No age bias detected.'}
              </p>
            </div>
            <div style={{ display: 'flex', gap: 20 }}>
              {[
                { label: 'Total Candidates', val: overall.total_candidates },
                { label: 'Gender Parity',    val: `${overall.gender_parity_score}%` },
                { label: 'Male Rate',        val: `${overall.shortlist_rate_male}%` },
                { label: 'Female Rate',      val: `${overall.shortlist_rate_female}%` },
              ].map(({ label, val }) => (
                <div key={label} style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: 22, fontWeight: 700, color: '#92400E' }}>{val}</div>
                  <div style={{ fontSize: 11, color: '#B45309' }}>{label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Per-role metrics cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16, marginBottom: 20 }}>
        {roleReports.map(r => {
          const colors = RISK_COLORS[r.bias_risk_level] || RISK_COLORS.Medium
          return (
            <div key={r.role} className="card" style={{ padding: 20, borderTop: `3px solid ${colors.border}` }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
                <div style={{ fontSize: 14, fontWeight: 600, color: '#0F172A' }}>{r.role}</div>
                <RiskBadge level={r.bias_risk_level} />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                {[
                  { label: 'Total', val: r.total_candidates },
                  { label: 'Parity Score', val: `${r.gender_parity_score}%` },
                  { label: 'Male Rate', val: `${r.shortlist_rate_male}%` },
                  { label: 'Female Rate', val: `${r.shortlist_rate_female}%` },
                ].map(({ label, val }) => (
                  <div key={label} style={{ background: '#F8FAFC', padding: '8px 10px', borderRadius: 8 }}>
                    <div style={{ fontSize: 16, fontWeight: 700, color: '#0F172A' }}>{val}</div>
                    <div style={{ fontSize: 11, color: '#64748B' }}>{label}</div>
                  </div>
                ))}
              </div>
              {r.age_bias_flag && (
                <div style={{ marginTop: 10, display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: '#B45309', background: '#FFF7ED', padding: '6px 10px', borderRadius: 6 }}>
                  <AlertTriangle size={12} /> Age bias flag detected
                </div>
              )}
            </div>
          )
        })}
      </div>

      {/* Charts */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 20 }}>
        <div className="card" style={{ padding: 20 }}>
          <h3 style={{ fontSize: 15, fontWeight: 600, color: '#0F172A', marginBottom: 4 }}>Shortlist Rate by Gender &amp; Role</h3>
          <p style={{ fontSize: 12, color: '#94A3B8', marginBottom: 16 }}>Percentage of shortlisted candidates per gender per role</p>
          <GenderParityChart data={metrics} />
        </div>

        <div className="card" style={{ padding: 20 }}>
          <h3 style={{ fontSize: 15, fontWeight: 600, color: '#0F172A', marginBottom: 16 }}>Gender Distribution by Role</h3>
          {metrics.map(m => (
            <div key={m.role} style={{ marginBottom: 14 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                <span style={{ fontSize: 13, fontWeight: 500, color: '#475569' }}>{m.role}</span>
                <span style={{ fontSize: 12, color: '#94A3B8' }}>M: {m.male_count} · F: {m.female_count}</span>
              </div>
              <div style={{ height: 8, background: '#F1F5F9', borderRadius: 999, overflow: 'hidden', display: 'flex' }}>
                <div style={{ width: `${(m.male_count / m.total) * 100}%`, background: '#4F46E5', borderRadius: '999px 0 0 999px' }} />
                <div style={{ width: `${(m.female_count / m.total) * 100}%`, background: '#EC4899' }} />
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: '#94A3B8', marginTop: 3 }}>
                <span style={{ color: '#4F46E5' }}>Male {Math.round((m.male_count / m.total) * 100)}%</span>
                <span style={{ color: '#EC4899' }}>Female {Math.round((m.female_count / m.total) * 100)}%</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recommendations */}
      {overall?.recommendations?.length > 0 && (
        <div className="card" style={{ padding: 20, marginBottom: 20 }}>
          <h3 style={{ fontSize: 15, fontWeight: 600, color: '#0F172A', marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
            <Info size={16} color="#4F46E5" /> Recommendations
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {overall.recommendations.map((rec, i) => (
              <div key={i} style={{ display: 'flex', gap: 12, padding: '12px 14px', background: '#EEF2FF', borderRadius: 10, border: '1px solid #C7D2FE' }}>
                <div style={{ width: 24, height: 24, borderRadius: '50%', background: '#4F46E5', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 700, flexShrink: 0 }}>{i + 1}</div>
                <p style={{ fontSize: 13, color: '#3730A3', lineHeight: 1.5 }}>{rec}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Audit log */}
      <div className="card" style={{ padding: 20 }}>
        <h3 style={{ fontSize: 15, fontWeight: 600, color: '#0F172A', marginBottom: 16 }}>Audit Log</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
          {[
            { time: '2024-03-10 09:00', event: 'Bias audit initiated for all 30 candidates across 3 roles', type: 'info' },
            { time: '2024-03-10 09:12', event: 'Software Engineer role audit completed — Low risk', type: 'success' },
            { time: '2024-03-10 09:18', event: 'Data Analyst role audit completed — Medium risk, age bias flag raised', type: 'warning' },
            { time: '2024-03-10 09:25', event: 'Product Manager role audit completed — High risk, gender disparity detected', type: 'danger' },
            { time: '2024-03-10 09:30', event: 'Overall audit report generated — Medium risk overall', type: 'info' },
          ].map((log, i) => (
            <div key={i} style={{ display: 'flex', gap: 12, padding: '14px 0', borderBottom: i < 4 ? '1px solid #F1F5F9' : 'none' }}>
              <div style={{ width: 8, height: 8, borderRadius: '50%', background: log.type === 'success' ? '#10B981' : log.type === 'warning' ? '#F59E0B' : log.type === 'danger' ? '#EF4444' : '#4F46E5', flexShrink: 0, marginTop: 5 }} />
              <div>
                <div style={{ fontSize: 13, color: '#0F172A' }}>{log.event}</div>
                <div style={{ fontSize: 11, color: '#94A3B8', marginTop: 3 }}>{log.time}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
