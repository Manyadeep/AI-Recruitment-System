import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Brain, Trophy, Eye } from 'lucide-react'
import { getLeaderboard, getScreeningSummary } from '../services/api'
import { formatScore, scoreColor } from '../utils/formatters'
import Badge from '../components/ui/Badge'
import Avatar from '../components/ui/Avatar'
import ProgressBar from '../components/ui/ProgressBar'
import ScoreRadarChart from '../components/charts/ScoreRadarChart'
import { PageSpinner } from '../components/ui/Spinner'

const ROLES = ['Software Engineer', 'Data Analyst', 'Product Manager']

export default function AIScreening() {
  const [leaderboard, setLeaderboard] = useState({})
  const [summary, setSummary] = useState(null)
  const [activeRole, setActiveRole] = useState('Software Engineer')
  const [selectedRow, setSelectedRow] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([getLeaderboard(), getScreeningSummary()]).then(([lb, sm]) => {
      setLeaderboard(lb.data)
      setSummary(sm.data)
      setLoading(false)
    }).catch(() => setLoading(false))
  }, [])

  const candidates = leaderboard[activeRole] || []

  if (loading) return <PageSpinner />

  const thStyle = { padding: '10px 14px', fontSize: 12, fontWeight: 600, color: '#64748B', textAlign: 'left', background: '#F8FAFC', borderBottom: '1px solid #E2E8F0', whiteSpace: 'nowrap' }
  const tdStyle = { padding: '14px 14px', fontSize: 13, color: '#374151', verticalAlign: 'middle', borderBottom: '1px solid #F8FAFC' }

  return (
    <div className="animate-fade-up">
      {/* Summary Cards */}
      {summary && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 14, marginBottom: 20 }}>
          {[
            { label: 'Total Screened',  value: summary.total,       color: '#4F46E5' },
            { label: 'Shortlisted',     value: summary.shortlisted,  color: '#10B981' },
            { label: 'Under Review',    value: summary.review,       color: '#F59E0B' },
            { label: 'Average Score',   value: `${summary.avg_score}`, color: '#7C3AED' },
          ].map(({ label, value, color }) => (
            <div key={label} className="card" style={{ padding: '16px 20px' }}>
              <div style={{ fontSize: 24, fontWeight: 700, color }}>{value}</div>
              <div style={{ fontSize: 13, color: '#64748B', marginTop: 4 }}>{label}</div>
            </div>
          ))}
        </div>
      )}

      {/* Role Tabs */}
      <div style={{ display: 'flex', gap: 4, marginBottom: 16, background: 'white', border: '1px solid #E2E8F0', borderRadius: 10, padding: 4, width: 'fit-content' }}>
        <button
          onClick={() => { setActiveRole('All'); setSelectedRow(null) }}
          style={{
            padding: '7px 18px', borderRadius: 7, border: 'none', cursor: 'pointer',
            background: activeRole === 'All' ? '#4F46E5' : 'transparent',
            color: activeRole === 'All' ? 'white' : '#64748B',
            fontWeight: 500, fontSize: 13, fontFamily: 'inherit', transition: 'all 0.15s',
          }}
        >All Roles</button>
        {ROLES.map(r => (
          <button key={r} onClick={() => { setActiveRole(r); setSelectedRow(null) }} style={{
            padding: '7px 18px', borderRadius: 7, border: 'none', cursor: 'pointer',
            background: activeRole === r ? '#4F46E5' : 'transparent',
            color: activeRole === r ? 'white' : '#64748B',
            fontWeight: 500, fontSize: 13, fontFamily: 'inherit', transition: 'all 0.15s',
          }}>{r}</button>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: selectedRow ? '1fr 380px' : '1fr', gap: 16 }}>
        {/* Table */}
        <div className="card" style={{ overflow: 'hidden' }}>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr>
                  <th style={thStyle}>Rank</th>
                  <th style={thStyle}>Candidate</th>
                  <th style={thStyle}>Role</th>
                  <th style={thStyle}>Overall</th>
                  <th style={thStyle}>Skill Match</th>
                  <th style={thStyle}>Experience</th>
                  <th style={thStyle}>Education</th>
                  <th style={thStyle}>Keywords</th>
                  <th style={thStyle}>Status</th>
                  <th style={{ ...thStyle, textAlign: 'center' }}>Action</th>
                </tr>
              </thead>
              <tbody>
                {(activeRole === 'All' ? Object.values(leaderboard).flat() : candidates)
                  .sort((a, b) => b.overall_score - a.overall_score)
                  .map((c, idx) => {
                    const isSelected = selectedRow?.candidate_id === c.candidate_id
                    return (
                      <tr key={c.candidate_id} style={{ background: isSelected ? '#F0F0FF' : 'white', cursor: 'pointer', borderBottom: '1px solid #F8FAFC' }}
                        onClick={() => setSelectedRow(isSelected ? null : c)}
                        className="table-row"
                      >
                        <td style={tdStyle}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                            {idx === 0 ? <Trophy size={15} color="#F59E0B" /> : idx === 1 ? <Trophy size={14} color="#94A3B8" /> : idx === 2 ? <Trophy size={14} color="#CD7F32" /> : null}
                            <span style={{ fontWeight: 600, color: '#64748B' }}>#{idx + 1}</span>
                          </div>
                        </td>
                        <td style={tdStyle}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                            <Avatar name={c.candidate_name} size={30} fontSize={12} />
                            <div>
                              <div style={{ fontWeight: 600, color: '#0F172A', fontSize: 13 }}>{c.candidate_name}</div>
                              <div style={{ fontSize: 11, color: '#94A3B8' }}>{c.candidate_id}</div>
                            </div>
                          </div>
                        </td>
                        <td style={tdStyle}><span style={{ fontSize: 12 }}>{c.candidate_role}</span></td>
                        <td style={tdStyle}>
                          <div style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                            <span style={{ fontWeight: 700, color: scoreColor(c.overall_score) }}>{formatScore(c.overall_score)}</span>
                            <ProgressBar value={c.overall_score} height={4} />
                          </div>
                        </td>
                        <td style={{ ...tdStyle, color: scoreColor(c.skill_match_pct) }}>{formatScore(c.skill_match_pct)}</td>
                        <td style={{ ...tdStyle, color: scoreColor(c.experience_score) }}>{formatScore(c.experience_score)}</td>
                        <td style={{ ...tdStyle, color: scoreColor(c.education_score) }}>{formatScore(c.education_score)}</td>
                        <td style={{ ...tdStyle, color: scoreColor(c.keyword_score) }}>{formatScore(c.keyword_score)}</td>
                        <td style={tdStyle}><Badge label={c.screening_status} type="screening" /></td>
                        <td style={{ ...tdStyle, textAlign: 'center' }}>
                          <Link to={`/candidates/${c.candidate_id}`} onClick={e => e.stopPropagation()}>
                            <button className="btn btn-ghost" style={{ padding: 6 }}><Eye size={14} color="#4F46E5" /></button>
                          </Link>
                        </td>
                      </tr>
                    )
                  })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Side panel */}
        {selectedRow && (
          <div className="card animate-fade-up" style={{ padding: 20 }}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10, marginBottom: 20, textAlign: 'center' }}>
              <Avatar name={selectedRow.candidate_name} size={52} fontSize={18} />
              <div>
                <div style={{ fontWeight: 700, fontSize: 16, color: '#0F172A' }}>{selectedRow.candidate_name}</div>
                <div style={{ fontSize: 13, color: '#64748B' }}>{selectedRow.candidate_role}</div>
              </div>
              <div style={{ padding: '10px 20px', background: scoreColor(selectedRow.overall_score) + '15', borderRadius: 10 }}>
                <div style={{ fontSize: 28, fontWeight: 800, color: scoreColor(selectedRow.overall_score) }}>{formatScore(selectedRow.overall_score)}</div>
                <div style={{ fontSize: 11, color: '#64748B' }}>Overall Score</div>
              </div>
              <Badge label={selectedRow.screening_status} type="screening" />
            </div>
            <ScoreRadarChart data={selectedRow} />
            {selectedRow.notes && (
              <div style={{ marginTop: 16, padding: 12, background: '#F8FAFC', borderRadius: 8, border: '1px solid #E2E8F0', fontSize: 13, color: '#475569', lineHeight: 1.5 }}>
                <div style={{ fontWeight: 600, color: '#0F172A', marginBottom: 6, display: 'flex', alignItems: 'center', gap: 6 }}>
                  <Brain size={13} color="#4F46E5" /> AI Remarks
                </div>
                {selectedRow.notes}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
