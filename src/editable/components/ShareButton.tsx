'use client'

import { useState } from 'react'
import { Copy, Check } from 'lucide-react'

export function ShareButton({ className = '' }: { className?: string }) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href)
      setCopied(true)
      window.setTimeout(() => setCopied(false), 1600)
    } catch {
      setCopied(false)
    }
  }

  return (
    <button
      type="button"
      onClick={handleCopy}
      className={`inline-flex items-center gap-2 rounded-full border border-[#995f2f22] bg-white px-4 py-2 text-sm font-black text-[#622b14] transition hover:-translate-y-0.5 ${className}`}
      aria-label="Copy page link"
    >
      {copied ? <Check className="h-4 w-4 text-emerald-600" /> : <Copy className="h-4 w-4" />}
      {copied ? 'Copied' : 'Share'}
    </button>
  )
}
