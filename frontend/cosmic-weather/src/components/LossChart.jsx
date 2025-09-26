import { useApp } from '../context/AppContext'
import { Card, CardContent, CardHeader } from '@mui/material'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'

export default function LossChart() {
  const { loss } = useApp()
  const data = loss ? loss.tiers.map((t, i) => ({ name: `Tier ${i + 1}`, loss: t.loss, prob: t.probability })) : []

  return (
    <Card>
      <CardHeader title="Probabilistic Loss Tiers" />
      <CardContent>
        <div style={{ width: '100%', height: 260 }}>
          <ResponsiveContainer>
            <BarChart data={data}>
              <XAxis dataKey="name" />
              <YAxis yAxisId="left" orientation="left" tickFormatter={(v) => `$${(v/1_000_000).toFixed(0)}M`} />
              <YAxis yAxisId="right" orientation="right" tickFormatter={(v) => `${Math.round(v*100)}%`} domain={[0,1]} />
              <Tooltip formatter={(v, n) => n === 'loss' ? `$${v.toLocaleString()}` : `${Math.round(v*100)}%`} />
              <Bar yAxisId="left" dataKey="loss" fill="#f59e0b" />
              <Bar yAxisId="right" dataKey="prob" fill="#3b82f6" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}


