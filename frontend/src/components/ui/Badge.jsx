import { STATUS_COLORS, SCREENING_STATUS_COLORS, RISK_COLORS, DIFFICULTY_COLORS, CATEGORY_COLORS } from '../../utils/constants'

const TYPE_MAP = {
  status: STATUS_COLORS,
  screening: SCREENING_STATUS_COLORS,
  risk: RISK_COLORS,
  difficulty: DIFFICULTY_COLORS,
  category: CATEGORY_COLORS,
}

export default function Badge({ label, type = 'status', style: extraStyle }) {
  const map = TYPE_MAP[type] || STATUS_COLORS
  const colors = map[label] || { bg: '#F1F5F9', text: '#475569' }

  return (
    <span className="badge" style={{ background: colors.bg, color: colors.text, ...extraStyle }}>
      {colors.dot && (
        <span style={{ width: 6, height: 6, borderRadius: '50%', background: colors.dot, flexShrink: 0 }} />
      )}
      {label}
    </span>
  )
}
