'use client'

import { useState } from 'react'

export const runtime = 'edge'
export const dynamic = 'force-dynamic'

export default function EmbedAsk() {
  const [q, setQ] = useState('')
  const [answer, setAnswer] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function submit(ev: React.FormEvent) {
    ev.preventDefault()
    setError(null)
    setAnswer('')
    const text = q.trim()
    if (!text) {
      setError('Please enter a question')
      return
    }
    setLoading(true)
    try {
      const res = await fetch('/api/ask', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question: text })
      })
      if (!res.ok) {
        setError('Request failed')
        return
      }
      const data = await res.json()
      setAnswer((data?.answer || '') + (data?.usedPromptTitle ? '\n\n— Used prompt: ' + data.usedPromptTitle : ''))
      setQ('')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="p-3 text-sm" style={{ width: 320 }}>
      <form onSubmit={submit} className="space-y-2">
        <input
          className="input"
          placeholder="Type your question"
          value={q}
          onChange={function (e) { setQ(e.target.value) }}
          disabled={loading}
        />
        {error ? <div className="text-xs text-red-600">{error}</div> : null}
        <div>
          <button type="submit" className="btn-primary px-3 py-2" disabled={loading}>{loading ? 'Asking…' : 'Ask'}</button>
        </div>
      </form>
      {answer ? (
        <div className="mt-2 rounded-md border border-gray-200 bg-white p-3 text-sm text-gray-800 whitespace-pre-wrap">
          {answer}
        </div>
      ) : null}
    </div>
  )
}


