'use client'

import { ReactNode, useEffect } from 'react'

type ModalProps = {
  open: boolean
  title?: string
  description?: string
  confirmLabel?: string
  cancelLabel?: string
  onConfirm: () => void
  onClose: () => void
  children?: ReactNode
}

export default function Modal(props: ModalProps) {
  const { open, title, description, confirmLabel, cancelLabel, onConfirm, onClose, children } = props

  useEffect(function lockScroll() {
    if (open) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return function cleanup() { document.body.style.overflow = '' }
  }, [open])

  if (!open) return null

  function handleBackdropClick(e: React.MouseEvent<HTMLDivElement>) {
    if (e.target === e.currentTarget) onClose()
  }

  function handleConfirm() {
    onConfirm()
  }

  function handleClose() {
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" onClick={handleBackdropClick}>
      <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-lg">
        {title ? <h3 className="text-lg font-semibold">{title}</h3> : null}
        {description ? <p className="mt-1 text-sm text-gray-600">{description}</p> : null}
        {children ? <div className="mt-3 text-sm text-gray-700">{children}</div> : null}
        <div className="mt-6 flex justify-end gap-2">
          <button className="btn-outline px-4 py-2" onClick={handleClose}>{cancelLabel || 'Cancelar'}</button>
          <button className="btn-primary px-4 py-2" onClick={handleConfirm}>{confirmLabel || 'Confirmar'}</button>
        </div>
      </div>
    </div>
  )
}


