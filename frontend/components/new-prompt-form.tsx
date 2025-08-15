'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { apiBaseUrl } from '@/lib/api'

export default function NewPromptForm() {
  const router = useRouter()
  const [title, setTitle] = useState('')
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
          title,
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
      if (!res.ok) throw new Error('No se pudo crear')
      const created = await res.json()
      router.push(`/prompts/${created.id}`)
    } catch (e: any) {
      setError(e.message || 'No se pudo crear')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <form onSubmit={submit} className="space-y-4">
      <div>
        <label className="label">Título</label>
        <input className="input" value={title} onChange={function (e) { setTitle(e.target.value) }} placeholder="p. ej., Lady Gaga: mejores letras" required />
      </div>
      <div>
        <label className="label">Rol</label>
        <input className="input" value={role} onChange={function (e) { setRole(e.target.value) }} placeholder="Eres experto en..." required />
      </div>
      <div>
        <label className="label">Tarea</label>
        <input className="input" value={task} onChange={function (e) { setTask(e.target.value) }} placeholder="Describe la acción concreta" required />
      </div>
      <div>
        <label className="label">Contexto</label>
        <textarea className="textarea" value={context} onChange={function (e) { setContext(e.target.value) }} placeholder="Datos relevantes" required />
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
        <label className="label">Tags (separadas por coma)</label>
        <input className="input" value={tags} onChange={function (e) { setTags(e.target.value) }} placeholder="música, análisis" />
      </div>
      <div>
        <label className="label">Estado</label>
        <select className="input" value={status} onChange={function (e) { setStatus(e.target.value as 'active'|'inactive') }}>
          <option value="active">Activo</option>
          <option value="inactive">Inactivo</option>
        </select>
      </div>
      {error ? <div className="text-sm text-red-600">{error}</div> : null}
      <div className="flex gap-2">
        <button disabled={submitting} className="btn-primary px-4 py-2" type="submit">{submitting ? 'Creando…' : 'Crear'}</button>
        <a className="btn-outline px-4 py-2" href="/">Cancelar</a>
      </div>
    </form>
  )
}


