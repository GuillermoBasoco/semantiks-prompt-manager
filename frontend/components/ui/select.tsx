import { SelectHTMLAttributes, forwardRef } from 'react'
import clsx from 'clsx'

export type SelectProps = SelectHTMLAttributes<HTMLSelectElement>

export const Select = forwardRef<HTMLSelectElement, SelectProps>(function Select(props, ref) {
  const { className, ...rest } = props
  return (
    <select ref={ref} className={clsx('w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm shadow-sm focus:border-gray-900 focus:outline-none', className)} {...rest} />
  )
})


