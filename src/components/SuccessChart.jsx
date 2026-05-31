import { LineChart } from '@mui/x-charts/LineChart'

const GRID = '#e6e6e6'
const AXIS = '#9a9a9a'

// Minimal grayscale success-rate line chart with hover tooltips.
// Values are placeholder wireframe data (shown as "NN%" on hover).
// Wrapped in dir="ltr" so the time axis always reads left → right.
export default function SuccessChart({ xLabels, xAxisLabel, yLabel = 'שיעור הצלחה (%)', series }) {
  return (
    <div dir="ltr" style={{ position: 'relative', flex: 1, minHeight: 170, minWidth: 130, width: '100%' }}>
      <div style={{ position: 'absolute', inset: 0 }}>
      <LineChart
        margin={{ left: 54, right: 16, top: 14, bottom: 44 }}
        xAxis={[{ scaleType: 'point', data: xLabels, label: xAxisLabel }]}
        yAxis={[{ min: 0, max: 100, label: yLabel }]}
        series={series.map((s) => ({
          data: s.data,
          color: s.color || '#6b6b6b',
          label: s.label,
          showMark: true,
          curve: 'monotoneX',
          valueFormatter: (v) => (v == null ? '' : `${v}%`),
        }))}
        grid={{ horizontal: true }}
        slotProps={{ legend: { hidden: true } }}
        sx={{
          '& .MuiChartsAxis-line, & .MuiChartsAxis-tick': { stroke: AXIS },
          '& .MuiChartsAxis-tickLabel': { fill: `${AXIS} !important`, fontSize: 10, fontFamily: 'inherit' },
          '& .MuiChartsAxis-label': { fill: '#6b6b6b !important', fontSize: 11, fontWeight: 700, fontFamily: 'inherit' },
          '& .MuiChartsGrid-line': { stroke: GRID },
          '& .MuiMarkElement-root': { stroke: '#6b6b6b', fill: '#fff', strokeWidth: 2 },
          '& .MuiLineElement-root': { strokeWidth: 2.4 },
        }}
      />
      </div>
    </div>
  )
}
