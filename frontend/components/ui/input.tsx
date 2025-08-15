import { InputHTMLAttributes, forwardRef } from 'react'
import clsx from 'clsx'

export type InputProps = InputHTMLAttributes<HTMLInputElement>

export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(props, ref) {
  const { className, ...rest } = props
  return (
    <input ref={ref} className={clsx('w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm shadow-sm focus:border-gray-900 focus:outline-none', className)} {...rest} />
  )
})


