import { TextareaHTMLAttributes, forwardRef } from 'react'
import clsx from 'clsx'

export type TextareaProps = TextareaHTMLAttributes<HTMLTextAreaElement>

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(function Textarea(props, ref) {
  const { className, ...rest } = props
  return (
    <textarea ref={ref} className={clsx('w-full min-h-[140px] rounded-md border border-gray-300 bg-white px-3 py-2 text-sm shadow-sm focus:border-gray-900 focus:outline-none', className)} {...rest} />
  )
})


