import { ButtonHTMLAttributes, forwardRef } from 'react'
import clsx from 'clsx'

export type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'default' | 'outline'
  size?: 'sm' | 'md'
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(props, ref) {
  const { className, variant = 'default', size = 'md', ...rest } = props
  const base = 'inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none'
  const variants = {
    default: 'bg-gray-900 text-white hover:bg-gray-800 focus:ring-gray-400',
    outline: 'border border-gray-300 bg-white hover:bg-gray-50'
  } as const
  const sizes = {
    sm: 'px-3 py-1.5',
    md: 'px-4 py-2'
  } as const
  return (
    <button ref={ref} className={clsx(base, variants[variant], sizes[size], className)} {...rest} />
  )
})


