import Link from 'next/link'
import { ArrowRight, Clock3, FileText, LayoutGrid, Sparkles } from 'lucide-react'
import type { SitePost } from '@/lib/site-connector'
import type { TaskKey } from '@/lib/site-config'
import { editableDesignContract as dc, editablePalette as pal } from '@/editable/layouts/design-contract'

function getContent(post?: SitePost | null) {
  return post?.content && typeof post.content === 'object' ? post.content as Record<string, unknown> : {}
}

export function getEditablePostImage(post?: SitePost | null) {
  const media = Array.isArray(post?.media) ? post?.media : []
  const mediaUrl = media.find((item) => typeof item?.url === 'string' && item.url)?.url
  const content = getContent(post)
  const images = Array.isArray(content.images) ? content.images : []
  const contentImage = images.find((url): url is string => typeof url === 'string' && Boolean(url))
  const logo = typeof content.logo === 'string' ? content.logo : ''
  const image = mediaUrl || contentImage || logo || '/placeholder.svg?height=900&width=1400'
  return image
}

export function getEditableExcerpt(post?: SitePost | null, limit = 150) {
  const content = getContent(post)
  const raw =
    (typeof content.description === 'string' && content.description) ||
    (typeof content.summary === 'string' && content.summary) ||
    post?.summary ||
    ''
  const clean = raw.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim()
  return clean.length > limit ? `${clean.slice(0, limit).trim()}...` : clean
}

export function getEditableCategory(post?: SitePost | null) {
  const content = getContent(post)
  return (typeof content.category === 'string' && content.category.trim()) || post?.tags?.[0] || 'Featured'
}

export function getEditableTitle(post?: SitePost | null) {
  return post?.title?.trim() || post?.slug?.trim() || 'Untitled document'
}

export function postHref(task: TaskKey, post: SitePost, route = `/${task}`) {
  return `${route}/${post.slug}`
}

export function EditorialFeatureCard({ post, href, label = 'Featured read' }: { post: SitePost; href: string; label?: string }) {
  const title = getEditableTitle(post)
  return (
    <Link href={href} className={`group block min-w-0 overflow-hidden ${dc.surface.dark} ${dc.motion.lift}`}>
      <div className="relative min-h-[560px] p-6 sm:p-8 lg:min-h-[680px]">
        <img src={getEditablePostImage(post)} alt={title} className="absolute inset-0 h-full w-full object-cover opacity-58 transition duration-500 group-hover:scale-[1.03]" />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(27,16,11,0.12),rgba(27,16,11,0.88))]" />
        <div className="relative z-10 flex h-full min-h-[480px] flex-col justify-end lg:min-h-[600px]">
          <span className={`${dc.type.eyebrow} text-[#e4d6a9]`}>{label}</span>
          <h3 className="mt-5 max-w-3xl text-4xl font-semibold leading-[0.94] tracking-[-0.07em] sm:text-5xl lg:text-6xl">{title}</h3>
          <p className="mt-5 max-w-2xl text-sm leading-8 text-white/74 sm:text-base">{getEditableExcerpt(post, 190) || 'A refined long-form entry with visual context and useful details.'}</p>
          <span className="mt-8 inline-flex w-fit items-center gap-2 rounded-full bg-[#e4d6a9] px-5 py-3 text-sm font-black text-[#24171a]">
            Open feature <ArrowRight className="h-4 w-4" />
          </span>
        </div>
      </div>
    </Link>
  )
}

export function RailPostCard({ post, href, index }: { post: SitePost; href: string; index: number }) {
  const title = getEditableTitle(post)
  return (
    <Link href={href} className={`group ${dc.layout.minRailCard} block overflow-hidden rounded-[1.6rem] border ${pal.border} bg-white ${dc.motion.lift}`}>
      <div className={`${dc.media.frame} ${dc.media.ratio}`}>
        <img src={getEditablePostImage(post)} alt={title} className="absolute inset-0 h-full w-full object-cover transition duration-500 group-hover:scale-105" />
        <span className="absolute left-4 top-4 rounded-full bg-[#24171a]/85 px-3 py-1 text-[10px] font-black uppercase tracking-[0.2em] text-white">No. {String(index + 1).padStart(2, '0')}</span>
      </div>
      <div className="p-4">
        <p className={`${dc.type.eyebrow} text-[#995f2f]`}>{getEditableCategory(post)}</p>
        <h3 className="mt-3 line-clamp-3 text-xl font-semibold leading-tight tracking-[-0.04em] text-[var(--slot4-page-text)]">{title}</h3>
        <p className="mt-3 line-clamp-3 text-sm leading-7 text-[var(--slot4-muted-text)]">{getEditableExcerpt(post, 120)}</p>
      </div>
    </Link>
  )
}

export function CompactIndexCard({ post, href, index }: { post: SitePost; href: string; index: number }) {
  const title = getEditableTitle(post)
  return (
    <Link href={href} className={`group block min-w-0 rounded-[1.5rem] border ${pal.border} bg-[linear-gradient(180deg,#fffaf0,#f7ecd1)] p-5 ${dc.motion.lift}`}>
      <div className="flex items-start gap-4">
        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#24171a] text-xs font-black text-white">{index + 1}</span>
        <div className="min-w-0">
          <p className={`flex items-center gap-2 text-[11px] font-black uppercase tracking-[0.2em] text-[#995f2f]`}><Clock3 className="h-3.5 w-3.5" /> {getEditableCategory(post)}</p>
          <h3 className="mt-2 line-clamp-2 text-xl font-semibold leading-tight tracking-[-0.04em] text-[var(--slot4-page-text)]">{title}</h3>
          <p className="mt-2 line-clamp-2 text-sm leading-6 text-[var(--slot4-muted-text)]">{getEditableExcerpt(post, 105)}</p>
        </div>
      </div>
    </Link>
  )
}

export function ArticleListCard({ post, href, index }: { post: SitePost; href: string; index: number }) {
  const title = getEditableTitle(post)
  const image = getEditablePostImage(post)
  const isImageFirst = index % 3 === 0
  return (
    <Link href={href} className={`group grid min-w-0 gap-5 overflow-hidden rounded-[2rem] border ${pal.border} bg-white p-4 ${dc.motion.lift} ${isImageFirst ? 'md:grid-cols-[1.1fr_0.9fr]' : 'sm:grid-cols-[220px_minmax(0,1fr)]'}`}>
      <div className={`${dc.media.frame} ${isImageFirst ? 'aspect-[16/11] md:order-2' : 'aspect-[16/12] sm:min-h-[190px]'}`}>
        <img src={image} alt={title} className="absolute inset-0 h-full w-full object-cover transition duration-500 group-hover:scale-105" />
        <span className="absolute left-4 top-4 rounded-full bg-white/92 px-3 py-1 text-[10px] font-black uppercase tracking-[0.2em] text-[#24171a]">Read {String(index + 1).padStart(2, '0')}</span>
      </div>
      <div className="min-w-0 p-2 sm:py-4 sm:pr-5">
        <div className="inline-flex items-center gap-2 rounded-full border border-[#995f2f22] bg-[#f7ecd1] px-3 py-1 text-[10px] font-black uppercase tracking-[0.18em] text-[#995f2f]">
          <LayoutGrid className="h-3.5 w-3.5" /> Editorial view
        </div>
        <h2 className="mt-3 line-clamp-3 text-2xl font-semibold leading-tight tracking-[-0.05em] text-[var(--slot4-page-text)] sm:text-3xl">{title}</h2>
        <p className="mt-4 line-clamp-3 text-sm leading-7 text-[var(--slot4-muted-text)]">{getEditableExcerpt(post, 180)}</p>
        <span className="mt-5 inline-flex items-center gap-2 text-sm font-black text-[#622b14]">
          Open article <ArrowRight className="h-4 w-4" />
        </span>
      </div>
    </Link>
  )
}

export function ImageFirstCard({ post, href }: { post: SitePost; href: string }) {
  const title = getEditableTitle(post)
  return (
    <Link href={href} className={`group block overflow-hidden rounded-[2rem] border ${pal.border} bg-white ${dc.motion.lift}`}>
      <div className="relative aspect-[4/5] overflow-hidden bg-[#f2e4bb]">
        <img src={getEditablePostImage(post)} alt={title} className="absolute inset-0 h-full w-full object-cover transition duration-500 group-hover:scale-105" />
        <div className="absolute inset-x-0 bottom-0 bg-[linear-gradient(180deg,transparent,rgba(27,16,11,0.9))] p-5 text-white">
          <p className="text-[11px] font-black uppercase tracking-[0.2em] text-[#e4d6a9]">{getEditableCategory(post)}</p>
          <h3 className="mt-2 line-clamp-3 text-2xl font-semibold leading-tight tracking-[-0.05em]">{title}</h3>
        </div>
      </div>
    </Link>
  )
}

export function EditorialSnippetCard({ post, href }: { post: SitePost; href: string }) {
  const title = getEditableTitle(post)
  return (
    <Link href={href} className={`group flex gap-4 rounded-[1.6rem] border ${pal.border} bg-[linear-gradient(180deg,#fff9ef,#f4e4bf)] p-4 ${dc.motion.lift}`}>
      <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-[1.1rem] bg-[#24171a] text-[#e4d6a9]">
        <Sparkles className="h-7 w-7" />
      </div>
      <div className="min-w-0">
        <p className="text-[11px] font-black uppercase tracking-[0.22em] text-[#995f2f]">{getEditableCategory(post)}</p>
        <h3 className="mt-2 line-clamp-2 text-lg font-semibold leading-tight tracking-[-0.04em] text-[var(--slot4-page-text)]">{title}</h3>
        <p className="mt-2 line-clamp-2 text-sm leading-6 text-[var(--slot4-muted-text)]">{getEditableExcerpt(post, 95)}</p>
      </div>
    </Link>
  )
}
