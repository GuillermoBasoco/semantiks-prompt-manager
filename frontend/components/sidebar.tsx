'use client'

import useSWR from 'swr'
import { useMemo, useState } from 'react'
import { apiBaseUrl, fetcher } from '@/lib/api'

type Prompt = {
  id: number
  title: string
  status: 'active' | 'inactive'
}

export default function Sidebar() {
  const { data, error, isLoading, mutate } = useSWR<Prompt[]>(`${apiBaseUrl}/prompts`, fetcher)
  const [isSaving, setIsSaving] = useState(false)
  const [question, setQuestion] = useState('')
  const [isAsking, setIsAsking] = useState(false)
  const [responseText, setResponseText] = useState<string | null>(null)
  const [askError, setAskError] = useState<string | null>(null)

  const prompts = data || []

  const selectedId = useMemo(function () {
    const active = prompts.find(function (p) { return p.status === 'active' })
    return active ? String(active.id) : ''
  }, [prompts])

  async function setExclusiveActive(nextId: number) {
    if (!prompts || prompts.length === 0) return
    setIsSaving(true)
    try {
      const toDeactivate = prompts.filter(function (p) { return p.id !== nextId && p.status === 'active' })
      const toActivate = prompts.find(function (p) { return p.id === nextId && p.status !== 'active' })

      // Deactivate any currently active prompts that are not the chosen one
      await Promise.all(toDeactivate.map(function (p) {
        return fetch(`${apiBaseUrl}/prompts/${p.id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ status: 'inactive' })
        })
      }))

      // Activate the chosen prompt if needed
      if (toActivate) {
        await fetch(`${apiBaseUrl}/prompts/${nextId}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ status: 'active' })
        })
      }

      await mutate()
    } finally {
      setIsSaving(false)
    }
  }

  function onChange(ev: React.ChangeEvent<HTMLSelectElement>) {
    if (!ev.target.value) return
    const value = Number(ev.target.value)
    if (!Number.isNaN(value)) {
      setExclusiveActive(value)
    }
  }

  async function askAgent(ev: React.FormEvent) {
    ev.preventDefault()
    setAskError(null)
    setResponseText(null)

    if (!question.trim()) {
      setAskError('Please enter a question')
      return
    }

    const active = prompts.find(function (p) { return p.status === 'active' })
    if (!active) {
      setAskError('Select an active prompt first')
      return
    }

    setIsAsking(true)
    try {
      const res = await fetch('/api/ask', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ promptId: active.id, question })
      })
      if (!res.ok) {
        const detail = await res.text()
        setAskError('Failed to get response' + (detail ? ': ' + detail : ''))
        return
      }
      const { answer, usedPromptId, usedPromptTitle } = await res.json()
      setResponseText((answer || '') + '\n\n— Used prompt: ' + (usedPromptTitle || usedPromptId))
      setQuestion('')
    } finally {
      setIsAsking(false)
    }
  }

  return (
    <aside className="card p-4 md:sticky md:top-6 h-max">
      <div className="space-y-3">
        <div>
          <h2 className="text-sm font-medium text-gray-700">Active prompt</h2>
          <p className="text-xs text-gray-500">Only one prompt can be active at a time.</p>
        </div>

        {isLoading ? (
          <div className="text-sm text-gray-600">Loading…</div>
        ) : error ? (
          <div className="text-sm text-red-600">Failed to load prompts</div>
        ) : prompts.length === 0 ? (
          <div className="text-sm text-gray-600">No prompts yet. <a className="underline" href="/new">Create one</a>.</div>
        ) : (
          <div>
            <label className="label">Select prompt</label>
            <select
              className="input"
              value={selectedId}
              onChange={onChange}
              disabled={isSaving}
            >
              <option value="">— Select —</option>
              {prompts.map(function (p) {
                return (
                  <option key={p.id} value={p.id}>{p.title}</option>
                )
              })}
            </select>
            <form onSubmit={askAgent} className="mt-4 space-y-2">
              <label className="label">Ask the agent</label>
              <input
                type="text"
                className="input"
                placeholder="Type your question"
                value={question}
                onChange={function (e) { setQuestion(e.target.value) }}
                disabled={isSaving || isAsking}
              />
              {askError ? <div className="text-xs text-red-600">{askError}</div> : null}
              <div className="flex gap-2">
                <button type="submit" className="btn-primary px-3 py-2" disabled={isSaving || isAsking}>{isAsking ? 'Asking…' : 'Ask'}</button>
              </div>
              {responseText ? (
                <div className="mt-2 rounded-md border border-gray-200 bg-gray-50 p-3 text-sm text-gray-800 whitespace-pre-wrap">
                  {responseText}
                </div>
              ) : null}
            </form>
          </div>
        )}
      </div>
    </aside>
  )
}


