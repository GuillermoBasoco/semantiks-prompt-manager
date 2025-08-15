'use client'

import Image from 'next/image'
import { useState } from 'react'
import { apiBaseUrl } from '@/lib/api'

type Sample = {
  title: string
  description: string
  image: string
  tags: string[]
  content: string
}

const samples: Sample[] = [
  {
    title: 'Poetas del Siglo de Oro Español',
    description: 'Crea prompts inspirados en Lope, Quevedo y Góngora.',
    image: 'https://images.unsplash.com/photo-1526312426976-593c2b999c59?q=80&w=1200&auto=format&fit=crop',
    tags: ['poesía', 'siglo-de-oro'],
    content: 'Escribe un soneto al estilo del Siglo de Oro español sobre la fugacidad del tiempo.'
  },
  {
    title: 'Armas de John Wick',
    description: 'Listado y descripciones de armas icónicas de la saga.',
    image: 'https://images.unsplash.com/photo-1510707577719-ae7c14805e3a?q=80&w=1200&auto=format&fit=crop',
    tags: ['cine', 'armas'],
    content: 'Crea una guía con 5 armas icónicas usadas por John Wick, con ventajas y desventajas.'
  },
  {
    title: 'Jefes más difíciles de Elden Ring',
    description: 'Resumen táctico para los encuentros más duros.',
    image: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=1200&auto=format&fit=crop',
    tags: ['gaming', 'elden-ring'],
    content: 'Escribe estrategias detalladas para vencer a 3 jefes notoriamente difíciles en Elden Ring.'
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
          content: sample.content,
          tags: sample.tags,
          is_active: true
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
                <Image src={s.image} alt={s.title} fill className="object-cover" />
              </div>
              <div className="p-4 space-y-2">
                <h3 className="font-medium">{s.title}</h3>
                <p className="text-sm text-gray-600">{s.description}</p>
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


