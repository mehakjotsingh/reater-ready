'use client'
import { useState, useRef } from 'react'
import Link from 'next/link'

const S = {
  shell: { minHeight: '100vh', background: 'var(--bg)' },
  bar: {
    position: 'sticky', top: 0, zIndex: 40, height: 64, background: 'rgba(247,250,248,0.85)',
    backdropFilter: 'blur(12px)', borderBottom: '1px solid var(--line)',
    display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 24px',
  },
  brand: { display: 'flex', alignItems: 'center', gap: 9, fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 19, letterSpacing: '-0.03em' },
  mark: { width: 30, height: 30, borderRadius: 9, background: 'var(--brand)', display: 'grid', placeItems: 'center', color: 'var(--mint)', fontSize: 15 },
  tabs: { display: 'flex', gap: 4, background: 'var(--paper)', border: '1px solid var(--line)', borderRadius: 999, padding: 4, maxWidth: 720, margin: '28px auto 0' },
  tab: (a) => ({
    flex: 1, padding: '10px 14px', borderRadius: 999, border: 'none', cursor: 'pointer',
    fontFamily: 'var(--font-body)', fontWeight: 600, fontSize: 14.5,
    background: a ? 'var(--brand)' : 'transparent', color: a ? '#fff' : 'var(--ink-soft)',
    transition: 'all 0.15s',
  }),
  wrap: { maxWidth: 720, margin: '0 auto', padding: '28px 24px 80px' },
  card: { background: 'var(--paper)', border: '1px solid var(--line)', borderRadius: 'var(--radius-lg)', padding: 28, marginBottom: 18, boxShadow: 'var(--shadow)' },
  h2: { fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 22, letterSpacing: '-0.02em', marginBottom: 6 },
  sub: { fontSize: 14.5, color: 'var(--ink-soft)', marginBottom: 20, lineHeight: 1.55 },
  label: { fontSize: 12, fontWeight: 700, letterSpacing: '0.05em', textTransform: 'uppercase', color: 'var(--ink-soft)', marginBottom: 9, display: 'block' },
  ta: {
    width: '100%', minHeight: 150, resize: 'vertical', border: '1px solid var(--line-strong)',
    borderRadius: 12, padding: '13px 15px', fontSize: 14.5, fontFamily: 'var(--font-body)',
    background: '#fbfdfc', color: 'var(--ink)', outline: 'none', lineHeight: 1.6,
  },
  input: {
    width: '100%', border: '1px solid var(--line-strong)', borderRadius: 12, padding: '11px 14px',
    fontSize: 14.5, fontFamily: 'var(--font-body)', background: '#fbfdfc', color: 'var(--ink)', outline: 'none',
  },
  btn: (dis) => ({
    background: 'var(--brand)', color: '#fff', border: 'none', borderRadius: 999,
    padding: '12px 22px', fontSize: 14.5, fontWeight: 600, cursor: dis ? 'not-allowed' : 'pointer',
    fontFamily: 'var(--font-body)', opacity: dis ? 0.55 : 1, display: 'inline-flex', alignItems: 'center', gap: 8,
  }),
  btnGhost: { background: 'transparent', color: 'var(--brand)', border: '1.5px solid var(--line-strong)', borderRadius: 999, padding: '11px 20px', fontSize: 14, fontWeight: 600, cursor: 'pointer', fontFamily: 'var(--font-body)' },
  result: { background: '#fbfdfc', border: '1px solid var(--line)', borderRadius: 14, padding: 20, marginTop: 18, fontSize: 14.5, color: 'var(--ink)', lineHeight: 1.7, whiteSpace: 'pre-wrap' },
  spin: { width: 14, height: 14, border: '2px solid rgba(255,255,255,0.35)', borderTopColor: '#fff', borderRadius: '50%', display: 'inline-block', animation: 'll-spin 0.7s linear infinite' },
}

async function callAPI(system, user, images) {
  const res = await fetch('/api/claude', {
    method: 'POST', headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ system, user, images }),
  })
  const data = await res.json()
  if (!res.ok) throw new Error(data.error || 'API error')
  return data.text
}

function downscale(file, max = 1100) {
  return new Promise((resolve) => {
    const reader = new FileReader()
    reader.onload = (e) => {
      const img = new Image()
      img.onload = () => {
        const scale = Math.min(1, max / Math.max(img.width, img.height))
        const c = document.createElement('canvas')
        c.width = Math.round(img.width * scale)
        c.height = Math.round(img.height * scale)
        c.getContext('2d').drawImage(img, 0, 0, c.width, c.height)
        resolve(c.toDataURL('image/jpeg', 0.82))
      }
      img.src = e.target.result
    }
    reader.readAsDataURL(file)
  })
}

function LeaseReview() {
  const [text, setText] = useState('')
  const [result, setResult] = useState('')
  const [loading, setLoading] = useState(false)
  async function run() {
    if (!text.trim()) return
    setLoading(true); setResult('Reviewing your lease...')
    try {
      setResult(await callAPI(
        'You are a renter protection assistant. Analyze lease text and respond in plain English with clear sections: SUMMARY (2 to 3 sentences), KEY DATES AND FEES, RISK FLAGS (clauses that could cost the renter money), and QUESTIONS TO ASK before signing. Be concise and practical. Plain text, no markdown symbols.',
        'Analyze this lease:\n\n' + text))
    } catch { setResult('Something went wrong. Please try again.') }
    setLoading(false)
  }
  return (
    <div style={S.card}>
      <h2 style={S.h2}>AI lease risk review</h2>
      <p style={S.sub}>Paste your lease below. We flag the risky clauses, summarize the key terms, and tell you what to ask before you sign.</p>
      <span style={S.label}>Lease text</span>
      <textarea style={S.ta} placeholder="Paste your full lease here..." value={text} onChange={e => setText(e.target.value)} />
      <div style={{ marginTop: 14 }}>
        <button style={S.btn(loading)} onClick={run} disabled={loading}>{loading ? <><i style={S.spin} /> Analyzing</> : 'Analyze lease'}</button>
      </div>
      {result && <div style={S.result}>{result}</div>}
    </div>
  )
}

const ROOMS = [
  { name: 'Living room', icon: '🛋️' }, { name: 'Kitchen', icon: '🍳' }, { name: 'Bedroom', icon: '🛏️' },
  { name: 'Bathroom', icon: '🚿' }, { name: 'Entryway', icon: '🚪' }, { name: 'Other', icon: '📦' },
]

function MoveIn() {
  const [room, setRoom] = useState('Living room')
  const [cond, setCond] = useState('')
  const [notes, setNotes] = useState('')
  const [photos, setPhotos] = useState([])
  const [entries, setEntries] = useState([])
  const [report, setReport] = useState('')
  const [loading, setLoading] = useState(false)
  const fileRef = useRef()

  async function onFiles(e) {
    const files = Array.from(e.target.files || []).slice(0, 6)
    const compressed = await Promise.all(files.map(f => downscale(f)))
    setPhotos(p => [...p, ...compressed].slice(0, 6))
  }
  function add() {
    if (!cond) { alert('Pick a condition first.'); return }
    setEntries(en => [...en, { room, cond, notes: notes || 'No notes added.', photos }])
    setNotes(''); setCond(''); setPhotos([])
    if (fileRef.current) fileRef.current.value = ''
  }
  async function generate() {
    setLoading(true); setReport('Looking at your photos and writing the report...')
    const allImages = entries.flatMap(e => e.photos)
    const log = entries.map(e => `${e.room}: ${e.cond} condition. Renter notes: ${e.notes}. Photos attached: ${e.photos.length}.`).join('\n')
    try {
      setReport(await callAPI(
        'You are a renter protection assistant reviewing move-in documentation. Look carefully at the attached photos and describe any visible existing damage, wear, stains, or issues. Then write a professional, factual move-in condition report the renter can send to their landlord. Organize it by room. Keep it under 280 words. Plain text, no markdown symbols.',
        'Here is the renter condition log. Review the attached photos and produce the report:\n\n' + log,
        allImages))
    } catch { setReport('Something went wrong. Please try again.') }
    setLoading(false)
  }

  const condBtn = (v, color) => ({
    flex: 1, padding: '10px', borderRadius: 11, fontSize: 13.5, cursor: 'pointer', fontFamily: 'var(--font-body)', fontWeight: 600,
    border: cond === v ? `1.5px solid ${color}` : '1px solid var(--line-strong)',
    background: cond === v ? `${color}14` : '#fbfdfc', color: cond === v ? color : 'var(--ink-soft)',
  })

  return (
    <>
      <div style={S.card}>
        <h2 style={S.h2}>Move-in photo report</h2>
        <p style={S.sub}>Go room by room, add photos, and our AI describes the existing damage it sees. This is the proof that protects your deposit.</p>

        <span style={S.label}>Room</span>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(98px, 1fr))', gap: 8, marginBottom: 20 }}>
          {ROOMS.map(r => (
            <div key={r.name} onClick={() => setRoom(r.name)} style={{
              border: room === r.name ? '1.5px solid var(--brand)' : '1px solid var(--line-strong)',
              background: room === r.name ? 'var(--mint-soft)' : '#fbfdfc', borderRadius: 12, padding: '12px 6px',
              textAlign: 'center', cursor: 'pointer',
            }}>
              <div style={{ fontSize: 22 }}>{r.icon}</div>
              <div style={{ fontSize: 12.5, marginTop: 3, fontWeight: room === r.name ? 600 : 500, color: room === r.name ? 'var(--brand)' : 'var(--ink-soft)' }}>{r.name}</div>
            </div>
          ))}
        </div>

        <span style={S.label}>Condition</span>
        <div style={{ display: 'flex', gap: 8, marginBottom: 20 }}>
          <button style={condBtn('good', '#0e8a5f')} onClick={() => setCond('good')}>Good</button>
          <button style={condBtn('fair', '#c07c0c')} onClick={() => setCond('fair')}>Fair</button>
          <button style={condBtn('poor', '#c0392b')} onClick={() => setCond('poor')}>Poor</button>
        </div>

        <span style={S.label}>Photos</span>
        <div onClick={() => fileRef.current?.click()} style={{
          border: '1.5px dashed var(--line-strong)', borderRadius: 14, padding: 22, textAlign: 'center',
          cursor: 'pointer', background: '#fbfdfc', marginBottom: photos.length ? 12 : 20,
        }}>
          <div style={{ fontSize: 26 }}>📸</div>
          <div style={{ fontSize: 14, fontWeight: 600, marginTop: 4 }}>Tap to add photos</div>
          <div style={{ fontSize: 12.5, color: 'var(--ink-soft)', marginTop: 2 }}>Up to 6 per room · AI reads each one</div>
        </div>
        <input ref={fileRef} type="file" accept="image/*" multiple onChange={onFiles} style={{ display: 'none' }} />
        {photos.length > 0 && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(72px, 1fr))', gap: 8, marginBottom: 20 }}>
            {photos.map((p, i) => (
              <div key={i} style={{ position: 'relative' }}>
                <img src={p} alt="" style={{ width: '100%', height: 72, objectFit: 'cover', borderRadius: 10, border: '1px solid var(--line)' }} />
                <button onClick={() => setPhotos(ph => ph.filter((_, j) => j !== i))} style={{
                  position: 'absolute', top: -6, right: -6, width: 22, height: 22, borderRadius: '50%',
                  background: 'var(--ink)', color: '#fff', border: 'none', cursor: 'pointer', fontSize: 13, lineHeight: 1,
                }}>×</button>
              </div>
            ))}
          </div>
        )}

        <span style={S.label}>Notes (optional)</span>
        <textarea style={{ ...S.ta, minHeight: 70, marginBottom: 14 }} placeholder="Scuff on the wall, stain on the carpet, cracked tile..." value={notes} onChange={e => setNotes(e.target.value)} />
        <button style={S.btn(false)} onClick={add}>Add {room} to report</button>
      </div>

      {entries.length > 0 && (
        <div style={S.card}>
          <h2 style={S.h2}>Condition log</h2>
          <p style={S.sub}>{entries.length} room{entries.length > 1 ? 's' : ''} documented · {entries.reduce((n, e) => n + e.photos.length, 0)} photos</p>
          {entries.map((e, i) => (
            <div key={i} style={{ border: '1px solid var(--line)', borderRadius: 12, padding: 14, marginBottom: 10 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: e.photos.length ? 10 : 0 }}>
                <b style={{ flex: 1, fontWeight: 600 }}>{e.room}</b>
                <span style={{
                  fontSize: 11.5, fontWeight: 700, padding: '3px 10px', borderRadius: 999,
                  background: e.cond === 'good' ? '#dff5ec' : e.cond === 'fair' ? '#fdf0d8' : '#fbe4e1',
                  color: e.cond === 'good' ? '#0e8a5f' : e.cond === 'fair' ? '#a9700c' : '#c0392b',
                }}>{e.cond}</span>
              </div>
              {e.photos.length > 0 && (
                <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                  {e.photos.map((p, j) => <img key={j} src={p} alt="" style={{ width: 54, height: 54, objectFit: 'cover', borderRadius: 8, border: '1px solid var(--line)' }} />)}
                </div>
              )}
            </div>
          ))}
          <div style={{ marginTop: 14 }}>
            <button style={S.btn(loading)} onClick={generate} disabled={loading}>{loading ? <><i style={S.spin} /> Reading photos</> : 'Generate AI condition report'}</button>
          </div>
          {report && <div style={S.result}>{report}</div>}
        </div>
      )}
    </>
  )
}

const TYPES = ['Report existing damage', 'Request a repair', 'Ask about lease terms', 'Request deposit return', 'Dispute a charge', 'Follow up on maintenance']

function Message() {
  const [type, setType] = useState(TYPES[0])
  const [ctx, setCtx] = useState('')
  const [name, setName] = useState('')
  const [result, setResult] = useState('')
  const [loading, setLoading] = useState(false)
  const [copied, setCopied] = useState(false)
  async function run() {
    if (!ctx.trim()) { alert('Describe your situation first.'); return }
    setLoading(true); setResult('Drafting your message...')
    try {
      setResult(await callAPI(
        'You are a renter communication assistant. Write a professional, polite, clear message that protects the renter and creates a written record. Under 150 words. Include a subject line at the top. Plain text, no markdown symbols.',
        `Write a message to ${name || 'my landlord'} to ${type.toLowerCase()}.\n\nContext: ${ctx}`))
    } catch { setResult('Something went wrong. Please try again.') }
    setLoading(false)
  }
  function copy() { navigator.clipboard.writeText(result).catch(() => {}); setCopied(true); setTimeout(() => setCopied(false), 1800) }
  return (
    <>
      <div style={S.card}>
        <h2 style={S.h2}>Landlord message generator</h2>
        <p style={S.sub}>Pick the situation, describe what happened, and get a message that is firm, professional, and ready to send.</p>
        <span style={S.label}>Message type</span>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 20 }}>
          {TYPES.map(t => (
            <button key={t} onClick={() => setType(t)} style={{
              padding: '8px 14px', borderRadius: 999, fontSize: 13, cursor: 'pointer', fontFamily: 'var(--font-body)', fontWeight: 500,
              border: type === t ? '1.5px solid var(--brand)' : '1px solid var(--line-strong)',
              background: type === t ? 'var(--mint-soft)' : '#fbfdfc', color: type === t ? 'var(--brand)' : 'var(--ink-soft)',
            }}>{t}</button>
          ))}
        </div>
        <span style={S.label}>What happened</span>
        <textarea style={{ ...S.ta, minHeight: 110, marginBottom: 16 }} placeholder="Describe the situation in your own words..." value={ctx} onChange={e => setCtx(e.target.value)} />
        <span style={S.label}>Landlord name (optional)</span>
        <input style={{ ...S.input, marginBottom: 16 }} placeholder="e.g. Mr. Johnson" value={name} onChange={e => setName(e.target.value)} />
        <button style={S.btn(loading)} onClick={run} disabled={loading}>{loading ? <><i style={S.spin} /> Drafting</> : 'Draft my message'}</button>
      </div>
      {result && (
        <div style={S.card}>
          <h2 style={S.h2}>Your message</h2>
          <div style={S.result}>{result}</div>
          <div style={{ marginTop: 14 }}>
            <button style={S.btnGhost} onClick={copy}>{copied ? '✓ Copied' : 'Copy message'}</button>
          </div>
        </div>
      )}
    </>
  )
}

export default function App() {
  const [tab, setTab] = useState('lease')
  return (
    <div style={S.shell}>
      <style>{`@keyframes ll-spin { to { transform: rotate(360deg); } }`}</style>
      <div style={S.bar}>
        <Link href="/" style={S.brand}><span style={S.mark}>🔒</span> LeaseLock</Link>
        <Link href="/" style={{ fontSize: 14, color: 'var(--ink-soft)', fontWeight: 500 }}>← Home</Link>
      </div>
      <div style={{ padding: '0 24px' }}>
        <div style={S.tabs}>
          <button style={S.tab(tab === 'lease')} onClick={() => setTab('lease')}>Lease review</button>
          <button style={S.tab(tab === 'movein')} onClick={() => setTab('movein')}>Move-in report</button>
          <button style={S.tab(tab === 'message')} onClick={() => setTab('message')}>Landlord message</button>
        </div>
      </div>
      <div style={S.wrap}>
        {tab === 'lease' && <LeaseReview />}
        {tab === 'movein' && <MoveIn />}
        {tab === 'message' && <Message />}
      </div>
    </div>
  )
}
