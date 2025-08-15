import { Suspense } from 'react'
import { PromptsList } from '@/components/prompts-list'
import { Filters } from '@/components/prompts-filters'

export const runtime = 'edge'
export const dynamic = 'force-dynamic'

export default function HomePage() {
  return (
    <main className="space-y-4">
      <div className="card p-4">
        <Suspense fallback={<div>Loading filters…</div>}>
          <Filters />
        </Suspense>
      </div>
      <Suspense fallback={<div>Loading prompts…</div>}>
        <PromptsList />
      </Suspense>
    </main>
  )
}


