import { useEffect, useState, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { Search, Filter, ChevronUp, ChevronDown, Eye, FileText, Brain, ChevronLeft, ChevronRight } from 'lucide-react'
import { getCandidates } from '../services/api'
import { formatDate, formatScore, scoreColor } from '../utils/formatters'
import Badge from '../components/ui/Badge'
import Avatar from '../components/ui/Avatar'
import ProgressBar from '../components/ui/ProgressBar'
import { ROLES, STATUSES } from '../utils/constants'

const PER_PAGE = 10

export default function Candidates() {
  const [candidates, setCandidates] = useState([])
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [pages, setPages] = useState(1)
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [role, setRole] = useState('')
  const [status, setStatus] = useState('')
  const [sortBy, setSortBy] = useState('id')
  const [sortDir, setSortDir] = useState('asc')

  const fetchCandidates = useCallback(async () => {
    setLoading(true)
    try {
      const res = await getCandidates({ search, role, status, sort_by: sortBy, sort_dir: sortDir, page, per_page: PER_PAGE })
      setCandidates(res.data.candidates)
      setTotal(res.data.total)
      setPages(res.data.pages)
    } catch (e) { console.error(e) }
    finally { setLoading(false) }
  }, [search, role, status, sortBy, sortDir, page])

  useEffect(() => { setPage(1) }, [search, role, status])
  useEffect(() => { fetchCandidates() }, [fetchCandidates])

  const handleSort = (col) => {
    if (sortBy === col) setSortDir(d => d === 'asc' ? 'desc' : 'asc')
    else { setSortBy(col); setSortDir('asc') }
  }

  const SortIcon = ({ col }) => sortBy === col
    ? (sortDir === 'asc' ? <ChevronUp size={13} /> : <ChevronDown size={13} />)
    : <ChevronDown size={13} style={{ opacity: 0.3 }} />

  const thStyle = { padding: '12px 16px', fontSize: 12, fontWeight: 600, color: '#64748B', textAlign: 'left', cursor: 'pointer', userSelect: 'none', whiteSpace: 'nowrap' }
  const tdStyle = { padding: '14px 16px', fontSize: 13, color: '#374151', verticalAlign: 'middle' }

  return (
    <div className="animate-fade-up">
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
        <div>
          <p style={{ fontSize: 14, color: '#64748B' }}>{total} candidates across 3 roles</p>
        </div>
      </div>

      {/* Filters */}
      <div className="card" style={{ padding: '14px 16px', marginBottom: 16, display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
        <div style={{ position: 'relative', flex: 1, minWidth: 200 }}>
          <Search size={15} style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: '#94A3B8' }} />
          <input className="input" placeholder="Search by name..." value={search} onChange={e => setSearch(e.target.value)} style={{ paddingLeft: 32, height: 38 }} />
        </div>
        <select className="input" value={role} onChange={e => setRole(e.target.value)} style={{ width: 180, height: 38 }}>
          <option value="">All Roles</option>
          {ROLES.map(r => <option key={r} value={r}>{r}</option>)}
        </select>
        <select className="input" value={status} onChange={e => setStatus(e.target.value)} style={{ width: 160, height: 38 }}>
          <option value="">All Statuses</option>
          {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
        </select>
        {(search || role || status) && (
          <button className="btn btn-outline" style={{ height: 38 }} onClick={() => { setSearch(''); setRole(''); setStatus('') }}>
            Clear
          </button>
        )}
        <div style={{ marginLeft: 'auto', fontSize: 13, color: '#94A3B8' }}>
          Page {page} of {pages}
        </div>
      </div>

      {/* Table */}
      <div className="card" style={{ overflow: 'hidden' }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: '#F8FAFC', borderBottom: '1px solid #E2E8F0' }}>
                <th style={thStyle} onClick={() => handleSort('id')}>ID <SortIcon col="id" /></th>
                <th style={thStyle}>Candidate</th>
                <th style={thStyle} onClick={() => handleSort('applied_role')}>Role <SortIcon col="applied_role" /></th>
                <th style={thStyle} onClick={() => handleSort('experience_years')}>Experience <SortIcon col="experience_years" /></th>
                <th style={{ ...thStyle, width: 130 }}>AI Score</th>
                <th style={thStyle} onClick={() => handleSort('status')}>Status <SortIcon col="status" /></th>
                <th style={thStyle} onClick={() => handleSort('applied_date')}>Applied <SortIcon col="applied_date" /></th>
                <th style={{ ...thStyle, textAlign: 'center' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading
                ? Array(PER_PAGE).fill(0).map((_, i) => (
                  <tr key={i} style={{ borderBottom: '1px solid #F1F5F9' }}>
                    {Array(8).fill(0).map((_, j) => (
                      <td key={j} style={tdStyle}><div className="skeleton" style={{ height: 16, width: '80%' }} /></td>
                    ))}
                  </tr>
                ))
                : candidates.map(c => (
                  <tr key={c.id} className="table-row" style={{ borderBottom: '1px solid #F1F5F9' }}>
                    <td style={tdStyle}><span style={{ fontSize: 12, fontWeight: 600, color: '#94A3B8' }}>{c.id}</span></td>
                    <td style={tdStyle}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <Avatar name={c.name} size={34} fontSize={13} />
                        <div>
                          <div style={{ fontWeight: 600, color: '#0F172A' }}>{c.name}</div>
                          <div style={{ fontSize: 11, color: '#94A3B8' }}>{c.location || '—'}</div>
                        </div>
                      </div>
                    </td>
                    <td style={tdStyle}>{c.applied_role}</td>
                    <td style={tdStyle}>{c.experience_years ? `${c.experience_years} yrs` : '—'}</td>
                    <td style={tdStyle}>
                      {c.cv_score ? (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                          <span style={{ fontSize: 13, fontWeight: 700, color: scoreColor(c.cv_score.overall_score) }}>
                            {formatScore(c.cv_score.overall_score)}
                          </span>
                          <ProgressBar value={c.cv_score.overall_score} />
                        </div>
                      ) : <span style={{ color: '#94A3B8' }}>—</span>}
                    </td>
                    <td style={tdStyle}><Badge label={c.status} type="status" /></td>
                    <td style={tdStyle}>{formatDate(c.applied_date)}</td>
                    <td style={{ ...tdStyle, textAlign: 'center' }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4 }}>
                        <Link to={`/candidates/${c.id}`} title="View Profile">
                          <button className="btn btn-ghost" style={{ padding: '6px', borderRadius: 6 }}>
                            <Eye size={15} color="#4F46E5" />
                          </button>
                        </Link>
                        <Link to={`/candidates/${c.id}/resume`} title="View Resume">
                          <button className="btn btn-ghost" style={{ padding: '6px', borderRadius: 6 }}>
                            <FileText size={15} color="#7C3AED" />
                          </button>
                        </Link>
                        <Link to={`/screening`} title="View AI Score">
                          <button className="btn btn-ghost" style={{ padding: '6px', borderRadius: 6 }}>
                            <Brain size={15} color="#06B6D4" />
                          </button>
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))
              }
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 16px', borderTop: '1px solid #F1F5F9' }}>
          <span style={{ fontSize: 13, color: '#64748B' }}>
            Showing {Math.min((page - 1) * PER_PAGE + 1, total)}–{Math.min(page * PER_PAGE, total)} of {total}
          </span>
          <div style={{ display: 'flex', gap: 4 }}>
            <button className="btn btn-outline" style={{ padding: '6px 10px' }} onClick={() => setPage(p => p - 1)} disabled={page === 1}>
              <ChevronLeft size={15} />
            </button>
            {Array.from({ length: pages }, (_, i) => i + 1).map(p => (
              <button key={p} className={`btn ${p === page ? 'btn-primary' : 'btn-outline'}`} style={{ padding: '6px 12px', minWidth: 36 }} onClick={() => setPage(p)}>
                {p}
              </button>
            ))}
            <button className="btn btn-outline" style={{ padding: '6px 10px' }} onClick={() => setPage(p => p + 1)} disabled={page === pages}>
              <ChevronRight size={15} />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
