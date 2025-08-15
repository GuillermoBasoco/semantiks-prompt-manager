'use client'

import useSWR from 'swr'
import { apiBaseUrl, fetcher } from '@/lib/api'
import Modal from '@/components/ui/modal'
import { useState } from 'react'

type Props = { id: number }

type Prompt = {
  title: string
  id: number
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

export default function PromptDetail(props: Props) {
  const { id } = props
  const { data, error, isLoading, mutate } = useSWR<Prompt>(`${apiBaseUrl}/prompts/${id}`, fetcher)
  const [confirmOpen, setConfirmOpen] = useState(false)

  async function toggle() {
    if (!data) return
    await fetch(`${apiBaseUrl}/prompts/${data.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: data.status === 'active' ? 'inactive' : 'active' })
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

  if (isLoading) return <div className="card p-4">Cargando…</div>
  if (error || !data) return <div className="card p-4 text-red-600">No encontrado</div>

  return (
    <div className="space-y-4">
      <div className="card p-6">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <h2 className="text-xl font-semibold truncate" title={data.title}>{data.title}</h2>
            <div className="mt-2 flex flex-wrap items-center gap-2 text-sm text-gray-600">
              <span className={`${data.status === 'active' ? 'bg-green-100 text-green-700 border-green-300' : 'bg-red-100 text-red-700 border-red-300'} inline-flex items-center rounded-full border px-2 py-0.5 text-xs`}>
                {data.status === 'active' ? 'Activo' : 'Inactivo'}
              </span>
              <span>Creado: {new Date(data.created_at).toLocaleString()}</span>
            </div>
            <div className="mt-2 space-x-1">
              {data.tags.map(function (t, i) { return <span key={i} className="badge">{t}</span> })}
            </div>
          </div>
          <div className="space-x-2 shrink-0">
            <a className="btn-outline px-3 py-2" href="/">Volver</a>
            <button className="btn-primary px-3 py-2" onClick={toggle}>{data.status === 'active' ? 'Desactivar' : 'Activar'}</button>
            <button className="btn-outline px-3 py-2 text-red-600 border-red-300" onClick={askDelete}>Eliminar</button>
          </div>
        </div>

        <div className="mt-6 grid gap-4 md:grid-cols-2">
          <div>
            <h3 className="text-sm font-medium text-gray-700">Rol</h3>
            <p className="mt-1 text-sm text-gray-800 whitespace-pre-wrap">{data.role}</p>
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-700">Tarea</h3>
            <p className="mt-1 text-sm text-gray-800 whitespace-pre-wrap">{data.task}</p>
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-700">Contexto</h3>
            <pre className="mt-1 whitespace-pre-wrap rounded-md bg-gray-50 p-3 text-sm">{data.context}</pre>
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-700">Formato de salida</h3>
            <pre className="mt-1 whitespace-pre-wrap rounded-md bg-gray-50 p-3 text-sm">{data.output_format}</pre>
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-700">Restricciones</h3>
            <ul className="mt-1 list-disc pl-5 text-sm text-gray-800">
              {(data.constraints || []).map(function (c, i) { return <li key={i}>{c}</li> })}
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-700">Criterios</h3>
            <pre className="mt-1 whitespace-pre-wrap rounded-md bg-gray-50 p-3 text-sm">{data.criteria}</pre>
          </div>
        </div>
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


