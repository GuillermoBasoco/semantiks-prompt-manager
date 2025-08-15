'use client'

import useSWR from 'swr'
import { useSearchParams } from 'next/navigation'
import { fetcher, apiBaseUrl } from '@/lib/api'
import Modal from '@/components/ui/modal'
import { useState } from 'react'

type Prompt = {
  id: number
  title: string
  content: string
  tags: string[]
  is_active: boolean
  created_at: string
  updated_at: string
}

export function PromptsList() {
  const searchParams = useSearchParams()
  const qs = searchParams.toString()
  const { data, error, isLoading, mutate } = useSWR<Prompt[]>(`${apiBaseUrl}/prompts${qs ? `?${qs}` : ''}`, fetcher)
  const [confirmOpen, setConfirmOpen] = useState(false)
  const [pendingDeleteId, setPendingDeleteId] = useState<number | null>(null)

  async function toggle(id: number, isActive: boolean) {
    await fetch(`${apiBaseUrl}/prompts/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ is_active: !isActive })
    })
    mutate()
  }

  async function remove(id: number) {
    await fetch(`${apiBaseUrl}/prompts/${id}`, { method: 'DELETE' })
    mutate()
  }

  function askDelete(id: number) {
    setPendingDeleteId(id)
    setConfirmOpen(true)
  }

  function closeConfirm() {
    setConfirmOpen(false)
    setPendingDeleteId(null)
  }

  async function confirmDelete() {
    if (pendingDeleteId != null) {
      await remove(pendingDeleteId)
    }
    closeConfirm()
  }

  if (isLoading) return <div className="card p-4">Loading…</div>
  if (error) return <div className="card p-4 text-red-600">Failed to load</div>
  const prompts = data || []

  return (
    <div className="card overflow-hidden">
      <table className="w-full text-sm">
        <thead className="bg-gray-50 text-left">
          <tr>
            <th className="p-3">Title</th>
            <th className="p-3">Tags</th>
            <th className="p-3">Status</th>
            <th className="p-3">Created</th>
            <th className="p-3 text-right">Actions</th>
          </tr>
        </thead>
        <tbody>
          {prompts.map(function (p) {
            return (
              <tr key={p.id} className="border-t">
                <td className="p-3">
                  <a className="underline" href={`/prompts/${p.id}`}>{p.title}</a>
                </td>
                <td className="p-3 space-x-1">
                  {p.tags.map(function (t, i) { return <span key={i} className="badge">{t}</span> })}
                </td>
                <td className="p-3">
                  <span className={`badge ${p.is_active ? '' : 'bg-gray-200 text-gray-600'}`}>{p.is_active ? 'Active' : 'Inactive'}</span>
                </td>
                <td className="p-3">{new Date(p.created_at).toLocaleString()}</td>
                <td className="p-3 text-right space-x-2">
                  <a className="btn-outline px-3 py-1" href={`/prompts/${p.id}`}>View</a>
                  <button className="btn-primary px-3 py-1" onClick={function () { toggle(p.id, p.is_active) }}>{p.is_active ? 'Deactivate' : 'Activate'}</button>
                  <button className="btn-outline px-3 py-1 text-red-600 border-red-300" onClick={function () { askDelete(p.id) }}>Delete</button>
                </td>
              </tr>
            )
          })}
          {prompts.length === 0 ? (
            <tr>
              <td className="p-4 text-center text-gray-500" colSpan={5}>No prompts found.</td>
            </tr>
          ) : null}
        </tbody>
      </table>
      <Modal
        open={confirmOpen}
        title="Confirmar eliminación"
        description="Esta acción eliminará el prompt de forma permanente."
        confirmLabel="Eliminar"
        cancelLabel="Cancelar"
        onConfirm={confirmDelete}
        onClose={closeConfirm}
      />
    </div>
  )
}


