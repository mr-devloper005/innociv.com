'use client'

import { useMemo, useState, type CSSProperties } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Menu, Search, UserPlus, LogIn, X, PlusCircle } from 'lucide-react'
import { SITE_CONFIG } from '@/lib/site-config'
import { globalContent } from '@/editable/content/global.content'
import { useEditableLocalAuthSession } from '@/editable/components/EditableLocalAuthForms'

export function EditableNavbar() {
  const [open, setOpen] = useState(false)
  const pathname = usePathname()
  const { session, logout } = useEditableLocalAuthSession()
  const navVars = { '--editable-nav-bg': '#24171a', '--editable-nav-text': '#fff7eb', '--editable-nav-active': '#e4d6a9', '--editable-nav-active-text': '#24171a', '--editable-cta-bg': '#995f2f', '--editable-cta-text': '#fff7eb', '--editable-search-bg': '#2e2020', '--editable-border': 'rgba(228,214,169,0.18)', '--editable-container': '1520px' } as CSSProperties
  const navItems = useMemo(() => SITE_CONFIG.tasks.filter((task) => task.enabled).map((task) => ({ label: task.label, href: task.route })), [])
  const uniqueLinks = (items: Array<{ label: string; href: string }>) => Array.from(new Map(items.map((item) => [item.href, item])).values())
 
  return (
    <header style={navVars} className="sticky top-0 z-50 border-b border-[var(--editable-border)] bg-[color:rgba(36,23,26,0.92)] text-[var(--editable-nav-text)] backdrop-blur-2xl">
      <nav className="mx-auto flex min-h-[84px] w-full max-w-[var(--editable-container)] items-center gap-3 px-4 py-3 sm:px-6 lg:px-8">
        <button type="button" onClick={() => setOpen((value) => !value)} className="inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-white/10 bg-white/5 transition hover:bg-white/10 lg:hidden" aria-label="Toggle menu">
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>

        <Link href="/" className="group flex shrink-0 items-center gap-3">
          <img src="/favicon.png?v=20260413" alt={SITE_CONFIG.name} className="h-11 w-11 object-contain" />
          <span className="hidden min-w-0 sm:block">
            <span className="block text-sm font-black uppercase tracking-[0.22em]">{SITE_CONFIG.name}</span>
            <span className="block text-[11px] font-medium uppercase tracking-[0.22em] text-white/58">{globalContent.nav?.tagline || SITE_CONFIG.tagline}</span>
          </span>
        </Link>

        <div className="hidden flex-1 lg:flex">
          <form action="/search" className="mx-auto w-full max-w-2xl">
            <label className="flex items-center gap-3 rounded-full border border-white/10 bg-white/7 px-5 py-3 shadow-[inset_0_1px_0_rgba(255,255,255,0.05)]">
              <Search className="h-4 w-4 text-[#e4d6a9]" />
              <input name="q" type="search" placeholder="Search documents, topics, or titles" className="min-w-0 flex-1 bg-transparent text-sm font-medium outline-none placeholder:text-white/36" />
            </label>
          </form>
        </div>

        

        <div className="ml-auto flex shrink-0 items-center gap-2">
          {session ? (
            <>
              <Link href="/create" className="hidden items-center gap-2 rounded-full bg-[var(--editable-cta-bg)] px-4 py-2.5 text-sm font-black text-[var(--editable-cta-text)] shadow-[0_12px_24px_rgba(0,0,0,0.2)] transition hover:-translate-y-0.5 sm:inline-flex"><PlusCircle className="h-4 w-4" /> Create</Link>
              <button type="button" onClick={logout} className="hidden items-center gap-2 rounded-full border border-white/10 px-4 py-2 text-sm font-black text-white/82 transition hover:bg-white/8 sm:inline-flex">Logout</button>
            </>
          ) : (
            <>
              <Link href="/login" className="hidden items-center gap-2 rounded-full border border-white/10 px-4 py-2 text-sm font-black text-white/82 transition hover:bg-white/8 sm:inline-flex"><LogIn className="h-4 w-4" /> Sign in</Link>
              <Link href="/signup" className="hidden items-center gap-2 rounded-full bg-[var(--editable-cta-bg)] px-4 py-2.5 text-sm font-black text-[var(--editable-cta-text)] shadow-[0_12px_24px_rgba(0,0,0,0.2)] transition hover:-translate-y-0.5 sm:inline-flex"><UserPlus className="h-4 w-4" /> Join</Link>
            </>
          )}
          <Link href="/search" className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-white/6 text-white/85 transition hover:bg-white/10 lg:hidden" aria-label="Search">
            <Search className="h-4 w-4" />
          </Link>
        </div>
      </nav>

      {open ? (
        <div className="border-t border-white/8 bg-[linear-gradient(180deg,rgba(36,23,26,0.98),rgba(24,15,18,0.98))] px-4 py-4 text-white lg:hidden">
          <form action="/search" className="mb-4">
            <label className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/6 px-4 py-3">
              <Search className="h-4 w-4 text-[#e4d6a9]" />
              <input name="q" type="search" placeholder="Search documents and posts" className="min-w-0 flex-1 bg-transparent text-sm font-medium outline-none placeholder:text-white/36" />
            </label>
          </form>
          <div className="flex flex-wrap gap-2">
            {uniqueLinks([{ label: 'Home', href: '/' }, ...navItems, { label: 'Contact', href: '/contact' }, { label: 'Search', href: '/search' }, ...(session ? [{ label: 'Create', href: '/create' }] : [{ label: 'Login', href: '/login' }, { label: 'Join', href: '/signup' }])]).map((item) => (
              <Link key={item.href} href={item.href} onClick={() => setOpen(false)} className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-black text-white/84 transition hover:bg-white/10">
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      ) : null}
    </header>
  )
}
