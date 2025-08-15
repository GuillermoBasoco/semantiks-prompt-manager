'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { apiBaseUrl } from '@/lib/api'

export default function NewPromptForm() {
  const router = useRouter()
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [tags, setTags] = useState('')
  const [isActive, setIsActive] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function submit(ev: React.FormEvent) {
    ev.preventDefault()
    setSubmitting(true)
    setError(null)
    try {
      const res = await fetch(`${apiBaseUrl}/prompts`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          content,
          tags: tags.split(',').map(function (t) { return t.trim() }).filter(function (t) { return t.length > 0 }),
          is_active: isActive
        })
      })
      if (!res.ok) throw new Error('Failed to create')
      const created = await res.json()
      router.push(`/prompts/${created.id}`)
    } catch (e: any) {
      setError(e.message || 'Failed to create')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <form onSubmit={submit} className="space-y-4">
      <div>
        <label className="label">Title</label>
        <input className="input" value={title} onChange={function (e) { setTitle(e.target.value) }} required />
      </div>
      <div>
        <label className="label">Content</label>
        <textarea className="textarea" value={content} onChange={function (e) { setContent(e.target.value) }} required />
      </div>
      <div>
        <label className="label">Tags (comma-separated)</label>
        <input className="input" value={tags} onChange={function (e) { setTags(e.target.value) }} placeholder="summary, meeting" />
      </div>
      <div className="flex items-center gap-2">
        <input id="active" type="checkbox" checked={isActive} onChange={function (e) { setIsActive(e.target.checked) }} />
        <label htmlFor="active">Active</label>
      </div>
      {error ? <div className="text-sm text-red-600">{error}</div> : null}
      <div className="flex gap-2">
        <button disabled={submitting} className="btn-primary px-4 py-2" type="submit">{submitting ? 'Creating…' : 'Create'}</button>
        <a className="btn-outline px-4 py-2" href="/">Cancel</a>
      </div>
    </form>
  )
}


