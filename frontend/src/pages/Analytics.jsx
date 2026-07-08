import { useEffect, useState } from 'react'
import { getAnalyticsOverview, getDashboardFunnel } from '../services/api'
import ScoreDistributionChart from '../components/charts/ScoreDistributionChart'
import HiringFunnelChart from '../components/charts/HiringFunnelChart'
import CandidateStatusPie from '../components/charts/CandidateStatusPie'
import TopSkillsChart from '../components/charts/TopSkillsChart'
import GenderParityChart from '../components/charts/GenderParityChart'
import { PageSpinner } from '../components/ui/Spinner'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts'
import { CHART_COLORS } from '../utils/constants'

export default function Analytics() {
  const [overview, setOverview] = useState(null)
  const [funnel, setFunnel] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([getAnalyticsOverview(), getDashboardFunnel()])
      .then(([ov, fn]) => { setOverview(ov.data); setFunnel(fn.data); setLoading(false) })
      .catch(() => setLoading(false))
  }, [])

  if (loading) return <PageSpinner />

  // Funnel conversion
  const funnelRates = funnel.length > 1 ? funnel.map((f, i) => ({
    ...f,
    rate: i === 0 ? 100 : Math.round((f.count / funnel[0].count) * 100)
  })) : []

  return (
    <div className="animate-fade-up">
      {/* Row 1: Funnel + Score Distribution */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 20 }}>
        <div className="card" style={{ padding: 20 }}>
          <h3 style={{ fontSize: 15, fontWeight: 600, color: '#0F172A', marginBottom: 4 }}>Hiring Funnel</h3>
          <p style={{ fontSize: 12, color: '#94A3B8', marginBottom: 14 }}>Candidates at each pipeline stage</p>
          <HiringFunnelChart data={funnel} />
        </div>
        <div className="card" style={{ padding: 20 }}>
          <h3 style={{ fontSize: 15, fontWeight: 600, color: '#0F172A', marginBottom: 4 }}>Resume Score Distribution</h3>
          <p style={{ fontSize: 12, color: '#94A3B8', marginBottom: 14 }}>AI score buckets across all candidates</p>
          <ScoreDistributionChart data={overview?.score_distribution} />
        </div>
      </div>

      {/* Row 2: Top Skills + Role Distribution */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 20 }}>
        <div className="card" style={{ padding: 20 }}>
          <h3 style={{ fontSize: 15, fontWeight: 600, color: '#0F172A', marginBottom: 4 }}>Top Skills Across Candidates</h3>
          <p style={{ fontSize: 12, color: '#94A3B8', marginBottom: 14 }}>Most frequently appearing skills</p>
          <TopSkillsChart data={overview?.top_skills} />
        </div>
        <div className="card" style={{ padding: 20 }}>
          <h3 style={{ fontSize: 15, fontWeight: 600, color: '#0F172A', marginBottom: 4 }}>Applicants by Role</h3>
          <p style={{ fontSize: 12, color: '#94A3B8', marginBottom: 14 }}>Candidate count per open position</p>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={overview?.role_distribution} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
              <XAxis dataKey="role" tick={{ fontSize: 11, fill: '#64748B' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 12, fill: '#64748B' }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ borderRadius: 8, border: '1px solid #E2E8F0', fontSize: 13 }} formatter={(v) => [v, 'Candidates']} />
              <Bar dataKey="count" radius={[6, 6, 0, 0]} maxBarSize={55}>
                {overview?.role_distribution?.map((_, i) => <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Row 3: Demographics */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 20 }}>
        <div className="card" style={{ padding: 20 }}>
          <h3 style={{ fontSize: 15, fontWeight: 600, color: '#0F172A', marginBottom: 4 }}>Gender Distribution</h3>
          <p style={{ fontSize: 12, color: '#94A3B8', marginBottom: 14 }}>Overall candidate pool breakdown</p>
          <CandidateStatusPie data={overview?.gender_breakdown?.map(g => ({ name: g.name, value: g.value }))} />
        </div>
        <div className="card" style={{ padding: 20 }}>
          <h3 style={{ fontSize: 15, fontWeight: 600, color: '#0F172A', marginBottom: 4 }}>Pipeline Status Breakdown</h3>
          <p style={{ fontSize: 12, color: '#94A3B8', marginBottom: 14 }}>Current status distribution</p>
          <CandidateStatusPie data={overview?.status_breakdown} />
        </div>
      </div>

      {/* Funnel Conversion Rates */}
      <div className="card" style={{ padding: 20 }}>
        <h3 style={{ fontSize: 15, fontWeight: 600, color: '#0F172A', marginBottom: 16 }}>Funnel Conversion Rates</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12 }}>
          {funnelRates.map((f, i) => (
            <div key={f.stage} style={{ textAlign: 'center', padding: '16px 12px', background: '#F8FAFC', borderRadius: 10, border: '1px solid #E2E8F0' }}>
              <div style={{ fontSize: 26, fontWeight: 800, color: i === 0 ? '#4F46E5' : i === 1 ? '#7C3AED' : i === 2 ? '#F59E0B' : '#10B981' }}>{f.rate}%</div>
              <div style={{ fontSize: 13, fontWeight: 600, color: '#0F172A', marginTop: 4 }}>{f.stage}</div>
              <div style={{ fontSize: 12, color: '#94A3B8' }}>{f.count} candidates</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
