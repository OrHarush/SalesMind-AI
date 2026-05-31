import { useLayoutEffect, useRef, useState } from 'react'

const TIME_TABS = [
  { value: 'today', label: 'היום'   },
  { value: 'week',  label: 'השבוע'  },
  { value: 'month', label: 'החודש'  },
]

// Segmented control with a sliding pill. The pill is measured from the active
// button's real geometry (getBoundingClientRect), so it is always perfectly
// centered and works correctly in RTL, with a smooth left/width transition.
function TimePeriodSelector({ value, onChange }) {
  const ref = useRef(null)
  const [pill, setPill] = useState({ left: 0, width: 0 })

  useLayoutEffect(() => {
    const measure = () => {
      const seg = ref.current
      const btn = seg?.querySelector(`[data-val="${value}"]`)
      if (seg && btn) {
        const sr = seg.getBoundingClientRect()
        const br = btn.getBoundingClientRect()
        setPill({ left: br.left - sr.left, width: br.width })
      }
    }
    measure()
    window.addEventListener('resize', measure)
    return () => window.removeEventListener('resize', measure)
  }, [value])

  return (
    <div className="seg" ref={ref}>
      <div className="seg-pill" style={{ left: pill.left, width: pill.width }} />
      {TIME_TABS.map((t) => (
        <button
          key={t.value}
          data-val={t.value}
          className={`seg-btn${value === t.value ? ' active' : ''}`}
          onClick={() => onChange(t.value)}
        >
          {t.label}
        </button>
      ))}
    </div>
  )
}

const NAV_ITEMS = [
  {
    id: 'dashboard',
    label: 'דשבורד',
    icon: (
      <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="7" height="9"/><rect x="14" y="3" width="7" height="5"/>
        <rect x="14" y="12" width="7" height="9"/><rect x="3" y="16" width="7" height="5"/>
      </svg>
    ),
  },
  {
    id: 'calls',
    label: 'כל השיחות',
    icon: (
      <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.91.34 1.85.57 2.81.7A2 2 0 0 1 22 16.92z"/>
      </svg>
    ),
  },
  {
    id: 'progress',
    label: 'התקדמות',
    icon: (
      <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 3v18h18"/><path d="M7 14l4-4 3 3 5-6"/>
      </svg>
    ),
  },
  {
    id: 'achievements',
    label: 'הישגים',
    icon: (
      <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="8" r="5"/>
        <path d="M8.5 12.5L7 21l5-3 5 3-1.5-8.5"/>
      </svg>
    ),
  },
]

// nav item height (40px) + gap between items (5px)
const ROW_HEIGHT = 45
const ITEM_HEIGHT = 40

function NotifMenu({ onGoAchievements, onGoCall }) {
  return (
    <div className="popover notif-menu" onClick={(e) => e.stopPropagation()}>
      <div className="popover-title">התראות</div>

      <div className="notif-item" onClick={onGoAchievements}>
        <span className="notif-item-ico trophy">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <path d="M8 21h8M12 17v4M7 4h10v4a5 5 0 0 1-10 0z"/><path d="M5 5H3v2a3 3 0 0 0 3 3M19 5h2v2a3 3 0 0 1-3 3"/>
          </svg>
        </span>
        <div className="notif-body">
          <div className="notif-text">עלית למקום השלישי בלוח המובילים. כל הכבוד!</div>
          <div className="notif-time">לפני שעה</div>
        </div>
      </div>

      <div className="notif-item" onClick={onGoCall}>
        <span className="notif-item-ico">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>
          </svg>
        </span>
        <div className="notif-body">
          <div className="notif-text">לא צפית בשיחה מהשבוע שעבר.</div>
          <div className="notif-cta" onClick={onGoCall}>צפה עכשיו ›</div>
        </div>
      </div>
    </div>
  )
}

function StreakCalendar() {
  // wireframe month: the user just opened the streak today, so it's day 1.
  // "today" is day 12; only today is marked. 3 leading blanks so dates line up.
  const today = 12
  const cells = [null, null, null, ...Array.from({ length: 30 }, (_, i) => i + 1)]
  return (
    <div className="popover streak-pop">
      <div className="cal-month">מאי 2026</div>
      <div className="cal-weekdays">
        {['א', 'ב', 'ג', 'ד', 'ה', 'ו', 'ש'].map((d, i) => (
          <span key={i}>{d}</span>
        ))}
      </div>
      <div className="cal-grid">
        {cells.map((d, i) =>
          d === null
            ? <span key={`b${i}`} className="cal-cell blank"></span>
            : <span key={d} className={`cal-cell${d === today ? ' today' : ''}`}>{d}</span>
        )}
      </div>
      <div className="cal-streak-line">
        <span className="flame-ico">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 2c1 3 4 5 4 9a4 4 0 0 1-8 0c0-1 .3-2 1-3 .2 2 1.5 2.5 1.5 2.5C10 9 12 6 12 2z"/>
            <path d="M8 13a4 4 0 0 0 8 0"/>
          </svg>
        </span>
        <span>הרצף שלך: <strong>יום 1</strong></span>
      </div>
    </div>
  )
}

function ProfileMenu() {
  return (
    <div className="popover profile-menu" onClick={(e) => e.stopPropagation()}>
      <div className="profile-menu-item">
        <span className="pm-ico">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="3"/>
            <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/>
          </svg>
        </span>
        הגדרות
      </div>
      <div className="profile-menu-divider"></div>
      <div className="profile-menu-item logout">
        <span className="pm-ico">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><path d="M16 17l5-5-5-5"/><path d="M21 12H9"/>
          </svg>
        </span>
        התנתקות
      </div>
    </div>
  )
}

export default function Shell({ activePage, setActivePage, navigate, timePeriod, setTimePeriod, children }) {
  // a single call (callReview) lives inside the "כל השיחות" section,
  // so keep that nav item highlighted while viewing a specific call.
  const highlightPage = activePage === 'callReview' ? 'calls' : activePage
  const activeIndex = NAV_ITEMS.findIndex(item => item.id === highlightPage)
  const [collapsed, setCollapsed] = useState(false)
  const [openMenu, setOpenMenu] = useState(null) // 'notif' | 'profile' | null
  const [streakOpen, setStreakOpen] = useState(false)

  const toggleMenu = (name) => setOpenMenu((cur) => (cur === name ? null : name))
  const goTo = (page) => { setOpenMenu(null); navigate?.(page) }

  return (
    <div className="app">
      <div className="topbar">
        <div className="brand">
          <div className="logo-box"><img src="/salesmindaiicon.png" alt="SalesMind AI" /></div>
          <span className="brand-name">SalesMind AI</span>
          <div
            className="nav-toggle"
            aria-label="כיווץ תפריט"
            onClick={() => setCollapsed((c) => !c)}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="4" width="18" height="16" rx="2"/><line x1="15" y1="4" x2="15" y2="20"/>
            </svg>
          </div>
        </div>
        <div className="topbar-right">
          {activePage !== 'achievements' && (
            <TimePeriodSelector value={timePeriod} onChange={setTimePeriod} />
          )}
          <div
            className="streak-chip"
            onMouseEnter={() => setStreakOpen(true)}
            onMouseLeave={() => setStreakOpen(false)}
          >
            <span className="flame">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 2c1 3 4 5 4 9a4 4 0 0 1-8 0c0-1 .3-2 1-3 .2 2 1.5 2.5 1.5 2.5C10 9 12 6 12 2z"/>
                <path d="M8 13a4 4 0 0 0 8 0"/>
              </svg>
            </span>
            <span className="streak-text">
              <span className="streak-strong">התחלת רצף!</span>
              <span className="streak-word">כל הכבוד</span>
            </span>
            {streakOpen && <StreakCalendar />}
          </div>
          <div className="divider"></div>
          <div
            className="icon-btn"
            aria-label="התראות"
            onClick={() => toggleMenu('notif')}
          >
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <path d="M18 8a6 6 0 0 0-12 0c0 7-3 9-3 9h18s-3-2-3-9"/>
              <path d="M13.7 21a2 2 0 0 1-3.4 0"/>
            </svg>
            <span className="notif-dot">2</span>
            {openMenu === 'notif' && (
              <NotifMenu
                onGoAchievements={() => goTo('achievements')}
                onGoCall={() => goTo('callReview')}
              />
            )}
          </div>
        </div>
      </div>

      <div className="layout">
        <div className={`sidebar${collapsed ? ' collapsed' : ''}`}>

          {/* sliding nav */}
          <div style={{ position: 'relative' }}>

            {/* animated pill — sits behind all items */}
            <div style={{
              position: 'absolute',
              left: 0,
              right: 0,
              height: ITEM_HEIGHT,
              borderRadius: 'var(--radius)',
              background: 'var(--fill)',
              border: '1px solid var(--line-soft)',
              transform: `translateY(${activeIndex * ROW_HEIGHT}px)`,
              transition: 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
              pointerEvents: 'none',
              zIndex: 0,
            }} />

            {/* items layer */}
            <div style={{ position: 'relative', zIndex: 1, display: 'flex', flexDirection: 'column', gap: '5px' }}>
              {NAV_ITEMS.map((item, i) => {
                const isActive = i === activeIndex
                return (
                  <div
                    key={item.id}
                    className="nav-item"
                    title={collapsed ? item.label : undefined}
                    style={{
                      background: 'transparent',
                      border: '1px solid transparent',
                      color: isActive ? 'var(--ink)' : 'var(--muted)',
                      fontWeight: isActive ? 700 : 400,
                      transition: 'color 0.2s ease-in-out',
                    }}
                    onClick={() => setActivePage(item.id)}
                  >
                    <span
                      className="ico"
                      style={{
                        color: isActive ? 'var(--muted)' : 'var(--faint)',
                        transition: 'color 0.2s ease-in-out',
                      }}
                    >
                      {item.icon}
                    </span>
                    <span className="nav-label">{item.label}</span>
                  </div>
                )
              })}
            </div>
          </div>

          <div
            className="side-profile"
            onClick={() => toggleMenu('profile')}
          >
            <div className="avatar">תמונה</div>
            <div className="sp-info">
              <div className="sp-name">שם המשתמש</div>
              <div className="sp-sub">הצג פרופיל</div>
            </div>
            <div className="sp-more">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="5" cy="12" r="1.4"/><circle cx="12" cy="12" r="1.4"/><circle cx="19" cy="12" r="1.4"/>
              </svg>
            </div>
            {openMenu === 'profile' && <ProfileMenu />}
          </div>
        </div>

        {children}
      </div>

      {/* click-away backdrop for click menus */}
      {openMenu && <div className="menu-backdrop" onClick={() => setOpenMenu(null)} />}
    </div>
  )
}
