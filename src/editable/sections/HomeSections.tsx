import Link from 'next/link'
import { ArrowRight, BookOpen, Search, Sparkles, ChevronRight, FileText } from 'lucide-react'
import type { SitePost } from '@/lib/site-connector'
import type { HomeTimeSection } from '@/lib/task-data'
import type { TaskKey } from '@/lib/site-config'
import { SITE_CONFIG } from '@/lib/site-config'
import { pagesContent } from '@/editable/content/pages.content'
import { editableDesignContract as dc, editablePalette as pal } from '@/editable/layouts/design-contract'
import { CompactIndexCard, EditorialFeatureCard, EditorialSnippetCard, ImageFirstCard, RailPostCard, getEditableExcerpt, getEditablePostImage, getEditableTitle, postHref } from '@/editable/cards/PostCards'

type HomeSectionProps = {
  primaryTask: TaskKey
  primaryRoute: string
  posts: SitePost[]
  timeSections: HomeTimeSection[]
}

function taskLabel(task: TaskKey) {
  return SITE_CONFIG.tasks.find((item) => item.key === task)?.label || task
}

function uniquePosts(posts: SitePost[]) {
  return Array.from(new Map(posts.map((post) => [post.slug || post.id || post.title, post])).values())
}

function SectionHeading({ eyebrow, title, description, action }: { eyebrow: string; title: string; description: string; action?: { label: string; href: string } }) {
  return (
    <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
      <div className="max-w-3xl">
        <p className={`${dc.type.eyebrow} text-[#995f2f]`}>{eyebrow}</p>
        <h2 className={`${dc.type.sectionTitle} mt-3`}>{title}</h2>
        <p className={`mt-4 max-w-2xl text-base leading-8 ${pal.mutedText}`}>{description}</p>
      </div>
      {action ? (
        <Link href={action.href} className="inline-flex items-center gap-2 self-start rounded-full border border-[#995f2f2a] bg-white px-4 py-2 text-sm font-black text-[#622b14] transition hover:-translate-y-0.5">
          {action.label} <ChevronRight className="h-4 w-4" />
        </Link>
      ) : null}
    </div>
  )
}

function StoryBadge({ label }: { label: string }) {
  return <span className="rounded-full border border-[#995f2f22] bg-white px-4 py-2 text-[11px] font-black uppercase tracking-[0.2em] text-[#622b14]">{label}</span>
}

export function EditableHomeHero({ primaryTask, primaryRoute, posts, timeSections }: HomeSectionProps) {
  const topPosts = uniquePosts(posts).slice(0, 5)
  const heroPost = topPosts[0]
  const supportPosts = topPosts.slice(1, 4)
  const title = pagesContent.home.hero.title.join(' ')

  return (
    <section className="relative overflow-hidden border-b border-[#6f4c2918] bg-[radial-gradient(circle_at_top_left,rgba(228,214,169,0.95),transparent_28%),linear-gradient(180deg,#f8efdd_0%,#f2e1bc_52%,#f4e8c8_100%)]">
      <div className="pointer-events-none absolute inset-0 opacity-70">
        <div className="absolute -right-20 top-12 h-80 w-80 rounded-full bg-[#995f2f18] blur-3xl" />
        <div className="absolute left-1/4 top-0 h-64 w-64 rounded-full bg-white/40 blur-3xl" />
      </div>
      <div className="relative mx-auto grid max-w-[1520px] gap-10 px-4 py-10 sm:px-6 lg:grid-cols-[1.02fr_0.98fr] lg:gap-12 lg:px-8 lg:py-12">
        <div className="pt-6 lg:py-10">
          <h1 className="mt-6 max-w-4xl text-[clamp(3.2rem,6vw,6.9rem)] font-semibold leading-[0.9] tracking-[-0.08em] text-[#1b100b]">
            <span className="inline-block rounded-[0.35em] bg-[#e4d6a9] px-4 py-1 shadow-[0_12px_40px_rgba(98,43,20,0.08)]">Luxury</span>{' '}
            reading for people who love beautifully made PDFs.
          </h1>
          <p className={`mt-6 max-w-2xl text-lg leading-8 ${pal.mutedText}`}>{pagesContent.home.hero.description}</p>

          <form action="/search" className="mt-8 flex max-w-2xl flex-col gap-3 rounded-[2rem] border border-[#6f4c2920] bg-white p-3 shadow-[0_20px_50px_rgba(54,31,15,0.08)] sm:flex-row">
            <label className="flex flex-1 items-center gap-3 rounded-[1.35rem] bg-[#f8f1de] px-4 py-3">
              <Search className="h-4 w-4 text-[#995f2f]" />
              <input name="q" placeholder="Search documents, reports, guides, or topics" className="min-w-0 flex-1 bg-transparent text-sm font-medium outline-none placeholder:text-[#745846]" />
            </label>
            <button className={dc.button.primary} type="submit">
              Explore archive <ArrowRight className="h-4 w-4" />
            </button>
          </form>

          <div className="mt-6 flex flex-wrap gap-3">
            <Link href={primaryRoute} className={dc.button.secondary}>Browse {taskLabel(primaryTask).toLowerCase()}</Link>
            <Link href="/pdf" className={dc.button.accent}>Open PDF library</Link>
          </div>
        </div>

        <div className="relative lg:py-4">
          <div className="grid gap-4 lg:grid-cols-[1fr_0.82fr]">
            <div className="rounded-[2.4rem] border border-[#6f4c2918] bg-[#24171a] p-4 text-white shadow-[0_24px_90px_rgba(29,15,9,0.28)]">
              <div className="rounded-[2rem] bg-[linear-gradient(180deg,rgba(255,255,255,0.05),rgba(255,255,255,0.02))] p-5">
                <h2 className="mt-4 max-w-lg text-3xl font-semibold leading-[0.96] tracking-[-0.06em]">{getEditableTitle(heroPost) || 'A polished document feature waits here.'}</h2>
                <p className="mt-4 max-w-xl text-sm leading-7 text-white/72">{getEditableExcerpt(heroPost, 170) || 'A refined preview of the latest post, with enough context to make browsing feel calm and premium.'}</p>
              </div>
              <div className="mt-4 grid gap-3 sm:grid-cols-3">
                {supportPosts.map((post, index) => (
                  <div key={post.id} className="rounded-[1.4rem] border border-white/10 bg-white/5 p-3">
                    <div className="aspect-[4/3] overflow-hidden rounded-[1rem] bg-[#4a3030]">
                      <img src={getEditablePostImage(post)} alt={getEditableTitle(post)} className="h-full w-full object-cover" />
                    </div>
                    <p className="mt-3 line-clamp-2 text-xs font-black leading-5">{getEditableTitle(post)}</p>
                    <p className="mt-2 text-[11px] uppercase tracking-[0.18em] text-white/55">0{index + 1}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid gap-4">
              <div className="rounded-[2.2rem] border border-[#6f4c2918] bg-white/82 p-5 shadow-[0_24px_80px_rgba(54,31,15,0.08)] backdrop-blur">
                <p className="text-[11px] font-black uppercase tracking-[0.24em] text-[#995f2f]">Library pulse</p>
                <div className="mt-4 grid gap-3">
                  <div className="rounded-[1.5rem] bg-[#24171a] p-4 text-white">
                    <p className="text-sm font-black uppercase tracking-[0.2em] text-[#e4d6a9]">Focused browsing</p>
                    <p className="mt-2 text-xl font-semibold leading-tight">Search-first blocks, elegant spacing, and a calm reading rhythm.</p>
                  </div>
                  <div className="rounded-[1.5rem] bg-[#f7ecd1] p-4">
                    <p className="text-sm font-black uppercase tracking-[0.2em] text-[#622b14]">Documents on deck</p>
                    <p className="mt-2 text-base leading-7 text-[#6d5745]">Use the archive like a premium shelf, not a generic feed.</p>
                  </div>
                </div>
              </div>
              <div className="overflow-hidden rounded-[2.2rem] border border-[#6f4c2918] bg-white shadow-[0_24px_80px_rgba(54,31,15,0.08)]">
                <img src={getEditablePostImage(heroPost)} alt={getEditableTitle(heroPost)} className="h-[300px] w-full object-cover" />
                <div className="p-5">
                  <p className="text-[11px] font-black uppercase tracking-[0.24em] text-[#995f2f]">Current cover</p>
                  <h3 className="mt-3 text-2xl font-semibold leading-tight tracking-[-0.05em]">{getEditableTitle(heroPost) || 'A document cover appears here.'}</h3>
                </div>
              </div>
            </div>
          </div>

          <Link href={primaryRoute} className="absolute right-4 top-1/2 hidden h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-white text-[#24171a] shadow-[0_16px_40px_rgba(29,15,9,0.24)] lg:flex" aria-label="View library">
            <ArrowRight className="h-5 w-5" />
          </Link>
        </div>
      </div>
    </section>
  )
}

export function EditableStoryRail({ primaryTask, primaryRoute, posts }: HomeSectionProps) {
  const railPosts = uniquePosts(posts).slice(0, 8)
  if (!railPosts.length) return null

  return (
    <section className="border-b border-[#6f4c2912] bg-[linear-gradient(180deg,#f8f1de,#f7edd2)]">
      <div className="mx-auto max-w-[1520px] px-4 py-14 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Curated shelf"
          title="Fresh documents and stories, arranged like a luxury magazine spread."
          description="Switch from wide feature reading to quick-scan cards without losing the editorial feel."
          action={{ label: 'See all documents', href: primaryRoute }}
        />
        <div className="mt-8 flex snap-x gap-5 overflow-x-auto pb-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {railPosts.map((post, index) => <RailPostCard key={post.id} post={post} href={postHref(primaryTask, post, primaryRoute)} index={index} />)}
        </div>
      </div>
    </section>
  )
}

export function EditableMagazineSplit({ primaryTask, primaryRoute, posts }: HomeSectionProps) {
  const featured = uniquePosts(posts).slice(0, 6)
  if (!featured.length) return null

  return (
    <section className="bg-[linear-gradient(180deg,#f7edd2,#f2e1bc)]">
      <div className="mx-auto max-w-[1520px] px-4 py-14 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Editorial blocks"
          title="Different stories deserve different card shapes."
          description="We mix oversized covers, compact notes, and clean list styles to keep the page dynamic and polished."
        />
        <div className="mt-10 grid gap-5 lg:grid-cols-[1.15fr_0.85fr]">
          <EditorialFeatureCard post={featured[0]} href={postHref(primaryTask, featured[0], primaryRoute)} label="Hero feature" />
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
            {featured.slice(1, 3).map((post) => <EditorialSnippetCard key={post.id} post={post} href={postHref(primaryTask, post, primaryRoute)} />)}
          </div>
        </div>
        <div className="mt-5 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {featured.slice(3, 6).map((post, index) => <ImageFirstCard key={post.id} post={post} href={postHref(primaryTask, post, primaryRoute)} />)}
        </div>
      </div>
    </section>
  )
}

export function EditableTimeCollections({ primaryTask, primaryRoute, posts, timeSections }: HomeSectionProps) {
  const collectionPosts = uniquePosts(timeSections.flatMap((section) => section.posts).length ? timeSections.flatMap((section) => section.posts) : posts.slice(8))
  const topStories = collectionPosts.slice(0, 4)
  const listStories = collectionPosts.slice(4, 10)
  const feature = topStories[0] || posts[0]

  return (
    <section className="bg-[linear-gradient(180deg,#f2e1bc,#efe0bd)]">
      <div className="mx-auto max-w-[1520px] px-4 py-14 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Browse by mood"
          title="A clean path through the archive, built for PDF lovers."
          description="Search, filter, and open posts in a layout that keeps the page moving without visual clutter."
          action={{ label: 'Open search', href: '/search' }}
        />
        <div className="mt-10 grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
          {feature ? (
            <Link href={postHref(primaryTask, feature, primaryRoute)} className="group relative overflow-hidden rounded-[2.4rem] bg-[#24171a] text-white shadow-[0_24px_90px_rgba(29,15,9,0.24)]">
              <img src={getEditablePostImage(feature)} alt={getEditableTitle(feature)} className="absolute inset-0 h-full w-full object-cover opacity-60 transition duration-500 group-hover:scale-[1.03]" />
              <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(27,16,11,0.12),rgba(27,16,11,0.88))]" />
              <div className="relative z-10 flex min-h-[460px] flex-col justify-end p-6 sm:p-8">
                <p className="text-[11px] font-black uppercase tracking-[0.26em] text-[#e4d6a9]">Featured stream</p>
                <h3 className="mt-4 max-w-2xl text-4xl font-semibold leading-[0.95] tracking-[-0.06em] sm:text-5xl">{getEditableTitle(feature)}</h3>
                <p className="mt-5 max-w-xl text-sm leading-7 text-white/74">{getEditableExcerpt(feature, 180)}</p>
              </div>
            </Link>
          ) : null}
          <div className="grid gap-4 sm:grid-cols-2">
            {listStories.map((post, index) => <CompactIndexCard key={post.id} post={post} href={postHref(primaryTask, post, primaryRoute)} index={index} />)}
          </div>
        </div>
      </div>
    </section>
  )
}

export function EditableHomeCta() {
  return (
    <section id="get-app" className="bg-[linear-gradient(180deg,#efe0bd,#f8f1de)]">
      <div className="mx-auto max-w-[1520px] px-4 py-14 sm:px-6 lg:px-8 lg:py-16">
        <div className="overflow-hidden rounded-[2.6rem] border border-[#6f4c2918] bg-[#201410] text-white shadow-[0_30px_100px_rgba(29,15,9,0.24)]">
          <div className="grid gap-8 p-6 sm:p-8 lg:grid-cols-[1fr_0.9fr] lg:p-10">
            <div>
              <p className={`${dc.type.eyebrow} text-[#e4d6a9]`}>Start here</p>
              <h2 className="mt-4 max-w-3xl text-4xl font-semibold leading-[0.94] tracking-[-0.06em] sm:text-5xl">All the clarity of a reading app, with the polish of a collector's shelf.</h2>
              <p className="mt-5 max-w-2xl text-base leading-8 text-white/72">Browse articles, PDFs, and supporting pages in a richer editorial system, with fewer distractions and cleaner hierarchy.</p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Link href="/pdf" className={dc.button.accent}>Browse PDF library</Link>
                <Link href="/contact" className={dc.button.secondary}>Ask a question</Link>
              </div>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-[2rem] bg-white/6 p-5">
                <BookOpen className="h-5 w-5 text-[#e4d6a9]" />
                <p className="mt-4 text-lg font-semibold leading-tight">Elegant reading lanes</p>
                <p className="mt-2 text-sm leading-7 text-white/68">Strong spacing, calmer cards, and a premium layout rhythm.</p>
              </div>
              <div className="rounded-[2rem] bg-white/6 p-5">
                <FileText className="h-5 w-5 text-[#e4d6a9]" />
                <p className="mt-4 text-lg font-semibold leading-tight">Document-first browsing</p>
                <p className="mt-2 text-sm leading-7 text-white/68">A design that puts useful files and summaries within easy reach.</p>
              </div>
              <div className="rounded-[2rem] bg-white/6 p-5 sm:col-span-2">
                <Sparkles className="h-5 w-5 text-[#e4d6a9]" />
                <p className="mt-4 text-lg font-semibold leading-tight">Premium but practical</p>
                <p className="mt-2 text-sm leading-7 text-white/68">The page stays fast, responsive, and easy to navigate on mobile and desktop alike.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
