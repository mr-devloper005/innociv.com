import Link from 'next/link'
import type { CSSProperties } from 'react'
import { ArrowRight, Bookmark, Building2, Camera, Download, FileText, Filter, Image as ImageIcon, MapPin, Megaphone, Search, UserRound } from 'lucide-react'
import { buildTaskMetadata } from '@/lib/seo'
import { CATEGORY_OPTIONS, normalizeCategory } from '@/lib/categories'
import { fetchPaginatedTaskPosts, buildPostUrl } from '@/lib/task-data'
import { getTaskConfig, SITE_CONFIG, type TaskKey } from '@/lib/site-config'
import type { SiteFeedPagination, SitePost } from '@/lib/site-connector'
import { taskPageMetadata } from '@/config/site.content'
import { taskPageVoices } from '@/editable/content/task-pages.content'
import { EditableSiteShell } from '@/editable/shell/EditableSiteShell'
import { getVisualPreset, visualSystem } from '@/editable/theme/visual-system'
import { editableDesignContract as dc } from '@/editable/layouts/design-contract'
import { getEditableExcerpt, getEditablePostImage, getEditableTitle, postHref } from '@/editable/cards/PostCards'

export const revalidate = 3

export const taskMetadata = (task: TaskKey, path: string) =>
  buildTaskMetadata(task, {
    path,
    title: taskPageMetadata[task]?.title,
    description: taskPageMetadata[task]?.description,
  })

const getContent = (post: SitePost) => post.content && typeof post.content === 'object' ? post.content as Record<string, unknown> : {}
const asText = (value: unknown) => typeof value === 'string' ? value.trim() : ''
const isUrl = (value: string) => value.startsWith('/') || /^https?:\/\//i.test(value)

const getImages = (post: SitePost) => {
  const content = getContent(post)
  const media = Array.isArray(post.media) ? post.media.map((item) => item?.url).filter((url): url is string => typeof url === 'string' && isUrl(url)) : []
  const images = Array.isArray(content.images) ? content.images.filter((url): url is string => typeof url === 'string' && isUrl(url)) : []
  const image = asText(content.image) || asText(content.featuredImage) || asText(content.thumbnail)
  const logo = asText(content.logo)
  return [...media, ...images, ...(isUrl(image) ? [image] : []), ...(isUrl(logo) ? [logo] : [])].filter(Boolean).slice(0, 8)
}

const placeholder = '/placeholder.svg?height=900&width=1200'
const getImage = (post: SitePost) => getImages(post)[0] || placeholder
const getCategory = (post: SitePost, fallback: string) => asText(getContent(post).category) || post.tags?.[0] || fallback
const getSummary = (post: SitePost) => post.summary || asText(getContent(post).description) || asText(getContent(post).excerpt) || asText(getContent(post).body) || 'More details appear on the open page.'
const getField = (post: SitePost, keys: string[]) => {
  const content = getContent(post)
  for (const key of keys) {
    const value = asText(content[key])
    if (value) return value
  }
  return ''
}

function pageHref(basePath: string, category: string, page: number) {
  const params = new URLSearchParams()
  if (category && category !== 'all') params.set('category', category)
  if (page > 1) params.set('page', String(page))
  const query = params.toString()
  return query ? `${basePath}?${query}` : basePath
}

const taskDeck: Record<TaskKey, { icon: typeof FileText; archiveClass: string; promise: string; badge: string }> = {
  article: { icon: FileText, archiveClass: 'grid gap-5 md:grid-cols-2 xl:grid-cols-3', promise: 'Magazine-like article cards with stronger headline weight and calmer spacing.', badge: 'Read' },
  listing: { icon: Building2, archiveClass: 'grid gap-5 xl:grid-cols-2', promise: 'Directory cards highlight identity, location, contact cues, and action paths.', badge: 'Business' },
  classified: { icon: Megaphone, archiveClass: 'grid gap-5 xl:grid-cols-2', promise: 'Offer-board cards prioritize price, condition, and quick scan value.', badge: 'Offer' },
  image: { icon: Camera, archiveClass: 'columns-1 gap-5 space-y-5 md:columns-2 xl:columns-3', promise: 'Image-first browsing with a portfolio rhythm and cleaner captions.', badge: 'Gallery' },
  sbm: { icon: Bookmark, archiveClass: 'grid gap-4 md:grid-cols-2 xl:grid-cols-3', promise: 'Saved resources stay text-forward so scanning is quick and clear.', badge: 'Bookmark' },
  pdf: { icon: Download, archiveClass: 'grid gap-5 md:grid-cols-2 xl:grid-cols-3', promise: 'Document cards surface file context, download intent, and summary.', badge: 'PDF' },
  profile: { icon: UserRound, archiveClass: 'grid gap-5 md:grid-cols-2 xl:grid-cols-4', promise: 'Profiles focus on identity, role cues, and discovery-friendly hierarchy.', badge: 'Profile' },
}

export async function EditableTaskArchiveRoute({
  task,
  searchParams,
  basePath,
}: {
  task: TaskKey
  searchParams?: Promise<{ category?: string; page?: string }>
  basePath?: string
}) {
  const resolved = (await searchParams) || {}
  const page = Math.max(1, Math.floor(Number(resolved.page) || 1))
  const category = resolved.category ? normalizeCategory(resolved.category) : 'all'
  const taskConfig = getTaskConfig(task)
  const { posts, pagination } = await fetchPaginatedTaskPosts(task, { page, limit: 24, category })
  return <TaskArchiveView task={task} posts={posts} pagination={pagination} category={category} basePath={basePath || taskConfig?.route || `/${task}`} />
}

export function TaskArchiveView({ task, posts, pagination, category, basePath }: { task: TaskKey; posts: SitePost[]; pagination: SiteFeedPagination; category: string; basePath: string }) {
  const taskConfig = getTaskConfig(task)
  const voice = taskPageVoices[task]
  const preset = getVisualPreset(visualSystem.recommendedPreset as any)
  const page = pagination.page || 1
  const label = taskConfig?.label || task
  const deck = taskDeck[task]
  const Icon = deck.icon
  const categoryLabel = category === 'all' ? 'All categories' : CATEGORY_OPTIONS.find((item) => item.slug === category)?.name || category
  const archiveVars = { '--archive-bg': preset.colors.background, '--archive-text': preset.colors.foreground, '--archive-surface': preset.colors.surface, '--archive-accent': preset.colors.accent } as CSSProperties
  const heroPost = posts[0]
  const compactPosts = posts.slice(1, task === 'image' ? 10 : 8)

  return (
    <EditableSiteShell>
      <main style={archiveVars} className="bg-[var(--archive-bg)] text-[var(--archive-text)]">
        <section className="relative overflow-hidden border-b border-black/[0.06]">
          <div className="pointer-events-none absolute inset-0 opacity-70">
            <div className="absolute -right-20 top-10 h-80 w-80 rounded-full bg-[#e4d6a9]/60 blur-3xl" />
            <div className="absolute left-8 top-32 h-64 w-64 rounded-full bg-white/50 blur-3xl" />
          </div>
          <div className="relative mx-auto grid max-w-[1520px] gap-8 px-4 py-12 sm:px-6 lg:grid-cols-[1.05fr_0.95fr] lg:px-8 lg:py-16">
            <div className="rounded-[2.7rem] border border-[#6f4c2916] bg-[linear-gradient(180deg,rgba(255,250,240,0.96),rgba(247,236,209,0.95))] p-6 shadow-[0_24px_80px_rgba(29,15,9,0.12)] sm:p-8 lg:p-10">
              <div className="inline-flex items-center gap-2 rounded-full border border-[#6f4c2918] bg-white px-4 py-2 text-xs font-black uppercase tracking-[0.24em] text-[#622b14]">
                <Icon className="h-4 w-4" /> {label}
              </div>
              <h1 className="mt-5 max-w-4xl text-5xl font-semibold leading-[0.94] tracking-[-0.07em] sm:text-6xl lg:text-7xl">
                {voice?.headline || `Browse ${label}`}
              </h1>
              <p className="mt-6 max-w-2xl text-base leading-8 text-[var(--slot4-muted-text)]">{voice?.description || SITE_CONFIG.description}</p>
              <div className="mt-6 flex flex-wrap gap-2">
                {voice?.chips?.map((chip) => <span key={chip} className="rounded-full border border-[#995f2f22] bg-white px-4 py-2 text-[11px] font-black uppercase tracking-[0.18em] text-[#622b14]">{chip}</span>)}
              </div>
              <div className="mt-8 rounded-[1.5rem] border border-[#995f2f18] bg-white/80 p-4 text-sm leading-7 text-[var(--slot4-muted-text)]">{deck.promise}</div>
              <div className="mt-8 flex flex-wrap gap-3">
                <Link href={basePath} className={dc.button.primary}>Browse all</Link>
                <Link href="/search" className={dc.button.secondary}>Search archive</Link>
              </div>
            </div>

            <div className="grid gap-4">
              <form action={basePath} className="rounded-[2.4rem] border border-[#6f4c2916] bg-white p-5 shadow-[0_24px_80px_rgba(29,15,9,0.10)]">
                <div className="flex items-center gap-2 text-xs font-black uppercase tracking-[0.2em] text-[#995f2f]"><Filter className="h-4 w-4" /> Filter</div>
                <div className="mt-4 grid gap-3 sm:grid-cols-2">
                  <select name="category" defaultValue={category} className="h-12 rounded-2xl border border-[#995f2f22] bg-[#fffaf0] px-4 text-sm font-black outline-none">
                    <option value="all">All categories</option>
                    {CATEGORY_OPTIONS.map((item) => <option key={item.slug} value={item.slug}>{item.name}</option>)}
                  </select>
                  <button className="h-12 rounded-2xl bg-[#24171a] text-sm font-black text-white transition hover:opacity-95">Apply</button>
                </div>
                <p className="mt-3 text-xs font-black uppercase tracking-[0.16em] text-[#6d5745]">Showing: {categoryLabel}</p>
              </form>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="rounded-[2.2rem] bg-[#24171a] p-5 text-white shadow-[0_24px_80px_rgba(29,15,9,0.24)]">
                  <p className="text-[11px] font-black uppercase tracking-[0.24em] text-[#e4d6a9]">Fast browse</p>
                  <p className="mt-3 text-2xl font-semibold leading-tight">Cards stay readable even when the feed is busy.</p>
                </div>
                <div className="rounded-[2.2rem] bg-[#f7ecd1] p-5">
                  <p className="text-[11px] font-black uppercase tracking-[0.24em] text-[#622b14]">Page state</p>
                  <p className="mt-3 text-2xl font-semibold leading-tight">Page {page} of {pagination.totalPages || 1}</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-[1520px] px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
          {heroPost ? (
            <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
              <Link href={postHref(task, heroPost, basePath)} className="group relative overflow-hidden rounded-[2.6rem] bg-[#24171a] text-white shadow-[0_28px_90px_rgba(29,15,9,0.22)]">
                <img src={getEditablePostImage(heroPost)} alt={getEditableTitle(heroPost)} className="absolute inset-0 h-full w-full object-cover opacity-62 transition duration-500 group-hover:scale-[1.03]" />
                <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(27,16,11,0.08),rgba(27,16,11,0.86))]" />
                <div className="relative z-10 flex min-h-[460px] flex-col justify-end p-6 sm:p-8">
                  <p className="text-[11px] font-black uppercase tracking-[0.26em] text-[#e4d6a9]">Featured {deck.badge}</p>
                  <h2 className="mt-4 max-w-2xl text-4xl font-semibold leading-[0.95] tracking-[-0.06em] sm:text-5xl">{getEditableTitle(heroPost)}</h2>
                  <p className="mt-5 max-w-2xl text-sm leading-7 text-white/74">{getEditableExcerpt(heroPost, 180)}</p>
                </div>
              </Link>
              <div className="grid gap-4 sm:grid-cols-2">
                {compactPosts.slice(0, 4).map((post, index) => (
                  <Link key={post.id || post.slug} href={postHref(task, post, basePath)} className="group overflow-hidden rounded-[2rem] border border-[#6f4c2916] bg-white shadow-[0_16px_50px_rgba(29,15,9,0.08)] transition hover:-translate-y-1">
                    <div className="relative aspect-[4/3] bg-[#f1e1bc]">
                      <img src={getEditablePostImage(post)} alt={getEditableTitle(post)} className="absolute inset-0 h-full w-full object-cover transition duration-500 group-hover:scale-105" />
                    </div>
                    <div className="p-4">
                      <p className="text-[11px] font-black uppercase tracking-[0.2em] text-[#995f2f]">{index % 2 === 0 ? 'Compact' : 'Quick read'}</p>
                      <h3 className="mt-2 line-clamp-2 text-lg font-semibold leading-tight tracking-[-0.04em] text-[var(--slot4-page-text)]">{getEditableTitle(post)}</h3>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          ) : null}

          <div className="mt-10 grid gap-5">
            {posts.length ? (
              <div className={deck.archiveClass}>
                {posts.map((post, index) => <ArchivePostCard key={post.id || post.slug} post={post} task={task} basePath={basePath} index={index} />)}
              </div>
            ) : (
              <div className="rounded-[2.2rem] border border-dashed border-[#995f2f30] bg-white/70 p-10 text-center">
                <Search className="mx-auto h-8 w-8 text-[#995f2f]" />
                <h2 className="mt-4 text-3xl font-semibold tracking-[-0.05em]">No posts found</h2>
                <p className="mt-2 text-sm leading-7 text-[var(--slot4-muted-text)]">Try another category or refresh after publishing new content.</p>
              </div>
            )}

            <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
              {pagination.hasPrevPage ? <Link href={pageHref(basePath, category, page - 1)} className={dc.button.secondary}>Previous</Link> : null}
              <span className={dc.button.primary}>Page {page} of {pagination.totalPages || 1}</span>
              {pagination.hasNextPage ? <Link href={pageHref(basePath, category, page + 1)} className={dc.button.secondary}>Next</Link> : null}
            </div>
          </div>
        </section>
      </main>
    </EditableSiteShell>
  )
}

function ArchivePostCard({ post, task, basePath, index }: { post: SitePost; task: TaskKey; basePath: string; index: number }) {
  const href = `${basePath}/${post.slug}` || buildPostUrl(task, post.slug)
  if (task === 'listing') return <ListingArchiveCard post={post} href={href} />
  if (task === 'classified') return <ClassifiedArchiveCard post={post} href={href} />
  if (task === 'image') return <ImageArchiveCard post={post} href={href} index={index} />
  if (task === 'sbm') return <BookmarkArchiveCard post={post} href={href} index={index} />
  if (task === 'pdf') return <PdfArchiveCard post={post} href={href} />
  if (task === 'profile') return <ProfileArchiveCard post={post} href={href} />
  return <ArticleArchiveCard post={post} href={href} index={index} />
}

function ArticleArchiveCard({ post, href, index }: { post: SitePost; href: string; index: number }) {
  const title = getEditableTitle(post)
  const image = getImage(post)
  const category = getCategory(post, 'Article')
  return (
    <Link href={href} className="group overflow-hidden rounded-[2rem] border border-[#6f4c2916] bg-white shadow-[0_16px_50px_rgba(29,15,9,0.08)] transition hover:-translate-y-1 hover:shadow-[0_24px_70px_rgba(29,15,9,0.14)]">
      <div className="relative aspect-[4/3] overflow-hidden bg-black/5">
        <img src={image} alt={title} className="h-full w-full object-cover transition duration-500 group-hover:scale-105" />
        <span className="absolute left-4 top-4 rounded-full bg-white px-3 py-1 text-[10px] font-black uppercase tracking-[0.2em] text-[#24171a]">{category}</span>
      </div>
      <div className="p-5">
        <p className="text-[10px] font-black uppercase tracking-[0.22em] text-[#995f2f]">Story {String(index + 1).padStart(2, '0')}</p>
        <h2 className="mt-2 text-2xl font-semibold leading-tight tracking-[-0.04em]">{title}</h2>
        <p className="mt-3 line-clamp-3 text-sm leading-7 text-[var(--slot4-muted-text)]">{getSummary(post)}</p>
      </div>
    </Link>
  )
}

function ListingArchiveCard({ post, href }: { post: SitePost; href: string }) {
  const title = getEditableTitle(post)
  const logo = getImages(post)[0]
  const location = getField(post, ['location', 'address', 'city'])
  const phone = getField(post, ['phone', 'telephone', 'mobile'])
  const website = getField(post, ['website', 'url'])
  return (
    <Link href={href} className="group grid gap-5 rounded-[2rem] border border-[#6f4c2916] bg-white p-5 shadow-[0_16px_50px_rgba(29,15,9,0.08)] transition hover:-translate-y-1 hover:shadow-[0_24px_70px_rgba(29,15,9,0.14)] sm:grid-cols-[120px_1fr]">
      <div className="flex h-28 w-28 items-center justify-center overflow-hidden rounded-[1.5rem] bg-[#f7ecd1] ring-1 ring-[#995f2f20]">
        {logo ? <img src={logo} alt={title} className="h-full w-full object-cover" /> : <Building2 className="h-10 w-10 text-[#995f2f]/55" />}
      </div>
      <div className="min-w-0">
        <div className="flex flex-wrap gap-2">
          <span className="rounded-full bg-[#24171a] px-3 py-1 text-[10px] font-black uppercase tracking-[0.18em] text-white">Directory</span>
          {location ? <span className="inline-flex items-center gap-1 rounded-full border border-[#995f2f22] bg-[#fffaf0] px-3 py-1 text-[10px] font-black uppercase tracking-[0.14em] text-[#622b14]"><MapPin className="h-3 w-3" /> {location}</span> : null}
        </div>
        <h2 className="mt-4 text-2xl font-semibold leading-tight tracking-[-0.05em]">{title}</h2>
        <p className="mt-3 line-clamp-2 text-sm leading-7 text-[var(--slot4-muted-text)]">{getSummary(post)}</p>
        <div className="mt-4 grid gap-2 text-xs font-bold uppercase tracking-[0.16em] text-[var(--slot4-muted-text)] sm:grid-cols-2">
          {phone ? <span>Phone: {phone}</span> : null}
          {website ? <span>Website available</span> : null}
        </div>
      </div>
    </Link>
  )
}

function ClassifiedArchiveCard({ post, href }: { post: SitePost; href: string }) {
  const title = getEditableTitle(post)
  const image = getImages(post)[0]
  const price = getField(post, ['price', 'amount', 'budget'])
  const location = getField(post, ['location', 'address', 'city'])
  const condition = getField(post, ['condition', 'type', 'availability'])
  return (
    <Link href={href} className="group overflow-hidden rounded-[2rem] border border-[#6f4c2916] bg-white shadow-[0_16px_50px_rgba(29,15,9,0.08)] transition hover:-translate-y-1 hover:shadow-[0_24px_70px_rgba(29,15,9,0.14)]">
      <div className="grid min-h-64 sm:grid-cols-[0.72fr_1fr]">
        <div className="relative bg-[#24171a] p-5 text-white">
          <span className="rounded-full bg-white/12 px-3 py-1 text-[10px] font-black uppercase tracking-[0.2em]">Classified</span>
          <h2 className="mt-10 text-3xl font-semibold leading-[1] tracking-[-0.07em]">{price || 'Open offer'}</h2>
          <p className="mt-4 text-sm font-bold text-white/72">{location || condition || 'Details inside'}</p>
          {image ? <img src={image} alt={title} className="absolute bottom-4 right-4 h-20 w-20 rounded-2xl object-cover opacity-85" /> : null}
        </div>
        <div className="p-6">
          <h2 className="text-2xl font-semibold leading-tight tracking-[-0.05em]">{title}</h2>
          <p className="mt-4 line-clamp-4 text-sm leading-7 text-[var(--slot4-muted-text)]">{getSummary(post)}</p>
          <p className="mt-6 inline-flex items-center gap-2 text-xs font-black uppercase tracking-[0.16em] text-[#622b14]">View offer <ArrowRight className="h-4 w-4" /></p>
        </div>
      </div>
    </Link>
  )
}

function ImageArchiveCard({ post, href, index }: { post: SitePost; href: string; index: number }) {
  const title = getEditableTitle(post)
  const image = getImage(post)
  return (
    <Link href={href} className="group mb-5 block break-inside-avoid overflow-hidden rounded-[2rem] border border-[#6f4c2916] bg-white shadow-[0_16px_50px_rgba(29,15,9,0.08)] transition hover:-translate-y-1 hover:shadow-[0_24px_70px_rgba(29,15,9,0.14)]">
      <div className={index % 3 === 0 ? 'aspect-[3/4]' : 'aspect-[4/3]'}>
        <img src={image} alt={title} className="h-full w-full object-cover transition duration-500 group-hover:scale-105" />
      </div>
      <div className="p-5">
        <div className="inline-flex items-center gap-2 rounded-full bg-[#f7ecd1] px-3 py-1 text-[10px] font-black uppercase tracking-[0.16em] text-[#622b14]"><ImageIcon className="h-3 w-3" /> Visual</div>
        <h2 className="mt-4 line-clamp-3 text-xl font-semibold leading-tight tracking-[-0.04em]">{title}</h2>
      </div>
    </Link>
  )
}

function BookmarkArchiveCard({ post, href, index }: { post: SitePost; href: string; index: number }) {
  const title = getEditableTitle(post)
  const website = getField(post, ['website', 'url', 'link'])
  return (
    <Link href={href} className="group block rounded-[1.8rem] border border-[#6f4c2916] bg-[linear-gradient(180deg,#fffaf0,#f3e0b9)] p-6 shadow-[0_16px_50px_rgba(29,15,9,0.08)] transition hover:-translate-y-1 hover:bg-[#24171a] hover:text-white">
      <div className="flex items-center justify-between gap-3">
        <span className="rounded-full border border-current/15 px-3 py-1 text-[10px] font-black uppercase tracking-[0.2em]">Save {String(index + 1).padStart(2, '0')}</span>
        <Bookmark className="h-5 w-5" />
      </div>
      <h2 className="mt-8 text-2xl font-semibold leading-tight tracking-[-0.05em]">{title}</h2>
      <p className="mt-4 line-clamp-4 text-sm leading-7 text-current/70">{getSummary(post)}</p>
      {website ? <p className="mt-5 truncate text-xs font-black uppercase tracking-[0.16em] text-current/60">{website.replace(/^https?:\/\//, '')}</p> : null}
    </Link>
  )
}

function PdfArchiveCard({ post, href }: { post: SitePost; href: string }) {
  const title = getEditableTitle(post)
  const category = getCategory(post, 'PDF')
  return (
    <Link href={href} className="group rounded-[2rem] border border-[#6f4c2916] bg-white p-6 shadow-[0_16px_50px_rgba(29,15,9,0.08)] transition hover:-translate-y-1 hover:shadow-[0_24px_70px_rgba(29,15,9,0.14)]">
      <div className="flex items-start justify-between gap-4">
        <div className="rounded-[1.4rem] bg-[#24171a] p-5 text-white"><FileText className="h-8 w-8" /></div>
        <span className="rounded-full bg-[#f7ecd1] px-3 py-1 text-[10px] font-black uppercase tracking-[0.18em] text-[#622b14]">{category}</span>
      </div>
      <h2 className="mt-8 text-2xl font-semibold leading-tight tracking-[-0.05em]">{title}</h2>
      <p className="mt-4 line-clamp-4 text-sm leading-7 text-[var(--slot4-muted-text)]">{getSummary(post)}</p>
      <p className="mt-6 inline-flex items-center gap-2 text-xs font-black uppercase tracking-[0.16em] text-[#622b14]">Open document <Download className="h-4 w-4" /></p>
    </Link>
  )
}

function ProfileArchiveCard({ post, href }: { post: SitePost; href: string }) {
  const title = getEditableTitle(post)
  const avatar = getImages(post)[0]
  const role = getField(post, ['role', 'designation', 'company', 'location'])
  return (
    <Link href={href} className="group rounded-[2rem] border border-[#6f4c2916] bg-white p-6 text-center shadow-[0_16px_50px_rgba(29,15,9,0.08)] transition hover:-translate-y-1 hover:shadow-[0_24px_70px_rgba(29,15,9,0.14)]">
      <div className="mx-auto flex h-28 w-28 items-center justify-center overflow-hidden rounded-full bg-[#f7ecd1] ring-1 ring-[#995f2f20]">
        {avatar ? <img src={avatar} alt={title} className="h-full w-full object-cover" /> : <UserRound className="h-10 w-10 text-[#995f2f]/55" />}
      </div>
      <h2 className="mt-5 text-xl font-semibold leading-tight tracking-[-0.04em]">{title}</h2>
      {role ? <p className="mt-2 text-xs font-black uppercase tracking-[0.16em] text-[#995f2f]">{role}</p> : null}
      <p className="mt-4 line-clamp-3 text-sm leading-7 text-[var(--slot4-muted-text)]">{getSummary(post)}</p>
    </Link>
  )
}
