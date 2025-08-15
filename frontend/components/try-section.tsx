'use client'

import Image from 'next/image'
import { useState } from 'react'
import { apiBaseUrl } from '@/lib/api'

type Sample = {
  title: string
  role: string
  task: string
  context: string
  constraints: string[]
  output_format: string
  criteria: string
  status: 'active' | 'inactive'
  tags: string[]
  image: string
}

const samples: Sample[] = [
  {
    title: 'Poetas del Siglo de Oro Español',
    role: 'Eres experto en poesía del Siglo de Oro español',
    task: 'Redacta un soneto original con métrica aproximada',
    context: 'Inspirado en Lope, Quevedo y Góngora; tema: la fugacidad del tiempo',
    constraints: ['Idioma: español', 'Extensión: 14 versos', 'Tono: contemplativo'],
    output_format: 'Texto plano con rimas aproximadas; añadir título del poema en la primera línea',
    criteria: 'Revisar métrica aproximada, uso de metáforas barrocas y coherencia temática',
    status: 'active',
    tags: ['poesía', 'siglo-de-oro'],
    image: '/images/siglo-de-oro-espanol.jpg'
  },
  {
    title: 'Armas de John Wick',
    role: 'Eres armero y táctico especializado en John Wick',
    task: 'Elabora una lista con 5 armas icónicas y su uso táctico',
    context: 'Basado en escenas de la saga John Wick; prioriza precisión y maniobrabilidad',
    constraints: ['Idioma: español', 'Formato resumido', 'Máx. 120 palabras por arma'],
    output_format: 'JSON con campos: arma, calibre, ventajas, desventajas, escena_referencia',
    criteria: 'Verificar coherencia técnica y ejemplos concretos en pantalla',
    status: 'active',
    tags: ['cine', 'armas'],
    image: '/images/john-wick-guns.avif'
  },
  {
    title: 'Jefes más difíciles de Elden Ring',
    role: 'Eres estratega experto en Elden Ring',
    task: 'Proporciona estrategias para superar 3 jefes notoriamente difíciles',
    context: 'Considera opciones de builds (fuerza, destreza, fe) y uso de invocaciones',
    constraints: ['Idioma: español', '3-5 pasos por jefe', 'Incluye recomendaciones de equipo'],
    output_format: 'Markdown con secciones por jefe y lista de pasos',
    criteria: 'Estrategias reproducibles, claridad y referencias a ataques clave',
    status: 'active',
    tags: ['gaming', 'elden-ring'],
    image: '/images/malenia-elden-ring.jpg'
  }
]

export default function TrySection() {
  const [creating, setCreating] = useState(false)

  async function useSample(sample: Sample) {
    setCreating(true)
    try {
      await fetch(`${apiBaseUrl}/prompts`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: sample.title,
          role: sample.role,
          task: sample.task,
          context: sample.context,
          constraints: sample.constraints,
          output_format: sample.output_format,
          criteria: sample.criteria,
          status: sample.status,
          tags: sample.tags
        })
      })
      window.location.href = '/'
    } finally {
      setCreating(false)
    }
  }

  return (
    <section className="space-y-3">
      <h2 className="text-lg font-semibold">Prueba con:</h2>
      <div className="grid gap-4 md:grid-cols-3">
        {samples.map(function (s, i) {
          return (
            <div key={i} className="card overflow-hidden">
              <div className="relative h-40 w-full">
                <Image
                  src={s.image}
                  alt={s.title}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 33vw, 33vw"
                  priority
                />
              </div>
              <div className="p-4 space-y-2">
                <h3 className="font-medium">{s.title}</h3>
                <p className="text-sm text-gray-600">{s.task}</p>
                <div className="space-x-1">
                  {s.tags.map(function (t, j) { return <span key={j} className="badge">{t}</span> })}
                </div>
                <button disabled={creating} className="btn-primary px-3 py-2 mt-2" onClick={function () { useSample(s) }}>{creating ? 'Creando…' : 'Usar prompt'}</button>
              </div>
            </div>
          )
        })}
      </div>
    </section>
  )
}


