import type { Metadata } from 'next'
import Link from 'next/link'
import { BookOpen, ArrowRight } from 'lucide-react'
import { buildPageMetadata } from '@/lib/seo'
import { EditableSiteShell } from '@/editable/shell/EditableSiteShell'
import { EditableLocalLoginForm } from '@/editable/components/EditableLocalAuthForms'
import { pagesContent } from '@/editable/content/pages.content'

export async function generateMetadata(): Promise<Metadata> {
  return buildPageMetadata({ path: '/login', title: 'Login', description: pagesContent.auth.login.metadataDescription })
}

export default function LoginPage() {
  return (
    <EditableSiteShell>
      <main className="bg-[linear-gradient(180deg,#f7edd2,#efe0bd)] text-[var(--slot4-page-text)]">
        <section className="mx-auto grid min-h-[calc(100vh-12rem)] max-w-[1520px] items-center gap-10 px-4 py-12 sm:px-6 lg:grid-cols-[1fr_0.92fr] lg:px-8">
          <div className="max-w-2xl">
            <p className="text-xs font-black uppercase tracking-[0.28em] text-[#995f2f]">{pagesContent.auth.login.badge}</p>
            <h1 className="mt-5 text-5xl font-semibold leading-[0.94] tracking-[-0.07em] sm:text-6xl">{pagesContent.auth.login.title}</h1>
            <p className="mt-6 max-w-xl text-base leading-8 text-[var(--slot4-muted-text)]">{pagesContent.auth.login.description}</p>
            <div className="mt-8 rounded-[2rem] border border-[#6f4c2916] bg-white p-6 shadow-[0_24px_80px_rgba(29,15,9,0.10)]">
              <BookOpen className="h-5 w-5 text-[#995f2f]" />
              <p className="mt-4 text-sm leading-7 text-[var(--slot4-muted-text)]">Return to your publishing workspace and continue managing the archive from one clean, focused entry point.</p>
            </div>
          </div>
          <div className="rounded-[2.4rem] border border-[#6f4c2916] bg-white/85 p-6 shadow-[0_24px_80px_rgba(29,15,9,0.10)] backdrop-blur sm:p-8">
            <h2 className="text-2xl font-semibold tracking-[-0.04em]">{pagesContent.auth.login.formTitle}</h2>
            <EditableLocalLoginForm />
            <p className="mt-5 text-sm text-[var(--slot4-muted-text)]">New here? <Link href="/signup" className="font-black text-[#622b14] underline-offset-4 hover:underline">{pagesContent.auth.login.createCta}</Link></p>
            <Link href="/search" className="mt-6 inline-flex items-center gap-2 rounded-full bg-[#24171a] px-5 py-3 text-sm font-black text-white">Browse first <ArrowRight className="h-4 w-4" /></Link>
          </div>
        </section>
      </main>
    </EditableSiteShell>
  )
}
