import { useState } from 'react'

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
const SearchIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="7"/><path d="M21 21l-4.3-4.3"/>
  </svg>
)
const FilterIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 4h18l-7 9v6l-4 2v-8z"/>
  </svg>
)

const StatusTag = ({ status }) => {
  if (status === 'analyzing') {
    return (
      <div className="tag analyzing">
        <svg className="spin" width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 12a9 9 0 1 1-6.2-8.5"/>
        </svg>
        בניתוח
      </div>
    )
  }
  if (status === 'good') {
    return (
      <div className="tag good">
        <span className="t-ico">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20 6L9 17l-5-5"/>
          </svg>
        </span>
        פעלת נכון
      </div>
    )
  }
  return <div className="tag improve">טעון שיפור</div>
}

// Today's 5 calls — shared so they appear under "היום" in every tab.
const TODAY_CALLS = [
  { w: 150, when: '15:10', status: 'analyzing' },
  { w: 124, when: '13:30', status: 'good' },
  { w: 168, when: '12:05', status: 'improve' },
  { w: 138, when: '10:40', status: 'good' },
  { w: 156, when: '09:15', status: 'good' },
]

// Each period groups the calls differently and labels each row with a time/date.
const PERIOD_CONFIG = {
  today: {
    sub: 'כל השיחות שניהלת היום, מהאחרונה לראשונה.',
    groups: [
      { label: 'היום', calls: TODAY_CALLS },
    ],
  },
  week: {
    sub: 'כל השיחות מהשבוע, מקובצות לפי יום.',
    groups: [
      { label: 'היום', calls: TODAY_CALLS },
      {
        label: 'אתמול',
        calls: [
          { w: 160, when: '16:40', status: 'good' },
          { w: 128, when: '12:15', status: 'improve' },
          { w: 148, when: '09:50', status: 'good' },
        ],
      },
      {
        label: 'יום ראשון',
        calls: [
          { w: 142, when: '15:30', status: 'good' },
          { w: 120, when: '10:10', status: 'improve' },
        ],
      },
    ],
  },
  month: {
    sub: 'כל השיחות מהחודש, מקובצות לפי תאריך.',
    groups: [
      { label: 'היום', calls: TODAY_CALLS },
      {
        label: 'מוקדם יותר השבוע',
        calls: [
          { w: 160, when: 'אתמול, 16:40', status: 'good' },
          { w: 130, when: 'יום א׳, 09:50', status: 'improve' },
        ],
      },
      {
        label: 'מוקדם יותר החודש',
        calls: [
          { w: 162, when: '21.5', status: 'good' },
          { w: 134, when: '17.5', status: 'good' },
          { w: 146, when: '12.5', status: 'improve' },
          { w: 122, when: '06.5', status: 'good' },
        ],
      },
    ],
  },
}

const FILTERS = [
  { id: 'all',     label: 'הכול' },
  { id: 'good',    label: 'פעלת נכון' },
  { id: 'improve', label: 'טעון שיפור' },
]

export default function AllCalls({ onOpenCall, timePeriod = 'week' }) {
  const cfg = PERIOD_CONFIG[timePeriod] || PERIOD_CONFIG.week
  const [activeFilter, setActiveFilter] = useState('all')

  // apply the status filter, then drop any group left with no calls
  const groups = cfg.groups
    .map((g) => ({
      ...g,
      calls: activeFilter === 'all' ? g.calls : g.calls.filter((c) => c.status === activeFilter),
    }))
    .filter((g) => g.calls.length > 0)

  return (
    <div className="main page-allcalls">
      <div className="ac-head">
        <div>
          <div className="page-title">כל השיחות</div>
          <div className="page-sub">{cfg.sub}</div>
        </div>
        <div className="ac-toolbar">
          <div className="ac-search">
            <SearchIcon />
            <div className="ac-search-ph"></div>
          </div>
          <div className="ac-filter-label"><FilterIcon /> סינון</div>
          {FILTERS.map((f) => (
            <div
              key={f.id}
              className={`ac-filter${activeFilter === f.id ? ' active' : ''}`}
              onClick={() => setActiveFilter(f.id)}
            >
              {f.label}
            </div>
          ))}
        </div>
      </div>

      <div className="ac-list">
        {groups.length === 0 && (
          <div className="ac-empty">אין שיחות שמתאימות לסינון הזה.</div>
        )}
        {groups.map((g) => (
          <div className="ac-group" key={g.label}>
            <div className="ac-group-label">{g.label}</div>
            {g.calls.map((c, i) => (
              <div className="ac-row" key={i} onClick={onOpenCall}>
                <div className="ac-thumb"><PhoneIcon /></div>
                <div className="ac-meta">
                  <div className="ac-name" style={{ width: `${c.w}px` }}></div>
                  <div className="ac-when"><ClockIcon /> {c.when}</div>
                </div>
                <div className="ac-duration"><ClockIcon /><div className="ac-dur-val"></div></div>
                <StatusTag status={c.status} />
                <div className="ac-chevron"><ChevronIcon /></div>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}
