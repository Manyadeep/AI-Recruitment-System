export const STATUS_COLORS = {
  Applied:     { bg: '#EFF6FF', text: '#1D4ED8', dot: '#3B82F6' },
  Screened:    { bg: '#F5F3FF', text: '#6D28D9', dot: '#7C3AED' },
  Shortlisted: { bg: '#F0FDF4', text: '#15803D', dot: '#22C55E' },
  Interview:   { bg: '#FFFBEB', text: '#92400E', dot: '#F59E0B' },
  Offered:     { bg: '#F0FDF4', text: '#166534', dot: '#16A34A' },
  Rejected:    { bg: '#FFF1F2', text: '#9F1239', dot: '#F43F5E' },
  Review:      { bg: '#FFF7ED', text: '#9A3412', dot: '#F97316' },
}

export const SCREENING_STATUS_COLORS = {
  Shortlisted: { bg: '#F0FDF4', text: '#15803D' },
  Rejected:    { bg: '#FFF1F2', text: '#9F1239' },
  Review:      { bg: '#FFF7ED', text: '#9A3412' },
}

export const RISK_COLORS = {
  Low:    { bg: '#F0FDF4', text: '#15803D', border: '#86EFAC' },
  Medium: { bg: '#FFFBEB', text: '#92400E', border: '#FCD34D' },
  High:   { bg: '#FFF1F2', text: '#9F1239', border: '#FCA5A5' },
}

export const DIFFICULTY_COLORS = {
  Easy:   { bg: '#F0FDF4', text: '#15803D' },
  Medium: { bg: '#FFF7ED', text: '#9A3412' },
  Hard:   { bg: '#FFF1F2', text: '#9F1239' },
}

export const CATEGORY_COLORS = {
  Technical:   { bg: '#EFF6FF', text: '#1D4ED8' },
  Behavioral:  { bg: '#F5F3FF', text: '#6D28D9' },
  Situational: { bg: '#ECFDF5', text: '#065F46' },
}

export const ROLES = ['Software Engineer', 'Data Analyst', 'Product Manager']
export const STATUSES = ['Applied', 'Screened', 'Shortlisted', 'Interview', 'Offered', 'Rejected']

export const CHART_COLORS = ['#4F46E5', '#7C3AED', '#06B6D4', '#10B981', '#F59E0B', '#EF4444']

export const NOTIFICATION_ICONS = {
  screening:   '🤖',
  bias:        '⚖️',
  interview:   '📅',
  application: '👤',
  offer:       '🎉',
}
