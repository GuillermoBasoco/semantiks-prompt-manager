'use client'

import useSWR from 'swr'
import { apiBaseUrl, fetcher } from '@/lib/api'
import Modal from '@/components/ui/modal'
import { useState } from 'react'

type Props = { id: number }

type Prompt = {
  id: number
  title: string
  content: string
  tags: string[]
  is_active: boolean
  created_at: string
  updated_at: string
}

export default function PromptDetail(props: Props) {
  const { id } = props
  const { data, error, isLoading, mutate } = useSWR<Prompt>(`${apiBaseUrl}/prompts/${id}`, fetcher)
  const [confirmOpen, setConfirmOpen] = useState(false)

  async function toggle() {
    if (!data) return
    await fetch(`${apiBaseUrl}/prompts/${data.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ is_active: !data.is_active })
    })
    mutate()
  }

  async function remove() {
    if (!data) return
    await fetch(`${apiBaseUrl}/prompts/${data.id}`, { method: 'DELETE' })
    window.location.href = '/'
  }

  function askDelete() {
    setConfirmOpen(true)
  }

  function closeConfirm() {
    setConfirmOpen(false)
  }

  if (isLoading) return <div className="card p-4">Loading…</div>
  if (error || !data) return <div className="card p-4 text-red-600">Not found</div>

  return (
    <div className="space-y-4">
      <div className="card p-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="text-xl font-semibold">{data.title}</h2>
            <div className="mt-2 space-x-1">
              {data.tags.map(function (t, i) { return <span key={i} className="badge">{t}</span> })}
            </div>
          </div>
          <div className="space-x-2">
            <a className="btn-outline px-3 py-2" href="/">Back</a>
            <button className="btn-primary px-3 py-2" onClick={toggle}>{data.is_active ? 'Deactivate' : 'Activate'}</button>
            <button className="btn-outline px-3 py-2 text-red-600 border-red-300" onClick={askDelete}>Delete</button>
          </div>
        </div>
        <div className="mt-4 text-sm text-gray-600">
          <span className="badge mr-2">{data.is_active ? 'Active' : 'Inactive'}</span>
          <span>Created: {new Date(data.created_at).toLocaleString()}</span>
        </div>
        <pre className="mt-4 whitespace-pre-wrap rounded-md bg-gray-50 p-4 text-sm">{data.content}</pre>
      </div>
      <Modal
        open={confirmOpen}
        title="Confirmar eliminación"
        description="Esta acción eliminará el prompt de forma permanente."
        confirmLabel="Eliminar"
        cancelLabel="Cancelar"
        onConfirm={remove}
        onClose={closeConfirm}
      />
    </div>
  )
}


