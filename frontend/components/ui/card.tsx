import { HTMLAttributes } from 'react'
import clsx from 'clsx'

export function Card(props: HTMLAttributes<HTMLDivElement>) {
  const { className, ...rest } = props
  return <div className={clsx('rounded-lg border border-gray-200 bg-white shadow-sm', className)} {...rest} />
}

export function CardHeader(props: HTMLAttributes<HTMLDivElement>) {
  const { className, ...rest } = props
  return <div className={clsx('border-b px-4 py-3', className)} {...rest} />
}

export function CardContent(props: HTMLAttributes<HTMLDivElement>) {
  const { className, ...rest } = props
  return <div className={clsx('p-4', className)} {...rest} />
}


