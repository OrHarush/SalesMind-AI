import { useLayoutEffect, useRef, useState } from 'react'
import { SparkLineChart } from '@mui/x-charts/SparkLineChart'
import SuccessChart from '../components/SuccessChart'

const TREND_LABELS = ['שבוע 1', 'שבוע 2', 'שבוע 3', 'שבוע 4', 'שבוע 5', 'שבוע 6']
const TREND_CURRENT = [42, 55, 52, 68, 76, 82]
const TREND_PREV = [38, 36, 48, 44, 64, 60]

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

const metrics = [
  { label: 'משך שיחה ממוצע', tag: 'best', tagLabel: 'מצוין', up: true,
    data: [3.4, 3.1, 3.7, 3.5, 4.2, 4.0, 4.6], unit: ' דק׳' },
  { label: 'יחס דיבור', tag: 'good', tagLabel: 'טוב', up: false,
    data: [58, 61, 55, 57, 52, 54, 49], unit: '%' },
  { label: 'זמני שתיקה', tag: 'warn', tagLabel: 'לשיפור', up: false,
    data: [13, 11, 14, 12, 10, 11, 9], unit: ' ש׳' },
  { label: 'קצב דיבור', tag: 'good', tagLabel: 'טוב', up: true,
    data: [128, 133, 130, 138, 136, 143, 147], unit: ' מילים לדקה' },
]

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

export default function Progress() {
  const [showRecord, setShowRecord] = useState(true)
  return (
    <div className="main page-progress">
      <div>
        <div className="page-title">האם אתה משתפר?</div>
        <div className="page-sub">המגמה הכללית שלך עולה, הנה מה שמתחזק ומה שעדיין דורש תשומת לב.</div>
      </div>

      {/* best-week record — compact, dismissable banner */}
      {showRecord && (
        <div className="card record-card">
          <div className="r-ico">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <path d="M8 21h8M12 17v4"/>
              <path d="M7 4h10v5a5 5 0 0 1-10 0z"/>
              <path d="M7 5H4v2a3 3 0 0 0 3 3M17 5h3v2a3 3 0 0 1-3 3"/>
            </svg>
          </div>
          <div className="r-body">
            <div className="r-label">השבוע הטוב ביותר שלך עד כה, לפי שיעור הצלחה</div>
            <div className="r-headline">
              <span className="r-val"></span> שיעור הצלחה
              <span className="r-date"></span>
              <span className="r-compare"><UpArrow size={11} /> ‎__% מעל השבוע הנוכחי</span>
            </div>
          </div>
          <div className="r-action">
            מה עשית אחרת באותו שבוע
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M15 18l-6-6 6-6"/>
            </svg>
          </div>
          <div className="r-dismiss" onClick={() => setShowRecord(false)} aria-label="התעלם">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M18 6L6 18M6 6l12 12"/>
            </svg>
          </div>
        </div>
      )}

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
            xLabels={TREND_LABELS}
            xAxisLabel="לפי שבוע"
            series={[
              { data: TREND_CURRENT, label: 'התקופה הנוכחית', color: '#3a3a3a' },
              { data: TREND_PREV, label: 'התקופה הקודמת', color: '#b3b3b3' },
            ]}
          />
          <div className="legend-side">
            <span><i className="lg-line"></i>התקופה הנוכחית</span>
            <span><i className="lg-line prev"></i>התקופה הקודמת</span>
          </div>
        </div>
      </div>
    </div>
  )
}
