import { useRef, useState } from 'react'
import Dialog from '@mui/material/Dialog'
import Snackbar from '@mui/material/Snackbar'

const FlagPin = () => (
  <span className="flag-pin">
    <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z"/>
      <path d="M4 22V4"/>
    </svg>
    סומן ע״י הבינה
  </span>
)
const JumpLink = () => (
  <div className="p-link">
    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M15 18l-6-6 6-6"/>
    </svg>
    מעבר לקטע בתמלול
  </div>
)

// icons for the four analysis variations
const CheckIco = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6L9 17l-5-5"/></svg>
)
const AlertIco = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><path d="M12 8v5"/><path d="M12 16h.01"/><circle cx="12" cy="12" r="9"/></svg>
)
const ShieldIco = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
)
const QuestionIco = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="9"/><path d="M9.5 9a2.5 2.5 0 1 1 3.5 2.3c-.8.4-1 .9-1 1.7"/><path d="M12 17h.01"/></svg>
)

// four AI-insight variations the panel switches between when you pick a line.
// each carries its own model-confidence level (no dashes in copy, commas only)
const VARIATIONS = {
  good: {
    tag: 'פעלת נכון', tagClass: 'good', icon: <CheckIco />, title: 'מה נעשה היטב',
    desc: 'פתחת את השיחה בביטחון ובנית אמון מהיר מול הלקוח.', confidence: 92,
  },
  improve: {
    tag: 'טעון שיפור', tagClass: 'improve', icon: <AlertIco />, title: 'מה אפשר לשפר',
    desc: 'כדאי להאט מעט את קצב הדיבור ולתת ללקוח יותר מקום להגיב.', confidence: 67,
  },
  objection: {
    tag: 'טיפול בהתנגדות', tagClass: 'good', icon: <ShieldIco />, title: 'טיפול בהתנגדות',
    desc: 'התמודדת בצורה רגועה עם החשש של הלקוח לגבי העלות.', confidence: 84,
  },
  question: {
    tag: 'מענה ללקוח', tagClass: 'good', icon: <QuestionIco />, title: 'מענה לשאלות הלקוח',
    desc: 'הסברת את הפתרון בבהירות, אפשר להוסיף דוגמה קצרה להמחשה.', confidence: 78,
  },
}

const MESSAGES = [
  { who: 'אני',  type: 'good',      lines: [92, 70] },
  { who: 'לקוח', type: 'question',  lines: [85, 55] },
  { who: 'אני',  type: 'improve',   flagged: true, lines: [94, 88, 60] },
  { who: 'לקוח', type: 'objection', lines: [78] },
  { who: 'אני',  type: 'good',      lines: [90, 72] },
  { who: 'לקוח', type: 'question',  lines: [82, 48] },
  { who: 'אני',  type: 'objection', flagged: true, lines: [88, 64] },
  { who: 'לקוח', type: 'question',  lines: [80, 52] },
  { who: 'אני',  type: 'improve',   flagged: true, lines: [92, 76] },
  { who: 'לקוח', type: 'good',      lines: [70] },
  { who: 'אני',  type: 'good',      lines: [86, 58] },
  { who: 'לקוח', type: 'question',  lines: [76, 50] },
]

export default function CallReview({ onBack }) {
  const [selected, setSelected] = useState(2)
  const [viewed, setViewed] = useState(false)
  const [atBottom, setAtBottom] = useState(false)
  const [appealStep, setAppealStep] = useState(null) // 'choose' | 'pick' | 'form' | null
  const [appealText, setAppealText] = useState('')
  const [snackOpen, setSnackOpen] = useState(false)
  const listRef = useRef(null)

  const v = VARIATIONS[MESSAGES[selected].type]
  const picking = appealStep === 'pick'

  const onScroll = (e) => {
    const el = e.currentTarget
    setAtBottom(el.scrollTop + el.clientHeight >= el.scrollHeight - 6)
  }
  const scrollDown = () => {
    const el = listRef.current
    if (el) el.scrollTo({ top: el.scrollTop + el.clientHeight * 0.85, behavior: 'smooth' })
  }
  const onMsgClick = (i) => {
    if (picking) { setAppealStep('form') }   // chose a block to appeal
    else setSelected(i)
  }
  const submitAppeal = () => { setAppealStep(null); setAppealText(''); setSnackOpen(true) }

  return (
    <div className="main page-calls">
      <div className="back-link" onClick={onBack}>
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M9 18l6-6-6-6"/>
        </svg>
        חזרה
      </div>

      {/* call header */}
      <div className="call-header">
        <div className="ch-thumb">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.91.34 1.85.57 2.81.7A2 2 0 0 1 22 16.92z"/>
          </svg>
        </div>
        <div className="ch-info">
          <div className="ch-title"></div>
          <div className="ch-meta">
            <span className="mi">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/></svg>
              <span className="mi-val"></span>
            </span>
            <span className="mi">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 3"/></svg>
              <span className="mi-val"></span>
            </span>
            <span className="mi">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="8" r="4"/><path d="M4 21c0-4 3.5-6 8-6s8 2 8 6"/></svg>
              <span className="mi-val"></span>
            </span>
          </div>
        </div>
        <div className="verdict-tag">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20 6L9 17l-5-5"/>
          </svg>
          פעלת נכון
        </div>
      </div>

      {/* two column review */}
      <div className="review-grid">

        {/* transcript */}
        <div className="card transcript-card">
          <div className="transcript-head">
            <div className="col-title">תמלול השיחה</div>
            <span className="link">פתיחת התמלול המלא</span>
          </div>

          {picking && (
            <div className="pick-hint">
              בחרו את הקטע שעליו תרצו לערער
              <span className="pick-cancel" onClick={() => setAppealStep(null)}>ביטול</span>
            </div>
          )}

          <div
            className={`msg-list${atBottom ? ' at-end' : ''}${picking ? ' picking' : ''}`}
            ref={listRef}
            onScroll={onScroll}
          >
            {MESSAGES.map((m, i) => (
              <div className="msg" key={i} onClick={() => onMsgClick(i)}>
                <div className="who">{m.who}</div>
                <div className={`bubble${m.flagged ? ' flagged' : ''}${i === selected && !picking ? ' selected' : ''}`}>
                  <div className="speaker-label">{m.who} {m.flagged && <FlagPin />}</div>
                  {m.lines.map((w, j) => (
                    <div className="ln" key={j} style={{ width: `${w}%` }}></div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {!atBottom && (
            <div className="scroll-down">
              <div className="sd-btn" aria-label="גלול להמשך השיחה" onClick={scrollDown}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M6 9l6 6 6-6"/>
                </svg>
              </div>
            </div>
          )}
        </div>

        {/* AI analysis */}
        <div className="card analysis-card">
          <div className="col-title">
            <span className="ai-mark">
              <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 3l1.8 4.7L18.5 9.5 13.8 11.3 12 16l-1.8-4.7L5.5 9.5l4.7-1.8z"/>
                <path d="M18 15l.7 1.8 1.8.7-1.8.7L18 20l-.7-1.8-1.8-.7 1.8-.7z"/>
                <path d="M6 2.5l.5 1.3L7.8 4.3 6.5 4.8 6 6l-.5-1.2L4.2 4.3l1.3-.5z"/>
              </svg>
            </span>
            ניתוח הבינה המלאכותית
          </div>

          <div className="analysis-scroll">
            <div className="confidence-box">
              <span className="c-ico">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                </svg>
              </span>
              <div className="c-text">
                <div className="c-label">
                  רמת הביטחון של המודל בניתוח זה
                  <span className="c-pct">{v.confidence}%</span>
                </div>
                <div className="c-bar"><div className="c-fill" style={{ width: `${v.confidence}%` }}></div></div>
              </div>
            </div>

            <div className="analysis-selected">
              <span className="as-label">ניתוח לקטע שנבחר</span>
              <span className={`tag ${v.tagClass}`}>{v.tag}</span>
            </div>

            <div className="analysis-group">
              <div className="ag-head">
                <span className="ag-ico">{v.icon}</span>
                {v.title}
              </div>
              <div className={`point${MESSAGES[selected].type === 'improve' ? ' improve' : ''}`}>
                <div className="point-desc">{v.desc}</div>
                <div className="ln" style={{ width: '90%' }}></div>
                <div className="ln" style={{ width: '58%' }}></div>
                <JumpLink />
              </div>
              <div className={`point${MESSAGES[selected].type === 'improve' ? ' improve' : ''}`}>
                <div className="ln" style={{ width: '94%' }}></div>
                <div className="ln" style={{ width: '72%' }}></div>
                <JumpLink />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* action bar — hidden once the call is marked as viewed */}
      {!viewed && (
        <div className="action-bar">
          <div className="action-note">
            חושב שהניתוח פספס משהו? אפשר לבקש מ‑SalesMind לבחון את השיחה שוב.
          </div>
          <div className="action-btns">
            <div className="btn subtle" onClick={() => setAppealStep('choose')}>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 12a9 9 0 1 1 3 6.7L3 16"/><path d="M3 21v-5h5"/>
              </svg>
              ערעור על הניתוח
            </div>
            <div className="btn primary" onClick={() => setViewed(true)}>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 6L9 17l-5-5"/>
              </svg>
              סימון כנצפה
            </div>
          </div>
        </div>
      )}

      {/* appeal step 1: scope */}
      <Dialog open={appealStep === 'choose'} onClose={() => setAppealStep(null)} PaperProps={{ className: 'sm-dialog' }}>
        <div className="dlg">
          <div className="dlg-head">
            <div className="dlg-title">על מה תרצו לערער?</div>
            <div className="dlg-close" onClick={() => setAppealStep(null)}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6L6 18M6 6l12 12"/></svg>
            </div>
          </div>
          <div className="dlg-sub">אפשר לערער על הניתוח של כל השיחה או על קטע מסוים בלבד.</div>
          <div className="appeal-options">
            <div className="appeal-opt" onClick={() => setAppealStep('form')}>
              <div className="ao-title">על כל השיחה</div>
              <div className="ao-sub">ערעור על הניתוח הכולל של השיחה</div>
            </div>
            <div className="appeal-opt" onClick={() => setAppealStep('pick')}>
              <div className="ao-title">על קטע מסוים</div>
              <div className="ao-sub">בחרו קטע ספציפי מהתמלול לערער עליו</div>
            </div>
          </div>
        </div>
      </Dialog>

      {/* appeal step 3: write what was wrong */}
      <Dialog open={appealStep === 'form'} onClose={() => setAppealStep(null)} PaperProps={{ className: 'sm-dialog' }}>
        <div className="dlg">
          <div className="dlg-head">
            <div className="dlg-title">ערעור על הניתוח</div>
            <div className="dlg-close" onClick={() => setAppealStep(null)}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6L6 18M6 6l12 12"/></svg>
            </div>
          </div>
          <div className="dlg-sub">ספרו לנו מה לדעתכם היה שגוי בניתוח, וניקח את זה בחשבון.</div>
          <textarea
            className="dlg-textarea"
            placeholder="כתבו כאן מה לדעתכם הניתוח פספס או טעה בו..."
            maxLength={300}
            value={appealText}
            onChange={(e) => setAppealText(e.target.value)}
          ></textarea>
          <div className="dlg-counter">{appealText.length}/300</div>
          <div className="dlg-actions">
            <div className="btn subtle" onClick={() => setAppealStep(null)}>ביטול</div>
            <div className="btn primary" onClick={submitAppeal}>שליחת ערעור</div>
          </div>
        </div>
      </Dialog>

      <Snackbar
        open={snackOpen}
        autoHideDuration={4000}
        onClose={() => setSnackOpen(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
      >
        <div className="snack">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6L9 17l-5-5"/></svg>
          תודה, נבדוק את הערעור ונטפל בו בהקדם.
        </div>
      </Snackbar>
    </div>
  )
}
