import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowRight, Sparkles } from 'lucide-react'
import { buildPageMetadata } from '@/lib/seo'
import { EditableSiteShell } from '@/editable/shell/EditableSiteShell'
import { EditableLocalSignupForm } from '@/editable/components/EditableLocalAuthForms'
import { pagesContent } from '@/editable/content/pages.content'

export async function generateMetadata(): Promise<Metadata> {
  return buildPageMetadata({ path: '/signup', title: 'Sign up', description: pagesContent.auth.signup.metadataDescription })
}

export default function SignupPage() {
  return (
    <EditableSiteShell>
      <main className="bg-[linear-gradient(180deg,#f7edd2,#efe0bd)] text-[var(--slot4-page-text)]">
        <section className="mx-auto grid min-h-[calc(100vh-12rem)] max-w-[1520px] items-center gap-10 px-4 py-12 sm:px-6 lg:grid-cols-[0.92fr_1.08fr] lg:px-8">
          <div className="rounded-[2.4rem] border border-[#6f4c2916] bg-[#24171a] p-6 text-white shadow-[0_24px_80px_rgba(29,15,9,0.22)] sm:p-8">
            <Sparkles className="h-5 w-5 text-[#e4d6a9]" />
            <h1 className="mt-5 text-5xl font-semibold leading-[0.94] tracking-[-0.07em] sm:text-6xl">{pagesContent.auth.signup.title}</h1>
            <p className="mt-6 max-w-lg text-sm leading-8 text-white/72">{pagesContent.auth.signup.description}</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/login" className="inline-flex items-center gap-2 rounded-full bg-[#e4d6a9] px-6 py-3 text-sm font-black text-[#24171a]">Login <ArrowRight className="h-4 w-4" /></Link>
            </div>
          </div>
          <div className="rounded-[2.4rem] border border-[#6f4c2916] bg-white/85 p-6 shadow-[0_24px_80px_rgba(29,15,9,0.10)] backdrop-blur sm:p-8">
            <p className="text-xs font-black uppercase tracking-[0.28em] text-[#995f2f]">{pagesContent.auth.signup.badge}</p>
            <h2 className="mt-4 text-2xl font-semibold tracking-[-0.04em]">{pagesContent.auth.signup.formTitle}</h2>
            <EditableLocalSignupForm />
            <p className="mt-5 text-sm text-[var(--slot4-muted-text)]">Already have an account? <Link href="/login" className="font-black text-[#622b14] underline-offset-4 hover:underline">{pagesContent.auth.signup.loginCta}</Link></p>
          </div>
        </section>
      </main>
    </EditableSiteShell>
  )
}
