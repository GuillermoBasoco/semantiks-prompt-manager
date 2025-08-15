'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { apiBaseUrl } from '@/lib/api'

export default function NewPromptForm() {
  const router = useRouter()
  const [role, setRole] = useState('')
  const [task, setTask] = useState('')
  const [context, setContext] = useState('')
  const [constraints, setConstraints] = useState('')
  const [outputFormat, setOutputFormat] = useState('')
  const [criteria, setCriteria] = useState('')
  const [status, setStatus] = useState<'active'|'inactive'>('active')
  const [tags, setTags] = useState('')
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
          role,
          task,
          context,
          constraints: constraints.split('\n').map(function (t) { return t.trim() }).filter(function (t) { return t.length > 0 }),
          output_format: outputFormat,
          criteria,
          status,
          tags: tags.split(',').map(function (t) { return t.trim() }).filter(function (t) { return t.length > 0 })
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
        <label className="label">Rol</label>
        <input className="input" value={role} onChange={function (e) { setRole(e.target.value) }} required />
      </div>
      <div>
        <label className="label">Tarea</label>
        <input className="input" value={task} onChange={function (e) { setTask(e.target.value) }} required />
      </div>
      <div>
        <label className="label">Contexto</label>
        <textarea className="textarea" value={context} onChange={function (e) { setContext(e.target.value) }} required />
      </div>
      <div>
        <label className="label">Restricciones (una por línea)</label>
        <textarea className="textarea" value={constraints} onChange={function (e) { setConstraints(e.target.value) }} placeholder={'- Máximo 200 palabras\n- Evitar jerga técnica'} />
      </div>
      <div>
        <label className="label">Formato de salida</label>
        <textarea className="textarea" value={outputFormat} onChange={function (e) { setOutputFormat(e.target.value) }} placeholder={'JSON con campos: titulo, resumen, palabras_clave'} required />
      </div>
      <div>
        <label className="label">Criterios</label>
        <textarea className="textarea" value={criteria} onChange={function (e) { setCriteria(e.target.value) }} placeholder={'Verificar fuentes, claridad y neutralidad'} required />
      </div>
      <div>
        <label className="label">Tags (comma-separated)</label>
        <input className="input" value={tags} onChange={function (e) { setTags(e.target.value) }} placeholder="summary, meeting" />
      </div>
      <div>
        <label className="label">Status</label>
        <select className="input" value={status} onChange={function (e) { setStatus(e.target.value as 'active'|'inactive') }}>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>
      </div>
      {error ? <div className="text-sm text-red-600">{error}</div> : null}
      <div className="flex gap-2">
        <button disabled={submitting} className="btn-primary px-4 py-2" type="submit">{submitting ? 'Creating…' : 'Create'}</button>
        <a className="btn-outline px-4 py-2" href="/">Cancel</a>
      </div>
    </form>
  )
}


