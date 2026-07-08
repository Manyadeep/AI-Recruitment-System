export const formatDate = (dateStr) => {
  if (!dateStr) return '—'
  const d = new Date(dateStr)
  return d.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })
}

export const formatScore = (score) => {
  if (score === null || score === undefined) return '—'
  return `${Number(score).toFixed(1)}`
}

export const scoreColor = (score) => {
  if (!score) return '#94A3B8'
  if (score >= 80) return '#10B981'
  if (score >= 60) return '#F59E0B'
  return '#EF4444'
}

export const getInitials = (name) => {
  if (!name) return '?'
  return name.split(' ').map(p => p[0]).join('').slice(0, 2).toUpperCase()
}

export const AVATAR_COLORS = [
  '#4F46E5','#7C3AED','#06B6D4','#10B981','#F59E0B',
  '#EF4444','#EC4899','#8B5CF6','#14B8A6','#F97316',
]

export const getAvatarColor = (name) => {
  if (!name) return AVATAR_COLORS[0]
  const idx = name.charCodeAt(0) % AVATAR_COLORS.length
  return AVATAR_COLORS[idx]
}

export const timeAgo = (dateStr) => {
  if (!dateStr) return ''
  const d = new Date(dateStr)
  const diff = Date.now() - d.getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 60) return `${mins}m ago`
  const hrs = Math.floor(mins / 60)
  if (hrs < 24) return `${hrs}h ago`
  const days = Math.floor(hrs / 24)
  return `${days}d ago`
}

export const truncate = (str, n = 40) =>
  str && str.length > n ? str.slice(0, n) + '…' : str || '—'
