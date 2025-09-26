import { useApp } from '../context/AppContext'
import { Card, CardContent, CardHeader, LinearProgress, Stack, Typography } from '@mui/material'

export default function ExplainPanel() {
  const { explain } = useApp()
  return (
    <Card>
      <CardHeader title="Explainable AI Insights" />
      <CardContent>
        {explain ? (
          <Stack spacing={1}>
            <Typography variant="body2">{explain.summary}</Typography>
            {explain.importance?.map((i) => (
              <div key={i.feature}>
                <Typography variant="caption" color="text.secondary">{i.feature}</Typography>
                <LinearProgress variant="determinate" value={Math.min(100, Math.round(i.weight * 100))} />
              </div>
            ))}
          </Stack>
        ) : (
          <Typography variant="body2" color="text.secondary">Generating explanation…</Typography>
        )}
      </CardContent>
    </Card>
  )
}


