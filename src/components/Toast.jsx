import { useState, useEffect, useCallback } from 'react'

let toastFn = null

export function useToast() {
  const [msg, setMsg] = useState('')
  const [err, setErr] = useState(false)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    toastFn = (message, isError = false) => {
      setMsg(message)
      setErr(isError)
      setVisible(true)
      setTimeout(() => setVisible(false), 2500)
    }
  }, [])

  return { msg, err, visible }
}

export function toast(message, isError = false) {
  if (toastFn) toastFn(message, isError)
}

export default function Toast() {
  const { msg, err, visible } = useToast()
  return (
    <div className={`toast ${visible ? 'show' : ''}`}>
      <div className="toast-dot" style={{ background: err ? 'var(--accent4)' : 'var(--accent3)' }} />
      <span>{msg}</span>
    </div>
  )
}
