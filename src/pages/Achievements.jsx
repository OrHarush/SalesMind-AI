import { useEffect, useRef, useState } from 'react'
import Dialog from '@mui/material/Dialog'

const PointsIcon = ({ size = 17 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="9"/><path d="M12 7v10M9 10l3-3 3 3"/>
  </svg>
)
const MedalIcon = ({ size = 20 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="8" r="5"/><path d="M8.5 12.5L7 21l5-3 5 3-1.5-8.5"/>
  </svg>
)
const LockIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <rect x="5" y="11" width="14" height="10" rx="2"/><path d="M8 11V7a4 4 0 0 1 8 0v4"/>
  </svg>
)

// 17 colleagues; "me" is in 3rd place. Only the first 5 show until "view more".
const lbRows = Array.from({ length: 17 }, (_, i) => ({ rank: i + 1, me: i + 1 === 3 }))

// 9 badges: first 3 earned, the rest locked (the last few sit off-screen until you scroll)
const BADGES = [
  { locked: false }, { locked: false }, { locked: false },
  { locked: true }, { locked: true }, { locked: true },
  { locked: true }, { locked: true }, { locked: true },
]

// full collection shown in the "all badges" dialog (first 6 earned, rest locked)
const ALL_BADGES = Array.from({ length: 18 }, (_, i) => ({ locked: i >= 6 }))

function BadgeStrip({ onOpenBadge }) {
  const ref = useRef(null)
  const drag = useRef({ down: false, startX: 0, startLeft: 0, moved: false })

  const onDown = (e) => {
    const el = ref.current
    drag.current = { down: true, startX: e.clientX, startLeft: el.scrollLeft, moved: false }
    el.classList.add('dragging')
  }
  const onMove = (e) => {
    if (!drag.current.down) return
    const dx = e.clientX - drag.current.startX
    if (Math.abs(dx) > 3) drag.current.moved = true
    ref.current.scrollLeft = drag.current.startLeft - dx
  }
  const endDrag = () => {
    drag.current.down = false
    ref.current?.classList.remove('dragging')
  }

  // Turn vertical wheel into horizontal scroll. Registered as a non-passive
  // native listener so preventDefault works (React's onWheel is passive).
  // RTL: revealing content on the left means decreasing scrollLeft.
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const onWheel = (e) => {
      if (el.scrollWidth <= el.clientWidth) return
      e.preventDefault()
      el.scrollLeft -= (e.deltaY || e.deltaX)
    }
    el.addEventListener('wheel', onWheel, { passive: false })
    return () => el.removeEventListener('wheel', onWheel)
  }, [])

  return (
    <div
      className="badge-strip"
      ref={ref}
      onMouseDown={onDown}
      onMouseMove={onMove}
      onMouseUp={endDrag}
      onMouseLeave={endDrag}
    >
      {BADGES.map((b, i) => (
        <div
          className={`badge${b.locked ? ' locked' : ''}`}
          key={i}
          onClick={() => { if (!drag.current.moved) onOpenBadge(b) }}
        >
          <div className="b-medal">{b.locked ? <LockIcon /> : <MedalIcon />}</div>
          <div className="b-name"></div>
          <div className="b-points"><PointsIcon size={13} />{b.locked ? '__ נק׳' : '+__ נק׳'}</div>
        </div>
      ))}
    </div>
  )
}

// xxxx@xxxx.com — tld must be at least two letters (.com, .co, .io ...)
const EMAIL_RE = /^[^\s@]+@[^\s@.]+\.[a-zA-Z]{2,}$/
const EMAIL_SEGMENTS = [
  { key: 'local',  text: 'xxxx' },
  { key: 'at',     text: '@' },
  { key: 'domain', text: 'xxxx' },
  { key: 'dot',    text: '.' },
  { key: 'tld',    text: 'com' },
]
const SEG_ORDER = ['local', 'at', 'domain', 'dot', 'tld']

// which part of the pattern the user is currently filling
function activeEmailSegment(value) {
  const at = value.indexOf('@')
  if (at === -1) return 'local'
  const afterAt = value.slice(at + 1)
  if (afterAt === '') return 'at'
  const dot = afterAt.indexOf('.')
  if (dot === -1) return 'domain'
  if (afterAt.slice(dot + 1) === '') return 'dot'
  return 'tld'
}

function AddColleagueDialog({ open, onClose }) {
  const [email, setEmail] = useState('')
  const valid = EMAIL_RE.test(email)
  const activeIdx = SEG_ORDER.indexOf(activeEmailSegment(email))
  const segState = (key) => {
    if (valid) return 'done'
    const i = SEG_ORDER.indexOf(key)
    if (i === activeIdx) return 'active'
    return i < activeIdx ? 'done' : 'todo'
  }
  const close = () => { setEmail(''); onClose() }

  return (
    <Dialog open={open} onClose={close} PaperProps={{ className: 'sm-dialog' }}>
      <div className="dlg">
        <div className="dlg-head">
          <div className="dlg-title">הוספת קולגה</div>
          <div className="dlg-close" onClick={close}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M18 6L6 18M6 6l12 12"/>
            </svg>
          </div>
        </div>
        <div className="dlg-sub">הזינו את כתובת המייל של הקולגה כדי לשלוח בקשת הוספה.</div>
        <label className="dlg-field">
          <span className="dlg-label">כתובת מייל</span>
          <input
            className={`dlg-input${email && !valid ? ' invalid' : ''}${valid ? ' ok' : ''}`}
            type="email"
            placeholder="name@company.com"
            dir="ltr"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <div className="email-template" dir="ltr">
            {EMAIL_SEGMENTS.map((s) => (
              <span key={s.key} className={`et-seg ${segState(s.key)}`}>{s.text}</span>
            ))}
          </div>
          <div className={`email-status${valid ? ' valid' : ''}`}>
            {valid ? (
              <>
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6L9 17l-5-5"/></svg>
                כתובת תקינה
              </>
            ) : 'השלימו את הכתובת לפי התבנית, כולל סיומת תקינה כמו ‎.com'}
          </div>
        </label>
        <div className="dlg-actions">
          <div className="btn subtle" onClick={close}>ביטול</div>
          <div className={`btn primary${valid ? '' : ' disabled'}`} onClick={() => valid && close()}>שליחת בקשה</div>
        </div>
      </div>
    </Dialog>
  )
}

function BadgeDialog({ badge, onClose }) {
  if (!badge) return null
  const locked = badge.locked
  return (
    <Dialog open onClose={onClose} PaperProps={{ className: 'sm-dialog' }}>
      <div className="dlg badge-dlg">
        <div className="dlg-close abs" onClick={onClose}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M18 6L6 18M6 6l12 12"/>
          </svg>
        </div>
        <div className={`badge-dlg-icon${locked ? ' locked' : ''}`}>
          {locked ? <LockIcon /> : <MedalIcon size={30} />}
        </div>
        <div className="dlg-title">{locked ? 'תג נעול' : 'תג שנפתח'}</div>
        <div className="dlg-sub center">
          {locked
            ? 'השלימו את היעד הנדרש כדי לפתוח את התג הזה ולצבור עליו נקודות.'
            : 'קיבלת את התג הזה על התמדה ושיפור מתמשך בשיחות. כל הכבוד!'}
        </div>
        <div className="badge-dlg-points"><PointsIcon size={14} />{locked ? '__ נק׳' : '+__ נק׳'}</div>
        <div className="btn primary" onClick={onClose}>הבנתי</div>
      </div>
    </Dialog>
  )
}

function AllBadgesDialog({ open, onClose, onOpenBadge }) {
  return (
    <Dialog open={open} onClose={onClose} PaperProps={{ className: 'badges-dialog' }}>
      <div className="dlg">
        <div className="dlg-head">
          <div className="dlg-title">כל התגים</div>
          <div className="dlg-close" onClick={onClose}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6L6 18M6 6l12 12"/></svg>
          </div>
        </div>
        <div className="dlg-sub">אוסף התגים שאפשר לפתוח לאורך הדרך, לפי התקדמות וביצועים.</div>
        <div className="all-badges-grid">
          {ALL_BADGES.map((b, i) => (
            <div className={`badge${b.locked ? ' locked' : ''}`} key={i} onClick={() => onOpenBadge(b)}>
              <div className="b-medal">{b.locked ? <LockIcon /> : <MedalIcon />}</div>
              <div className="b-name"></div>
              <div className="b-points"><PointsIcon size={13} />{b.locked ? '__ נק׳' : '+__ נק׳'}</div>
            </div>
          ))}
        </div>
      </div>
    </Dialog>
  )
}

export default function Achievements() {
  const [addOpen, setAddOpen] = useState(false)
  const [activeBadge, setActiveBadge] = useState(null)
  const [allBadgesOpen, setAllBadgesOpen] = useState(false)
  const [lbExpanded, setLbExpanded] = useState(false)
  const visibleRows = lbExpanded ? lbRows : lbRows.slice(0, 5)
  return (
    <div className="main page-achievements">
      <div>
        <div className="page-title">ההישגים שלך</div>
        <div className="page-sub">מעקב אחר ההתמדה, הנקודות והתגים שצברת לאורך הדרך.</div>
      </div>

      {/* summary stats */}
      <div className="summary-row">
        <div className="summary-stat">
          <div className="s-ico">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 2c1 3 4 5 4 9a4 4 0 0 1-8 0c0-1 .3-2 1-3 .2 2 1.5 2.5 1.5 2.5C10 9 12 6 12 2z"/>
              <path d="M8 13a4 4 0 0 0 8 0"/>
            </svg>
          </div>
          <div>
            <div className="s-label">רצף נוכחי</div>
            <div className="s-value"></div>
            <div className="s-sub">
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 21V8l7-5 7 5v13"/><path d="M9 21v-6h6v6"/>
              </svg>
              שיא: <span className="ss-val"></span> ימים
            </div>
          </div>
        </div>
        <div className="summary-stat">
          <div className="s-ico">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="9"/><path d="M12 7v10M9 10l3-3 3 3"/>
            </svg>
          </div>
          <div>
            <div className="s-label">סך הנקודות</div>
            <div className="s-value"></div>
          </div>
        </div>
        <div className="summary-stat">
          <div className="s-ico"><MedalIcon /></div>
          <div>
            <div className="s-label">תגים שנצברו</div>
            <div className="s-value"></div>
          </div>
        </div>
      </div>

      {/* mid row */}
      <div className="mid-row">

        {/* leaderboard */}
        <div className="card lb-card">
          <div className="card-head" style={{ marginBottom: '10px' }}>
            <div className="card-title" style={{ marginBottom: 0 }}>דירוג קולגות לפי נקודות</div>
            <div className="btn" onClick={() => setAddOpen(true)}>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 5v14M5 12h14"/>
              </svg>
              הוספת קולגה
            </div>
          </div>
          <div className={`lb-list${lbExpanded ? ' scroll' : ''}`}>
            {visibleRows.map(({ rank, me }) => (
              <div className={`lb-row${me ? ' me' : ''}`} key={rank}>
                <div className="lb-rank">{rank}</div>
                <div className="lb-avatar">{me ? 'את/ה' : 'תמונה'}</div>
                <div className="lb-name"><div className="nm"></div></div>
                <div className="lb-points">
                  <PointsIcon />
                  <span className="lp-val"></span>
                </div>
              </div>
            ))}
          </div>
          <div className="lb-more" onClick={() => setLbExpanded((v) => !v)}>
            {lbExpanded ? 'הצג פחות' : `הצג עוד (${lbRows.length - 5})`}
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ transform: lbExpanded ? 'rotate(180deg)' : 'none' }}>
              <path d="M6 9l6 6 6-6"/>
            </svg>
          </div>
        </div>

        {/* right stack: streak calendar + points */}
        <div className="side-stack-ach">

          {/* streak calendar */}
          <div className="card streak-card-ach">
            <div className="card-title">רצף הכניסות שלך</div>
            <div className="cal-frame">
              <div className="streak-cal">
                {['א׳','ב׳','ג׳','ד׳','ה׳','ו׳','ש׳'].map(d => (
                  <div className="wd" key={d}>{d}</div>
                ))}
                {/* week 1 (partial) */}
                <div className="day empty"></div><div className="day empty"></div>
                <div className="day kept"></div><div className="day kept"></div>
                <div className="day kept"></div><div className="day missed"></div>
                <div className="day kept"></div>
                {/* week 2 */}
                <div className="day kept"></div><div className="day kept"></div>
                <div className="day kept"></div><div className="day kept"></div>
                <div className="day missed"></div><div className="day kept"></div>
                <div className="day kept"></div>
                {/* week 3 */}
                <div className="day kept"></div><div className="day kept"></div>
                <div className="day kept"></div><div className="day missed"></div>
                <div className="day kept"></div><div className="day kept"></div>
                <div className="day kept"></div>
                {/* week 4 */}
                <div className="day kept"></div><div className="day kept"></div>
                <div className="day kept"></div><div className="day kept"></div>
                <div className="day kept"></div><div className="day today"></div>
                <div className="day empty"></div>
                {/* week 5 (future) */}
                {Array(7).fill(null).map((_, i) => <div className="day empty" key={i}></div>)}
              </div>
            </div>
            <div className="streak-meta">
              <div className="streak-legend">
                <span><i className="kept"></i>נכנסת</span>
                <span><i className="missed"></i>הוחמץ</span>
              </div>
              <span className="streak-best">הרצף הארוך ביותר: __ ימים</span>
            </div>
          </div>

          {/* points breakdown */}
          <div className="card points-card">
            <div className="card-title">הנקודות שלך</div>
            <div className="points-total">
              <div className="pt-val"></div>
              <span className="pt-unit">נקודות סך הכול</span>
            </div>
            <div className="points-break">
              <div className="break-col">
                <span className="br-label">
                  <span className="br-ico">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7z"/><circle cx="12" cy="12" r="3"/>
                    </svg>
                  </span>
                  סקירת שיחות
                </span>
                <span className="br-val"></span>
              </div>
              <div className="break-col">
                <span className="br-label">
                  <span className="br-ico">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M3 17l6-6 4 4 7-7"/><path d="M17 8h4v4"/>
                    </svg>
                  </span>
                  ביצועים בשיחות
                </span>
                <span className="br-val"></span>
              </div>
              <div className="break-col">
                <span className="br-label">
                  <span className="br-ico">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M12 2c1 3 4 5 4 9a4 4 0 0 1-8 0c0-1 .3-2 1-3 .2 2 1.5 2.5 1.5 2.5C10 9 12 6 12 2z"/>
                      <path d="M8 13a4 4 0 0 0 8 0"/>
                    </svg>
                  </span>
                  שמירה על רצף
                </span>
                <span className="br-val"></span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* badges */}
      <div className="card">
        <div className="card-head">
          <div className="card-title">תגים</div>
          <span className="link" onClick={() => setAllBadgesOpen(true)}>לכל התגים</span>
        </div>
        <div className="badge-scroll-wrap">
          <BadgeStrip onOpenBadge={setActiveBadge} />
          <div className="badge-fade"></div>
        </div>
      </div>

      <AddColleagueDialog open={addOpen} onClose={() => setAddOpen(false)} />
      <BadgeDialog badge={activeBadge} onClose={() => setActiveBadge(null)} />
      <AllBadgesDialog
        open={allBadgesOpen}
        onClose={() => setAllBadgesOpen(false)}
        onOpenBadge={(b) => { setAllBadgesOpen(false); setActiveBadge(b) }}
      />
    </div>
  )
}
