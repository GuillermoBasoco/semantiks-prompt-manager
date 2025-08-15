'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import { apiBaseUrl } from '@/lib/api'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'

const SUGGESTIONS = [
	'Telenovelas mexicanas más dramáticas',
	'Snippets de React',
	'Los 10 momentos más nefastos de Trumpetas'
]

export default function CreatePromptCollapsible() {
	const [title, setTitle] = useState('')
	const [role, setRole] = useState('')
	const [content, setContent] = useState('')
	const [task, setTask] = useState('')
	const [constraints, setConstraints] = useState('')
	const [outputFormat, setOutputFormat] = useState('')
	const [criteria, setCriteria] = useState('')
	const [tags, setTags] = useState('')
	const [isActive, setIsActive] = useState(true)
	const [submitting, setSubmitting] = useState(false)
	const [error, setError] = useState<string | null>(null)
	const [userTyping, setUserTyping] = useState(false)
	const [displayed, setDisplayed] = useState('')
	const [suggestIndex, setSuggestIndex] = useState(0)
	const [charIndex, setCharIndex] = useState(0)
	const [backspacing, setBackspacing] = useState(false)
    const [expanded, setExpanded] = useState(false)
	const containerRef = useRef<HTMLDivElement | null>(null)

	const suggestion = useMemo(function pick() {
		return SUGGESTIONS[suggestIndex % SUGGESTIONS.length]
	}, [suggestIndex])

	useEffect(function typewriter() {
		if (userTyping || title.length > 0) return
		let intervalId: any
		function tick() {
			if (!backspacing) {
				if (charIndex < suggestion.length) {
					setDisplayed(suggestion.slice(0, charIndex + 1))
					setCharIndex(charIndex + 1)
				} else {
					setBackspacing(true)
				}
			} else {
				if (charIndex > 0) {
					setDisplayed(suggestion.slice(0, charIndex - 1))
					setCharIndex(charIndex - 1)
				} else {
					setBackspacing(false)
					setSuggestIndex((suggestIndex + 1) % SUGGESTIONS.length)
				}
			}
		}
		intervalId = setInterval(tick, backspacing ? 40 : 80)
		return function cleanup() { clearInterval(intervalId) }
	}, [userTyping, title, suggestIndex, charIndex, backspacing, suggestion])

	useEffect(function handleOutsideClicks() {
		function onDocMouseDown(e: MouseEvent) {
			if (!containerRef.current) return
			if (containerRef.current.contains(e.target as Node)) return
			setExpanded(false)
		}
		document.addEventListener('mousedown', onDocMouseDown)
		return function cleanup() {
			document.removeEventListener('mousedown', onDocMouseDown)
		}
	}, [])

	function onTitleChange(e: React.ChangeEvent<HTMLInputElement>) {
		if (!userTyping) setUserTyping(true)
		setTitle(e.target.value)
	}

	function onTitleFocus() {
		if (!expanded) setExpanded(true)
	}

	function onContentChange(e: React.ChangeEvent<HTMLTextAreaElement>) {
		setContent(e.target.value)
	}

	function onContentFocus() {
		if (!expanded) setExpanded(true)
	}

	function onTagsChange(e: React.ChangeEvent<HTMLInputElement>) {
		setTags(e.target.value)
	}

	function onRoleChange(e: React.ChangeEvent<HTMLInputElement>) {
		setRole(e.target.value)
	}

	function onTaskChange(e: React.ChangeEvent<HTMLInputElement>) {
		setTask(e.target.value)
	}

	function onConstraintsChange(e: React.ChangeEvent<HTMLTextAreaElement>) {
		setConstraints(e.target.value)
	}

	function onOutputFormatChange(e: React.ChangeEvent<HTMLTextAreaElement>) {
		setOutputFormat(e.target.value)
	}

	function onCriteriaChange(e: React.ChangeEvent<HTMLTextAreaElement>) {
		setCriteria(e.target.value)
	}

	function onActiveChange(e: React.ChangeEvent<HTMLInputElement>) {
		setIsActive(e.target.checked)
	}

	function onContainerClick() {
		if (!expanded) setExpanded(true)
	}

	async function submit(ev: React.FormEvent<HTMLFormElement>) {
		ev.preventDefault()
		setSubmitting(true)
		setError(null)
		try {
			const res = await fetch(`${apiBaseUrl}/prompts`, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					title: title,
					role: role || '(define el rol: Eres [experto X])',
					task: task || '(especifica la acción)',
					context: content,
					constraints: constraints.split('\n').map(function (t) { return t.trim() }).filter(function (t) { return t.length > 0 }),
					output_format: outputFormat || '(define el formato de salida)',
					criteria: criteria || '(define los criterios)',
					status: isActive ? 'active' : 'inactive',
					tags: tags.split(',').map(function (t) { return t.trim() }).filter(function (t) { return t.length > 0 })
				})
			})
			if (!res.ok) throw new Error('No se pudo crear el prompt')
			setTitle('')
			setRole('')
			setContent('')
			setTask('')
			setConstraints('')
			setOutputFormat('')
			setCriteria('')
			setTags('')
			setIsActive(true)
			setUserTyping(false)
			window.location.href = '/'
		} catch (e: any) {
			setError(e.message || 'Error al crear el prompt')
		} finally {
			setSubmitting(false)
		}
	}

	return (
		<section className="card p-4" onClick={onContainerClick} ref={containerRef}>
			<div className="mb-2">
				<h2 className="text-lg font-semibold">Crear nuevo prompt</h2>
			</div>
			<form onSubmit={submit} className="mt-2 space-y-4">
				<div>
					<label className="label">Título</label>
					<Input placeholder={userTyping || title.length > 0 ? 'Título del prompt' : displayed} value={title} onChange={onTitleChange} onFocus={onTitleFocus} required />
				</div>
				<div className={(expanded ? 'max-h-[2000px] opacity-100' : 'max-h-0 opacity-0') + ' overflow-hidden transition-all duration-500'}>
					<div className="mt-4 grid gap-4 md:grid-cols-2">
						<div>
							<label className="label">Rol</label>
							<Input value={role} onChange={onRoleChange} placeholder="Eres [experto X]" />
						</div>
						<div>
							<label className="label">Tarea</label>
							<Input value={task} onChange={onTaskChange} placeholder="Describe la acción concreta" />
						</div>
						<div className="md:col-span-2">
							<label className="label">Contexto</label>
							<Textarea value={content} onChange={onContentChange} onFocus={onContentFocus} required />
						</div>
						<div>
							<label className="label">Restricciones (una por línea)</label>
							<Textarea value={constraints} onChange={onConstraintsChange} placeholder={'- Máximo 200 palabras\n- Evitar jerga técnica'} />
						</div>
						<div>
							<label className="label">Formato de salida</label>
							<Textarea value={outputFormat} onChange={onOutputFormatChange} placeholder={'JSON con campos: titulo, resumen, palabras_clave'} />
						</div>
						<div className="md:col-span-2">
							<label className="label">Criterios</label>
							<Textarea value={criteria} onChange={onCriteriaChange} placeholder={'Verificar fuentes, claridad y neutralidad'} />
						</div>
						<div>
							<label className="label">Tags (separadas por coma)</label>
							<Input value={tags} onChange={onTagsChange} placeholder="poesía, cine, gaming" />
						</div>
						<div className="flex items-center gap-2">
							<input id="active-new" type="checkbox" checked={isActive} onChange={onActiveChange} />
							<label htmlFor="active-new">Activo</label>
						</div>
						{error ? <div className="md:col-span-2 text-sm text-red-600">{error}</div> : null}
						<div className="md:col-span-2 mt-1 flex justify-end gap-2">
							<Button type="submit" disabled={submitting}>{submitting ? 'Creando…' : 'Crear'}</Button>
						</div>
					</div>
				</div>
			</form>
		</section>
	)
}


