import Link from 'next/link'
import { Sparkles, BookOpen, ScanSearch, FileText, ArrowRight, CheckCircle2 } from 'lucide-react'
import { SITE_CONFIG } from '@/lib/site-config'
import { pagesContent } from '@/editable/content/pages.content'
import { EditableSiteShell } from '@/editable/shell/EditableSiteShell'

export default function AboutPage() {
  const highlights = [
    'PDF-focused reading experience',
    'Warm premium visual system',
    'Cleaner archive and detail browsing',
  ]

  return (
    <EditableSiteShell>
      <main className="bg-[linear-gradient(180deg,#f7edd2,#efe0bd)] px-4 py-14 text-[var(--slot4-page-text)] sm:px-6 lg:px-8">
        <section className="mx-auto max-w-[1520px]">
          <div className="overflow-hidden rounded-[2.8rem] border border-[#6f4c2916] bg-[linear-gradient(180deg,#fffaf0,#f7ecd1)] shadow-[0_24px_80px_rgba(29,15,9,0.10)]">
            <div className="grid gap-8 p-8 lg:grid-cols-[1.08fr_0.92fr] lg:p-12">
              <article>
                <p className="text-xs font-black uppercase tracking-[0.24em] text-[#995f2f]">{pagesContent.about.badge}</p>
                <h1 className="mt-5 max-w-4xl text-5xl font-semibold leading-[0.92] tracking-[-0.07em] sm:text-6xl">About {SITE_CONFIG.name}</h1>
                <p className="mt-5 max-w-3xl text-lg leading-8 text-[var(--slot4-muted-text)]">{pagesContent.about.description}</p>

                <div className="mt-8 flex flex-wrap gap-3">
                  {highlights.map((item) => (
                    <span key={item} className="rounded-full border border-[#995f2f22] bg-white px-4 py-2 text-[11px] font-black uppercase tracking-[0.18em] text-[#622b14]">
                      {item}
                    </span>
                  ))}
                </div>

                <div className="mt-8 grid gap-4 text-sm leading-8 text-[var(--slot4-muted-text)]">
                  {pagesContent.about.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
                </div>

                <div className="mt-8 flex flex-wrap gap-3">
                  <Link href="/pdf" className="inline-flex items-center gap-2 rounded-full bg-[#24171a] px-5 py-3 text-sm font-black text-white">
                    Browse PDF library <ArrowRight className="h-4 w-4" />
                  </Link>
                  <Link href="/search" className="inline-flex items-center gap-2 rounded-full border border-[#995f2f22] bg-white px-5 py-3 text-sm font-black text-[#24171a]">
                    Search the archive
                  </Link>
                </div>
              </article>

              <aside className="grid gap-4 self-start">
                <div className="rounded-[2.2rem] bg-[#24171a] p-6 text-white shadow-[0_24px_80px_rgba(29,15,9,0.24)]">
                  <Sparkles className="h-5 w-5 text-[#e4d6a9]" />
                  <h2 className="mt-4 text-2xl font-semibold tracking-[-0.04em]">Why the site feels different</h2>
                  <p className="mt-3 text-sm leading-7 text-white/72">The goal is simple: make document discovery feel more curated, more readable, and more rewarding for people who enjoy well-presented PDFs.</p>
                </div>

                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
                  {pagesContent.about.values.map((value, index) => (
                    <div key={value.title} className={`rounded-[2rem] border border-[#6f4c2916] p-6 shadow-[0_16px_50px_rgba(29,15,9,0.08)] ${index % 2 === 0 ? 'bg-white' : 'bg-[#fffaf0]'}`}>
                      {index === 0 ? <FileText className="h-5 w-5 text-[#995f2f]" /> : <BookOpen className="h-5 w-5 text-[#995f2f]" />}
                      <h2 className="mt-3 text-xl font-semibold tracking-[-0.04em]">{value.title}</h2>
                      <p className="mt-3 text-sm leading-7 text-[var(--slot4-muted-text)]">{value.description}</p>
                    </div>
                  ))}
                </div>
              </aside>
            </div>

            <div className="border-t border-[#6f4c2916] bg-white/50 p-8 lg:p-12">
              <div className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
                <div className="rounded-[2.2rem] border border-[#6f4c2916] bg-white p-6 shadow-[0_16px_50px_rgba(29,15,9,0.08)]">
                  <ScanSearch className="h-5 w-5 text-[#995f2f]" />
                  <h2 className="mt-4 text-2xl font-semibold tracking-[-0.04em]">What you can expect here</h2>
                  <p className="mt-3 text-sm leading-7 text-[var(--slot4-muted-text)]">A calmer homepage, stronger PDF presentation, varied card styles, and detail pages that give documents more room to breathe.</p>
                </div>

                <div className="rounded-[2.2rem] border border-[#6f4c2916] bg-[#fffaf0] p-6 shadow-[0_16px_50px_rgba(29,15,9,0.08)]">
                  <p className="text-xs font-black uppercase tracking-[0.22em] text-[#995f2f]">At a glance</p>
                  <div className="mt-5 grid gap-3">
                    {[
                      'Search-first browsing for documents and topics',
                      'Premium task detail pages with stronger hierarchy',
                      'Safe rendering even when image or summary fields are missing',
                    ].map((item) => (
                      <div key={item} className="flex items-start gap-3 rounded-[1.4rem] bg-white px-4 py-4">
                        <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-[#995f2f]" />
                        <p className="text-sm leading-7 text-[var(--slot4-muted-text)]">{item}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </EditableSiteShell>
  )
}
