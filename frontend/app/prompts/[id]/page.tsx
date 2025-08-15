import PromptDetail from '@/components/prompt-detail'
import { notFound } from 'next/navigation'

export const runtime = 'edge'

type Props = { params: { id: string } }

export default async function PromptDetailPage({ params }: Props) {
  const id = Number(params.id)
  if (Number.isNaN(id)) return notFound()
  return (
    <main className="space-y-4">
      <PromptDetail id={id} />
    </main>
  )
}


