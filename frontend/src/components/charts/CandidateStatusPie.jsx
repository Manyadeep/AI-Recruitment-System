import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import { CHART_COLORS, STATUS_COLORS } from '../../utils/constants'

const RADIAN = Math.PI / 180
const renderLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }) => {
  const r = innerRadius + (outerRadius - innerRadius) * 0.5
  const x = cx + r * Math.cos(-midAngle * RADIAN)
  const y = cy + r * Math.sin(-midAngle * RADIAN)
  return percent > 0.08 ? (
    <text x={x} y={y} fill="white" textAnchor="middle" dominantBaseline="central" fontSize={11} fontWeight={600}>
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  ) : null
}

export default function CandidateStatusPie({ data }) {
  if (!data?.length) return null
  return (
    <ResponsiveContainer width="100%" height={220}>
      <PieChart>
        <Pie
          data={data} cx="50%" cy="50%"
          outerRadius={85} dataKey="value"
          labelLine={false} label={renderLabel}
          animationBegin={0} animationDuration={600}
        >
          {data.map((entry, i) => {
            const color = STATUS_COLORS[entry.name]?.dot || CHART_COLORS[i % CHART_COLORS.length]
            return <Cell key={i} fill={color} />
          })}
        </Pie>
        <Tooltip
          contentStyle={{ borderRadius: 8, border: '1px solid #E2E8F0', fontSize: 13 }}
          formatter={(v, name) => [v, name]}
        />
        <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 12 }} />
      </PieChart>
    </ResponsiveContainer>
  )
}
