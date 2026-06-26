'use client'
import { useState, useRef, useEffect, useCallback } from 'react'

function newToken() {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) return crypto.randomUUID()
  return 'tok-' + Math.random().toString(36).slice(2) + Date.now().toString(36)
}

export default function AddressAutocomplete({ value, onChange, placeholder, className = 'wz-input' }) {
  const [suggestions, setSuggestions] = useState([])
  const [open, setOpen] = useState(false)
  const [active, setActive] = useState(-1)
  const tokenRef = useRef(newToken())
  const wrapRef = useRef(null)
  const timerRef = useRef(null)
  const skipNextFetch = useRef(false)

  // Close on outside click
  useEffect(() => {
    function onDoc(e) {
      if (wrapRef.current && !wrapRef.current.contains(e.target)) setOpen(false)
    }
    document.addEventListener('mousedown', onDoc)
    return () => document.removeEventListener('mousedown', onDoc)
  }, [])

  const fetchSuggestions = useCallback(async (input) => {
    try {
      const res = await fetch('/api/places', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'autocomplete', input, sessionToken: tokenRef.current }),
      })
      const data = await res.json()
      setSuggestions(data.suggestions || [])
      setOpen((data.suggestions || []).length > 0)
      setActive(-1)
    } catch {
      setSuggestions([])
      setOpen(false)
    }
  }, [])

  function handleChange(e) {
    const v = e.target.value
    onChange(v)
    if (skipNextFetch.current) { skipNextFetch.current = false; return }
    clearTimeout(timerRef.current)
    if (v.trim().length < 3) { setSuggestions([]); setOpen(false); return }
    timerRef.current = setTimeout(() => fetchSuggestions(v), 300)
  }

  async function selectSuggestion(s) {
    skipNextFetch.current = true
    setOpen(false)
    setSuggestions([])
    onChange(s.text) // show selection immediately
    try {
      const res = await fetch('/api/places', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'details', placeId: s.placeId, sessionToken: tokenRef.current }),
      })
      const data = await res.json()
      if (data.address) onChange(data.address)
    } catch { /* keep the suggestion text */ }
    tokenRef.current = newToken() // new billing session after a completed selection
  }

  function handleKey(e) {
    if (!open || suggestions.length === 0) return
    if (e.key === 'ArrowDown') { e.preventDefault(); setActive(i => Math.min(i + 1, suggestions.length - 1)) }
    else if (e.key === 'ArrowUp') { e.preventDefault(); setActive(i => Math.max(i - 1, 0)) }
    else if (e.key === 'Enter' && active >= 0) { e.preventDefault(); selectSuggestion(suggestions[active]) }
    else if (e.key === 'Escape') { setOpen(false) }
  }

  return (
    <div className="addr-wrap" ref={wrapRef}>
      <input
        className={className}
        placeholder={placeholder}
        value={value}
        onChange={handleChange}
        onKeyDown={handleKey}
        onFocus={() => { if (suggestions.length > 0) setOpen(true) }}
        autoComplete="off"
      />
      {open && (
        <ul className="addr-menu">
          {suggestions.map((s, i) => (
            <li
              key={s.placeId}
              className={'addr-item' + (i === active ? ' active' : '')}
              onMouseDown={(e) => { e.preventDefault(); selectSuggestion(s) }}
              onMouseEnter={() => setActive(i)}
            >
              <span className="addr-pin">📍</span>{s.text}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
