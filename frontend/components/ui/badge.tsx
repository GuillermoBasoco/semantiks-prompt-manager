import { HTMLAttributes } from 'react'
import clsx from 'clsx'

export type BadgeProps = HTMLAttributes<HTMLSpanElement>

export function Badge(props: BadgeProps) {
  const { className, ...rest } = props
  return <span className={clsx('inline-flex items-center rounded-full border border-gray-300 px-2 py-0.5 text-xs text-gray-700 bg-gray-100', className)} {...rest} />
}


