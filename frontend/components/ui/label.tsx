import { LabelHTMLAttributes } from 'react'
import clsx from 'clsx'

export type LabelProps = LabelHTMLAttributes<HTMLLabelElement>

export function Label(props: LabelProps) {
  const { className, ...rest } = props
  return <label className={clsx('block text-sm font-medium text-gray-700 mb-1', className)} {...rest} />
}


