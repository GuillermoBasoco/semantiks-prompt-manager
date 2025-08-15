'use client'

import useSWR from 'swr'
import { useSearchParams } from 'next/navigation'
import { fetcher, apiBaseUrl } from '@/lib/api'
import Modal from '@/components/ui/modal'
import { useState } from 'react'

type Prompt = {
  id: number
  title: string
  role: string
  task: string
  context: string
  constraints: string[]
  output_format: string
  criteria: string
  status: 'active' | 'inactive'
  tags: string[]
  created_at: string
  updated_at: string
}

export function PromptsList() {
  const searchParams = useSearchParams()
  const qs = searchParams.toString()
  const { data, error, isLoading, mutate } = useSWR<Prompt[]>(`${apiBaseUrl}/prompts${qs ? `?${qs}` : ''}`, fetcher)
  const [confirmOpen, setConfirmOpen] = useState(false)
  const [pendingDeleteId, setPendingDeleteId] = useState<number | null>(null)

  async function toggle(id: number, currentStatus: 'active' | 'inactive') {
    await fetch(`${apiBaseUrl}/prompts/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: currentStatus === 'active' ? 'inactive' : 'active' })
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

  if (isLoading) return <div className="card p-4">Cargando…</div>
  if (error) return <div className="card p-4 text-red-600">Error al cargar</div>
  const prompts = data || []

  return (
    <div className="card overflow-hidden">
      <table className="w-full text-sm">
        <thead className="bg-gray-50 text-left">
          <tr>
            <th className="p-3">Título</th>
            <th className="p-3">Rol</th>
            <th className="p-3">Tarea</th>
            <th className="p-3">Etiquetas</th>
            <th className="p-3">Estado</th>
            <th className="p-3">Creado</th>
            <th className="p-3 text-right">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {prompts.map(function (p) {
            return (
              <tr key={p.id} className="border-t">
                <td className="p-3 max-w-[180px] truncate" title={p.title}>
                  <a className="underline" href={`/prompts/${p.id}`}>{p.title}</a>
                </td>
                <td className="p-3 max-w-[220px] truncate" title={p.task}>{p.task}</td>
                <td className="p-3 space-x-1">
                  {p.tags.map(function (t, i) { return <span key={i} className="badge">{t}</span> })}
                </td>
                <td className="p-3"><span className={`badge ${p.status === 'active' ? '' : 'bg-gray-200 text-gray-600'}`}>{p.status === 'active' ? 'Activo' : 'Inactivo'}</span></td>
                <td className="p-3">{new Date(p.created_at).toLocaleString()}</td>
                <td className="p-3 text-right space-x-2">
                  <a className="btn-outline px-3 py-1" href={`/prompts/${p.id}`}>Ver</a>
                  <button className="btn-primary px-3 py-1" onClick={function () { toggle(p.id, p.status) }}>{p.status === 'active' ? 'Desactivar' : 'Activar'}</button>
                  <button className="btn-outline px-3 py-1 text-red-600 border-red-300" onClick={function () { askDelete(p.id) }}>Eliminar</button>
                </td>
              </tr>
            )
          })}
          {prompts.length === 0 ? (
            <tr>
              <td className="p-4 text-center text-gray-500" colSpan={5}>No hay prompts.</td>
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


