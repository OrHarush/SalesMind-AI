import { useState } from 'react'
import Accordion from '@mui/material/Accordion'
import AccordionSummary from '@mui/material/AccordionSummary'
import AccordionDetails from '@mui/material/AccordionDetails'
import SuccessChart from '../components/SuccessChart'

const PhoneIcon = ({ size = 17 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.91.34 1.85.57 2.81.7A2 2 0 0 1 22 16.92z"/>
  </svg>
)
const ChevronIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M15 18l-6-6 6-6"/>
  </svg>
)
const ClockIcon = () => (
  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 3"/>
  </svg>
)

function RecentCalls({ title, rows, onViewAll, onViewCall }) {
  const [hovered, setHovered] = useState(null)
  const lastIndex = rows.length - 1
  return (
    <div className="card">
      <div className="card-head">
        <div className="card-title">{title}</div>
        <span className="link" onClick={onViewAll}>לכל השיחות</span>
      </div>
      <div className={`calls-list${hovered === lastIndex ? ' align-bottom' : ''}`}>
        {rows.map((r, i) => {
          const openUp = i === lastIndex
          return (
            <Accordion
              key={i}
              expanded={hovered === i}
              disableGutters
              square
              elevation={0}
              className={`call-accordion${openUp ? ' open-up' : ''}`}
              onMouseEnter={() => setHovered(i)}
              onMouseLeave={() => setHovered(null)}
            >
              <AccordionSummary className="call-summary" expandIcon={<ChevronIcon />} onClick={onViewCall}>
                {r.summary}
              </AccordionSummary>
              <AccordionDetails className="call-details">
                <div className="call-expand-line">{r.line}</div>
                <div className="call-cta" onClick={onViewCall}>לחצו כאן למידע נוסף ›</div>
              </AccordionDetails>
            </Accordion>
          )
        })}
      </div>
    </div>
  )
}

const PERIOD_CONFIG = {
  today: {
    pageTitle: 'איך היו השיחות שלך היום?',
    pageSub: 'הנה סיכום השיחות שניהלת היום.',
    heroTitle: 'השיחה החשובה ביותר היום',
    aiTitle: 'השורה התחתונה היום',
    callsTitle: 'שיחות היום',
    chartTitle: 'ביצועים היום',
    chartSub: 'מעקב אחר שיעור ההצלחה שלך לאורך היום',
    xAxisLabel: 'שעה ביום',
    points: [
      { x: 55,  y: 175 }, { x: 110, y: 150 }, { x: 165, y: 162 },
      { x: 220, y: 128 }, { x: 275, y: 110 }, { x: 330, y: 118 },
      { x: 385, y: 88  }, { x: 440, y: 100 },
    ],
    xLabels: [
      { x: 55,  label: '9:00'  }, { x: 110, label: '10:00' },
      { x: 165, label: '11:00' }, { x: 220, label: '12:00' },
      { x: 275, label: '13:00' }, { x: 330, label: '14:00' },
      { x: 385, label: '15:00' }, { x: 440, label: '16:00' },
    ],
    successData: [38, 46, 52, 49, 41, 57, 62, 66],
    metrics: [
      { label: 'משך שיחה ממוצע', up: true  },
      { label: 'יחס דיבור',       up: false },
      { label: 'זמני שתיקה',      up: false },
      { label: 'קצב דיבור',       up: true  },
    ],
  },
  week: {
    pageTitle: 'איך היו השיחות שלך השבוע?',
    pageSub: 'כמה שיחות התנהלו מצוין, כל הכבוד! הנה איפה אפשר להמשיך להשתפר.',
    heroTitle: 'השיחה החשובה ביותר השבוע',
    aiTitle: 'השורה התחתונה השבוע',
    callsTitle: 'שיחות אחרונות',
    chartTitle: 'ביצועים השבוע',
    chartSub: 'מעקב אחר שיעור ההצלחה שלך לאורך השבוע',
    xAxisLabel: 'יום בשבוע',
    points: [
      { x: 75,  y: 150 }, { x: 140, y: 120 }, { x: 205, y: 134 },
      { x: 270, y: 86  }, { x: 335, y: 100 }, { x: 400, y: 52  },
      { x: 460, y: 70  },
    ],
    xLabels: [
      { x: 75,  label: "א׳" }, { x: 140, label: "ב׳" }, { x: 205, label: "ג׳" },
      { x: 270, label: "ד׳" }, { x: 335, label: "ה׳" }, { x: 400, label: "ו׳" },
      { x: 460, label: "ש׳" },
    ],
    successData: [45, 53, 48, 61, 57, 64, 71],
    metrics: [
      { label: 'משך שיחה ממוצע', up: true  },
      { label: 'יחס דיבור',       up: false },
      { label: 'זמני שתיקה',      up: false },
      { label: 'קצב דיבור',       up: true  },
    ],
  },
  month: {
    pageTitle: 'איך היו השיחות שלך החודש?',
    pageSub: 'סיכום חודשי של הביצועים שלך, ראה כיצד השתפרת לאורך הזמן.',
    heroTitle: 'השיחה החשובה ביותר החודש',
    aiTitle: 'השורה התחתונה החודש',
    callsTitle: 'שיחות החודש',
    chartTitle: 'ביצועים החודש',
    chartSub: 'מעקב אחר שיעור ההצלחה שלך לאורך החודש',
    xAxisLabel: 'שבוע בחודש',
    points: [
      { x: 100, y: 168 }, { x: 220, y: 136 },
      { x: 340, y: 100 }, { x: 430, y: 68  },
    ],
    xLabels: [
      { x: 100, label: 'שבוע 1' }, { x: 220, label: 'שבוע 2' },
      { x: 340, label: 'שבוע 3' }, { x: 430, label: 'שבוע 4' },
    ],
    successData: [51, 58, 53, 67],
    metrics: [
      { label: 'משך שיחה ממוצע', up: true  },
      { label: 'יחס דיבור',       up: true  },
      { label: 'זמני שתיקה',      up: false },
      { label: 'קצב דיבור',       up: true  },
    ],
  },
}

export default function Dashboard({ onViewCall, onViewAll, timePeriod = 'week' }) {
  const cfg = PERIOD_CONFIG[timePeriod]

  return (
    <div className="main page-dashboard">
      <div style={{ marginBottom: '10px' }}>
        <div className="page-title">{cfg.pageTitle}</div>
        <div className="page-sub">{cfg.pageSub}</div>
      </div>

      {/* ROW 1: hero + AI summary */}
      <div className="row-top">
        <div className="card hero">
          <div style={{ display: 'flex', gap: '13px' }}>
            <div className="thumb"><PhoneIcon size={18} /></div>
            <div style={{ flex: 1 }}>
              <div className="card-title">{cfg.heroTitle}</div>
              <div className="ln" style={{ width: '88%' }}></div>
              <div className="ln" style={{ width: '64%' }}></div>
              <div className="ln soft" style={{ width: '74%', marginBottom: '11px' }}></div>
              <div className="btn primary" onClick={onViewCall}>צפייה בשיחה</div>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="card-title with-icon">
            <span className="ai-mark">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 3l1.8 4.7L18.5 9.5 13.8 11.3 12 16l-1.8-4.7L5.5 9.5l4.7-1.8z"/>
                <path d="M18 15l.7 1.8 1.8.7-1.8.7L18 20l-.7-1.8-1.8-.7 1.8-.7z"/>
                <path d="M6 2.5l.5 1.3L7.8 4.3 6.5 4.8 6 6l-.5-1.2L4.2 4.3l1.3-.5z"/>
              </svg>
            </span>
            {cfg.aiTitle}
          </div>
          <div className="ln" style={{ width: '96%' }}></div>
          <div className="ln" style={{ width: '90%' }}></div>
          <div className="ln" style={{ width: '62%', marginBottom: 0 }}></div>
        </div>
      </div>

      {/* ROW 2: recent calls */}
      <RecentCalls
        title={cfg.callsTitle}
        onViewAll={onViewAll}
        onViewCall={onViewCall}
        rows={[
          {
            line: 'השיחה עדיין בניתוח. זמן משוער להשלמת הניתוח: כדקה–שתיים, ואז יוצגו כאן התובנות.',
            summary: (
              <>
                <div className="thumb"><PhoneIcon /></div>
                <div className="call-meta">
                  <div className="call-title-row">
                    <div className="call-name" style={{ width: '140px' }}></div>
                    <div className="call-duration"><ClockIcon /><div className="dur-val empty"></div></div>
                  </div>
                  <div className="ln soft" style={{ width: '64%', marginBottom: 0 }}></div>
                </div>
                <div className="tag analyzing">
                  <svg className="spin" width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 12a9 9 0 1 1-6.2-8.5"/>
                  </svg>
                  בניתוח
                </div>
              </>
            ),
          },
          {
            line: 'כאן פעלת נכון, זיהינו פעולה מוצלחת בשיחה ששווה לשמר ולחזור עליה גם בהמשך.',
            summary: (
              <>
                <div className="thumb"><PhoneIcon /></div>
                <div className="call-meta">
                  <div className="call-title-row">
                    <div className="call-name" style={{ width: '120px' }}></div>
                    <div className="call-duration"><ClockIcon /><div className="dur-val"></div></div>
                  </div>
                  <div className="ln soft" style={{ width: '58%', marginBottom: 0 }}></div>
                </div>
                <div className="tag good">
                  <span className="t-ico">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M3 21l5.5-13L16 15.5z"/>
                      <path d="M14 6.5c.8-.8 2-.8 2.8 0"/>
                      <path d="M18 3c.6-.6 1.6-.6 2.2 0"/>
                      <path d="M17.5 9.5c.7.3 1.1 1 1 1.8"/>
                      <path d="M13.5 3.2c.3.7.1 1.5-.4 2"/>
                      <circle cx="20.5" cy="13.5" r=".6" fill="currentColor"/>
                      <circle cx="11" cy="2.5" r=".6" fill="currentColor"/>
                    </svg>
                  </span>
                  פעלת נכון
                </div>
              </>
            ),
          },
          {
            line: 'כאן יש מקום לשיפור, מומלץ לתרגל את הנקודה הזו וליישם אותה בשיחות הבאות.',
            summary: (
              <>
                <div className="thumb"><PhoneIcon /></div>
                <div className="call-meta">
                  <div className="call-title-row">
                    <div className="call-name" style={{ width: '150px' }}></div>
                    <div className="call-duration"><ClockIcon /><div className="dur-val"></div></div>
                  </div>
                  <div className="ln soft" style={{ width: '62%', marginBottom: 0 }}></div>
                </div>
                <div className="nudge">
                  <span className="n-ico">
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="4.5"/><circle cx="12" cy="12" r="1" fill="currentColor"/>
                    </svg>
                  </span>
                  תרגל את הנקודה הזו
                </div>
                <div className="tag improve">טעון שיפור</div>
              </>
            ),
          },
        ]}
      />

      {/* ROW 3: chart + stats */}
      <div className="row-bottom">
        <div className="card graph-card">
          <div className="card-title">{cfg.chartTitle}</div>
          <div className="card-sub">{cfg.chartSub}</div>
          <div className="chart-center">
            <SuccessChart
              xLabels={cfg.xLabels.map((l) => l.label)}
              xAxisLabel={cfg.xAxisLabel}
              series={[{ data: cfg.successData, label: 'שיעור הצלחה', color: '#6b6b6b' }]}
            />
          </div>
        </div>

        <div className="side-stack-dash">
          <div className="card stats-card">
            <div className="card-title">נתוני שיחות</div>
            <div className="metric-center">
              <div className="metric-grid">
                {cfg.metrics.map(({ label, up }) => (
                  <div className="metric" key={label}>
                    <div className="m-label">{label}</div>
                    <div className="m-value"></div>
                    <div className="m-trend">
                      <span className="arrow">
                        {up
                          ? <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><path d="M12 19V5"/><path d="M6 11l6-6 6 6"/></svg>
                          : <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><path d="M12 5v14"/><path d="M6 13l6 6 6-6"/></svg>
                        }
                      </span>
                      <span className="trend-num"></span>
                      <span>לעומת {timePeriod === 'today' ? 'אתמול' : timePeriod === 'week' ? 'השבוע שעבר' : 'החודש שעבר'}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
