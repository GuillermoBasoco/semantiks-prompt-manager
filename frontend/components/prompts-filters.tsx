'use client'

import { useEffect, useState } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'

export function Filters() {
  const searchParams = useSearchParams()
  const router = useRouter()

  const [q, setQ] = useState(searchParams.get('q') || '')
  const [tag, setTag] = useState(searchParams.get('tag') || '')
  const [status, setStatus] = useState(searchParams.get('status') || '')

  useEffect(function syncFromUrl() {
    setQ(searchParams.get('q') || '')
    setTag(searchParams.get('tag') || '')
    setStatus(searchParams.get('status') || '')
  }, [searchParams])

  function applyFilters(ev: React.FormEvent) {
    ev.preventDefault()
    const params = new URLSearchParams()
    if (q) params.set('q', q)
    if (tag) params.set('tag', tag)
    if (status) params.set('status', status)
    const query = params.toString()
    router.push(query ? `/?${query}` : '/')
  }

  function resetFilters() {
    setQ('')
    setTag('')
    setStatus('')
    router.push('/')
  }

  return (
    <form onSubmit={applyFilters} className="grid grid-cols-1 gap-3 md:grid-cols-5">
      <div className="md:col-span-2">
        <label className="label">Keyword</label>
        <input className="input" value={q} onChange={function (e) { setQ(e.target.value) }} placeholder="Search title/content" />
      </div>
      <div className="md:col-span-2">
        <label className="label">Tag</label>
        <input className="input" value={tag} onChange={function (e) { setTag(e.target.value) }} placeholder="e.g. summary" />
      </div>
      <div>
        <label className="label">Status</label>
        <select className="input" value={status} onChange={function (e) { setStatus(e.target.value) }}>
          <option value="">All</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>
      </div>
      <div className="md:col-span-5 flex gap-2">
        <button type="submit" className="btn-primary px-4 py-2">Apply</button>
        <button type="button" className="btn-outline px-4 py-2" onClick={resetFilters}>Reset</button>
        <a href="/new" className="btn-outline px-4 py-2 ml-auto">New Prompt</a>
      </div>
    </form>
  )
}


