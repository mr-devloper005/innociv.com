import Link from 'next/link'
import { ArrowRight, ChevronLeft } from 'lucide-react'
import type { SitePost, SiteFeedPagination } from '@/lib/site-connector'
import { CATEGORY_OPTIONS } from '@/lib/categories'
import { taskPageVoices } from '@/editable/content/task-pages.content'
import { pagesContent } from '@/editable/content/pages.content'
import { editableDesignContract as dc, editablePalette as pal } from '@/editable/layouts/design-contract'
import { ArticleListCard, getEditableTitle, postHref } from '@/editable/cards/PostCards'

export function EditableArticleArchive({ posts, pagination, category = 'all', basePath = '/article' }: { posts: SitePost[]; pagination: SiteFeedPagination; category?: string; basePath?: string }) {
  const voice = taskPageVoices.article
  const page = pagination.page || 1
  const pageHref = (nextPage: number) => `${basePath}?${new URLSearchParams({ ...(category && category !== 'all' ? { category } : {}), page: String(nextPage) }).toString()}`
  return (
    <main className="bg-[linear-gradient(180deg,#f7edd2,#efe0bd)] text-[var(--slot4-page-text)]">
      <section className="mx-auto max-w-[1520px] px-4 pt-12 sm:px-6 lg:px-8 lg:pt-16">
        <div className="rounded-[2.6rem] border border-[#6f4c2916] bg-[linear-gradient(180deg,#fffaf0,#f7ecd1)] p-7 shadow-[0_24px_80px_rgba(29,15,9,0.10)] sm:p-10 lg:p-12">
          <p className={`${dc.type.eyebrow} text-[#995f2f]`}>{voice.eyebrow}</p>
          <h1 className={`${dc.type.heroTitle} mt-5 max-w-5xl`}>{voice.headline}</h1>
          <p className="mt-6 max-w-3xl text-base leading-8 text-[var(--slot4-muted-text)]">{voice.description}</p>
          <div className="mt-7 flex flex-wrap gap-2">
            {CATEGORY_OPTIONS.slice(0, 8).map((item) => (
              <Link key={item.slug} href={`${basePath}?category=${item.slug}`} className={`rounded-full border px-4 py-2 text-sm font-black transition ${category === item.slug ? 'border-[#24171a] bg-[#24171a] text-white' : 'border-[#995f2f22] bg-white text-[#622b14] hover:-translate-y-0.5'}`}>
                {item.name}
              </Link>
            ))}
          </div>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href={basePath} className={dc.button.primary}>Browse latest</Link>
            <Link href="/search" className={dc.button.secondary}>Search archive</Link>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-[1520px] px-4 py-14 sm:px-6 lg:px-8">
        {posts.length ? (
          <div className="grid gap-5">
            {posts.map((post, index) => <ArticleListCard key={post.id} post={post} href={postHref('article', post, basePath)} index={index + (page - 1) * pagination.limit} />)}
          </div>
        ) : (
          <div className="rounded-[2.2rem] border border-dashed border-[#995f2f30] bg-white/75 p-8 text-center">
            <h2 className="text-3xl font-semibold tracking-[-0.05em]">No articles found</h2>
            <p className="mt-3 text-sm leading-7 text-[var(--slot4-muted-text)]">Try another category or return to the full archive.</p>
          </div>
        )}
        <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
          {pagination.hasPrevPage ? <Link href={pageHref(page - 1)} className={dc.button.secondary}>Previous</Link> : null}
          <span className={dc.button.primary}>Page {page} of {pagination.totalPages || 1}</span>
          {pagination.hasNextPage ? <Link href={pageHref(page + 1)} className={dc.button.secondary}>Next</Link> : null}
        </div>
      </section>
    </main>
  )
}

export function EditableArticleDetailShell({ slug, post }: { slug: string; post: SitePost | null }) {
  const voice = taskPageVoices.article
  return (
    <main className="bg-[linear-gradient(180deg,#f7edd2,#efe0bd)] text-[var(--slot4-page-text)]">
      <section className="mx-auto max-w-[1520px] px-4 pt-10 sm:px-6 lg:px-8 lg:pt-16">
        <div className="grid gap-6 rounded-[2.6rem] border border-[#6f4c2916] bg-white p-6 shadow-[0_24px_80px_rgba(29,15,9,0.10)] lg:grid-cols-[minmax(0,1fr)_320px] lg:p-10">
          <div className="min-w-0">
            <Link href="/article" className={`inline-flex items-center gap-2 rounded-full border border-[#995f2f22] bg-[#fffaf0] px-4 py-2 text-sm font-black text-[#622b14]`}><ChevronLeft className="h-4 w-4" /> Articles</Link>
            <p className={`${dc.type.eyebrow} mt-8 text-[#995f2f]`}>{voice.eyebrow}</p>
            <h1 className={`mt-4 max-w-4xl text-4xl font-semibold leading-[0.94] tracking-[-0.07em] sm:text-5xl lg:text-7xl`}>{post?.title || pagesContent.detailPages.article.fallbackTitle}</h1>
            <p className="mt-5 max-w-3xl text-base leading-8 text-[var(--slot4-muted-text)]">{post?.summary || voice.description}</p>
          </div>
          <aside className="min-w-0 rounded-[2rem] bg-[#24171a] p-6 text-white">
            <p className={`${dc.type.eyebrow} text-[#e4d6a9]`}>Reading note</p>
            <p className="mt-4 text-sm leading-7 text-white/72">{voice.secondaryNote}</p>
            <Link href="/contact" className="mt-6 inline-flex items-center gap-2 rounded-full bg-[#e4d6a9] px-5 py-3 text-sm font-black text-[#24171a]">Contact <ArrowRight className="h-4 w-4" /></Link>
          </aside>
        </div>
      </section>
      <section className="mx-auto w-full max-w-5xl px-4 pb-16 pt-6 sm:px-6 lg:px-8 lg:pb-24">
        <div className="rounded-[2.25rem] border border-[#6f4c2916] bg-white p-6 shadow-[0_24px_80px_rgba(29,15,9,0.10)] sm:p-8 lg:p-10">
          <p className={`text-sm leading-8 text-[var(--slot4-muted-text)]`}>{post?.summary || `Article detail content for ${slug} will render through the editable detail page.`}</p>
        </div>
      </section>
    </main>
  )
}
