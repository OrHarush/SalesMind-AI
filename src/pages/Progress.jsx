import { useLayoutEffect, useRef, useState } from 'react'
import { SparkLineChart } from '@mui/x-charts/SparkLineChart'
import SuccessChart from '../components/SuccessChart'

// progress horizons are longer than the dashboard's (improvement takes time).
// month is week-by-week so it's noisier; quarter/year smooth out and trend up.
const TREND_CONFIG = {
  month: {
    labels: ['שבוע 1', 'שבוע 2', 'שבוע 3', 'שבוע 4'],
    current: [46, 63, 41, 57], prev: [52, 43, 49, 38], xLabel: 'לפי שבוע',
  },
  quarter: {
    labels: ['חודש 1', 'חודש 2', 'חודש 3'],
    current: [53, 49, 64], prev: [45, 51, 47], xLabel: 'לפי חודש',
  },
  year: {
    labels: ['רבעון 1', 'רבעון 2', 'רבעון 3', 'רבעון 4'],
    current: [47, 58, 56, 69], prev: [40, 44, 53, 51], xLabel: 'לפי רבעון',
  },
}

const UpArrow = ({ size = 10 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 19V5"/><path d="M6 11l6-6 6 6"/>
  </svg>
)
const DownArrow = ({ size = 10 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 5v14"/><path d="M6 13l6 6 6-6"/>
  </svg>
)

const METRIC_META = [
  { key: 'duration', label: 'משך שיחה ממוצע', tag: 'best', tagLabel: 'מצוין', up: true,  unit: ' דק׳' },
  { key: 'ratio',    label: 'יחס דיבור',       tag: 'good', tagLabel: 'טוב',   up: false, unit: '%' },
  { key: 'silence',  label: 'זמני שתיקה',      tag: 'warn', tagLabel: 'לשיפור', up: false, unit: ' ש׳' },
  { key: 'pace',     label: 'קצב דיבור',       tag: 'good', tagLabel: 'טוב',   up: true,  unit: ' מילים לדקה' },
]

// metric sparkline data per horizon (month noisier, quarter/year smoother & trending)
const METRIC_DATA = {
  month: {
    duration: [3.2, 4.1, 3.4, 4.3],
    ratio:    [61, 52, 64, 54],
    silence:  [14, 9, 13, 8],
    pace:     [126, 141, 130, 145],
  },
  quarter: {
    duration: [3.4, 3.9, 4.4],
    ratio:    [60, 56, 50],
    silence:  [13, 11, 8],
    pace:     [129, 137, 146],
  },
  year: {
    duration: [3.1, 3.6, 3.8, 4.5],
    ratio:    [64, 58, 55, 49],
    silence:  [15, 12, 10, 8],
    pace:     [124, 132, 139, 148],
  },
}

function getMetrics(period) {
  const d = METRIC_DATA[period] || METRIC_DATA.month
  return METRIC_META.map((m) => ({ ...m, data: d[m.key] }))
}

function MetricSpark({ data, unit }) {
  return (
    <div style={{ position: 'relative', width: '100%', height: '100%', minHeight: 34 }}>
      <div style={{ position: 'absolute', inset: 0 }}>
        <SparkLineChart
          data={data}
          curve="natural"
          showTooltip
          showHighlight
          color="#6b6b6b"
          margin={{ top: 5, bottom: 5, left: 2, right: 2 }}
          valueFormatter={(val) => (val == null ? '' : `${val}${unit || ''}`)}
          sx={{
            '& .MuiLineElement-root': { stroke: '#6b6b6b' },
            '& .MuiAreaElement-root': { fill: '#6b6b6b' },
            '& .MuiHighlightElement-root, & .MuiMarkElement-root': { stroke: '#6b6b6b', fill: '#6b6b6b' },
          }}
        />
      </div>
    </div>
  )
}

function MetricCardInner({ m }) {
  const { label, tag, tagLabel, up } = m
  return (
    <>
      <div className="mt-top">
        <span className="mt-label">{label}</span>
        <span className={`mt-tag ${tag}`}>
          {tag === 'best' && (
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M4 21l5-12 7 7-12 5z"/><path d="M14 7l1.6-1.6M18 10l2-1M16 4v.01M20.5 6.5v.01"/>
            </svg>
          )}
          {tagLabel}
        </span>
      </div>
      <div className="mt-valrow">
        <span className="mt-val"></span>
        <span className="mt-delta">
          <span className="arrow">{up ? <UpArrow /> : <DownArrow />}</span>
          <span className="d-val"></span>
        </span>
      </div>
      <div className="mt-spark">
        <MetricSpark data={m.data} unit={m.unit} />
      </div>
    </>
  )
}

const EASE = 'top .42s cubic-bezier(.4,0,.2,1), left .42s cubic-bezier(.4,0,.2,1), width .42s cubic-bezier(.4,0,.2,1), height .42s cubic-bezier(.4,0,.2,1)'

// FLIP-animated metric grid: the clicked card grows diagonally to fill the
// whole area; clicking the back arrow shrinks it back to its cell.
function MetricsTrend({ metrics }) {
  const [expanded, setExpanded] = useState(null)
  const cardRefs = useRef([])
  const gridRef = useRef(null)
  const flip = useRef(null)

  const rectIn = (i) => {
    const cr = cardRefs.current[i].getBoundingClientRect()
    const gr = gridRef.current.getBoundingClientRect()
    return { top: cr.top - gr.top, left: cr.left - gr.left, width: cr.width, height: cr.height }
  }
  const expand = (i) => { flip.current = { dir: 'expand', index: i, ...rectIn(i) }; setExpanded(i) }
  const collapse = () => { const i = expanded; flip.current = { dir: 'collapse', index: i, ...rectIn(i) }; setExpanded(null) }

  useLayoutEffect(() => {
    const f = flip.current
    if (!f) return
    flip.current = null
    const card = cardRefs.current[f.index]
    const grid = gridRef.current
    if (!card || !grid) return
    const set = (t, l, w, h) => { card.style.top = t; card.style.left = l; card.style.width = w; card.style.height = h }

    if (f.dir === 'expand') {
      card.style.transition = 'none'
      set(f.top + 'px', f.left + 'px', f.width + 'px', f.height + 'px')
      card.getBoundingClientRect() // reflow
      requestAnimationFrame(() => { card.style.transition = EASE; set('0px', '0px', '100%', '100%') })
    } else {
      // clear leftover inline sizing so the card snaps to its natural cell, measure it,
      // then pin it absolute (spanning the whole grid) and animate back down to that cell
      card.style.cssText = ''
      const gr = grid.getBoundingClientRect()
      const last = card.getBoundingClientRect()
      const target = { t: (last.top - gr.top) + 'px', l: (last.left - gr.left) + 'px', w: last.width + 'px', h: last.height + 'px' }
      card.style.position = 'absolute'; card.style.zIndex = '4'; card.style.margin = '0'
      card.style.gridColumn = '1 / -1'; card.style.gridRow = '1 / -1'
      card.style.transition = 'none'
      set(f.top + 'px', f.left + 'px', f.width + 'px', f.height + 'px')
      card.getBoundingClientRect()
      requestAnimationFrame(() => { card.style.transition = EASE; set(target.t, target.l, target.w, target.h) })
      const cleanup = () => { card.style.cssText = ''; card.removeEventListener('transitionend', cleanup) }
      card.addEventListener('transitionend', cleanup)
    }
  }, [expanded])

  return (
    <div className="card metrics-card">
      <div className="metrics-head">
        <div className="card-title" style={{ marginBottom: 0 }}>מגמת מדדים לאורך זמן</div>
        {expanded !== null && (
          <div className="me-back" onClick={collapse}>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 18l6-6-6-6"/>
            </svg>
            חזרה לכל המדדים
          </div>
        )}
      </div>
      <div className="metrics-grid" ref={gridRef}>
        {metrics.map((m, i) => (
          <div
            key={m.label}
            ref={(el) => (cardRefs.current[i] = el)}
            className={`mt-card${expanded === i ? ' is-expanded' : ''}${expanded !== null && expanded !== i ? ' is-hidden' : ''}`}
            onClick={() => expanded === null && expand(i)}
          >
            <MetricCardInner m={m} />
          </div>
        ))}
      </div>
    </div>
  )
}

export default function Progress({ timePeriod = 'month' }) {
  const trend = TREND_CONFIG[timePeriod] || TREND_CONFIG.month
  const metrics = getMetrics(timePeriod)
  return (
    <div className="main page-progress">
      <div>
        <div className="page-title">האם אתה משתפר?</div>
        <div className="page-sub">המגמה הכללית שלך עולה, הנה מה שמתחזק ומה שעדיין דורש תשומת לב.</div>
      </div>

      {/* insights + metric trends */}
      <div className="analysis-row">

        {/* insights */}
        <div className="card">
          <div className="card-title with-icon">
            <span className="ai-mark">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 3l1.8 4.7L18.5 9.5 13.8 11.3 12 16l-1.8-4.7L5.5 9.5l4.7-1.8z"/>
                <path d="M18 15l.7 1.8 1.8.7-1.8.7L18 20l-.7-1.8-1.8-.7 1.8-.7z"/>
                <path d="M6 2.5l.5 1.3L7.8 4.3 6.5 4.8 6 6l-.5-1.2L4.2 4.3l1.3-.5z"/>
              </svg>
            </span>
            תובנות מרכזיות
          </div>
          <div className="insights-stack">
            <div className="insight">
              <div className="i-head">
                <span className="i-ico"><UpArrow size={11} /></span>
                השתפרת
              </div>
              <div className="ln" style={{ width: '94%' }}></div>
              <div className="ln" style={{ width: '70%', marginBottom: 0 }}></div>
            </div>
            <div className="insight">
              <div className="i-head">
                <span className="i-ico">
                  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 8v5"/><path d="M12 16h.01"/><circle cx="12" cy="12" r="9"/>
                  </svg>
                </span>
                שים לב
              </div>
              <div className="ln" style={{ width: '90%' }}></div>
              <div className="ln" style={{ width: '64%', marginBottom: 0 }}></div>
            </div>
            <div className="insight">
              <div className="i-head">
                <span className="i-ico">
                  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="9"/><path d="M12 8v4l3 2"/>
                  </svg>
                </span>
                המלצה להמשך
              </div>
              <div className="ln" style={{ width: '92%' }}></div>
              <div className="ln" style={{ width: '68%', marginBottom: 0 }}></div>
            </div>
          </div>
        </div>

        {/* metric trends */}
        <MetricsTrend metrics={metrics} />
      </div>

      {/* main trend chart */}
      <div className="card chart-card">
        <div className="chart-head">
          <div className="card-title">שיעור ההצלחה שלך עולה לאורך הזמן</div>
        </div>
        <div className="chart-wrap">
          <SuccessChart
            xLabels={trend.labels}
            xAxisLabel={trend.xLabel}
            series={[
              { data: trend.current, label: 'התקופה הנוכחית', color: '#3a3a3a' },
              { data: trend.prev, label: 'התקופה הקודמת', color: '#b3b3b3' },
            ]}
          />
          <div className="legend-side">
            <div className="legend-explain">
              <div className="le-title">איך מחושב שיעור ההצלחה?</div>
              <div className="le-text">אחוז השיחות שבהן השגת את מטרת השיחה, למשל קביעת פגישת המשך או סגירת עסקה, מתוך כלל השיחות בתקופה.</div>
            </div>
            <span><i className="lg-line"></i>התקופה הנוכחית</span>
            <span><i className="lg-line prev"></i>התקופה הקודמת</span>
          </div>
        </div>
      </div>
    </div>
  )
}
