'use client'

import Link from 'next/link'
import type { CSSProperties } from 'react'
import { ArrowUpRight, Mail, MapPin, Sparkles } from 'lucide-react'
import { SITE_CONFIG } from '@/lib/site-config'
import { globalContent } from '@/editable/content/global.content'
import { useEditableLocalAuthSession } from '@/editable/components/EditableLocalAuthForms'

export function EditableFooter() {
  const footerVars = { '--editable-footer-bg': '#201410', '--editable-footer-text': '#fff4df' } as CSSProperties
  const taskLinks = SITE_CONFIG.tasks.filter((task) => task.enabled)
  const year = new Date().getFullYear()
  const { session, logout } = useEditableLocalAuthSession()

  const utilityLinks = [
    { label: 'About', href: '/about' },
    { label: 'Contact', href: '/contact' },
    { label: 'Search', href: '/search' },
    ...(session ? [{ label: 'Create', href: '/create' }] : [{ label: 'Login', href: '/login' }, { label: 'Join', href: '/signup' }]),
  ]

  return (
    <footer style={footerVars} className="border-t border-white/10 bg-[var(--editable-footer-bg)] text-[var(--editable-footer-text)]">
      <div className="mx-auto max-w-[var(--editable-container)] px-4 py-14 sm:px-6 lg:px-8 lg:py-16">
        <div className="grid gap-8 rounded-[2.2rem] border border-white/8 bg-[linear-gradient(180deg,rgba(255,255,255,0.05),rgba(255,255,255,0.015))] p-6 shadow-[0_24px_80px_rgba(0,0,0,0.18)] lg:grid-cols-[1.1fr_0.8fr_0.8fr] lg:p-8">
          <div>
            <Link href="/" className="inline-flex items-center gap-3">
              <img src="/favicon.png?v=20260413" alt={SITE_CONFIG.name} className="h-11 w-11 object-contain" />
              <span>
                <span className="block text-lg font-black uppercase tracking-[0.2em]">{SITE_CONFIG.name}</span>
                <span className="block text-[11px] font-medium uppercase tracking-[0.24em] text-white/55">{globalContent.footer?.tagline || SITE_CONFIG.tagline}</span>
              </span>
            </Link>
            <p className="mt-5 max-w-xl text-sm leading-7 text-white/70">{globalContent.footer?.description || SITE_CONFIG.description}</p>
            
          </div>

          <div>
            <h3 className="text-xs font-black uppercase tracking-[0.28em] text-white/55">Explore</h3>
            <div className="mt-4 grid gap-3">
              {taskLinks.map((task) => (
                <Link key={task.key} href={task.route} className="group inline-flex items-center justify-between gap-3 rounded-full border border-white/8 bg-white/4 px-4 py-3 text-sm font-black text-white/82 transition hover:bg-white/8">
                  <span>{task.label}</span>
                  <ArrowUpRight className="h-4 w-4 transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </Link>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-xs font-black uppercase tracking-[0.28em] text-white/55">Site</h3>
            <div className="mt-4 grid gap-3">
              {utilityLinks.map((item) => (
                <Link key={item.href} href={item.href} className="inline-flex items-center justify-between rounded-full border border-white/8 bg-white/4 px-4 py-3 text-sm font-black text-white/82 transition hover:bg-white/8">
                  {item.label}
                  <ArrowUpRight className="h-4 w-4 opacity-60" />
                </Link>
              ))}
              {session ? <button type="button" onClick={logout} className="inline-flex items-center justify-between rounded-full border border-white/8 bg-white/4 px-4 py-3 text-left text-sm font-black text-white/82 transition hover:bg-white/8"><span>Logout</span><Mail className="h-4 w-4 opacity-60" /></button> : null}
            </div>
          </div>
        </div>
        <div className="mt-5 flex flex-col gap-2 border-t border-white/10 pt-5 text-xs font-bold uppercase tracking-[0.2em] text-white/42 sm:flex-row sm:items-center sm:justify-between">
          <span>© {year} {SITE_CONFIG.name}</span>
          <span>{globalContent.footer?.bottomNote || 'Built for refined browsing and easy discovery.'}</span>
        </div>
      </div>
    </footer>
  )
}
