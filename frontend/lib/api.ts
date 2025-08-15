export const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000'

export async function fetcher(input: RequestInfo, init?: RequestInit) {
  const res = await fetch(input, init)
  if (!res.ok) throw new Error('Network response was not ok')
  return res.json()
}


