import Link from 'next/link'
import type { CSSProperties } from 'react'
import { notFound } from 'next/navigation'
import { ArrowLeft, Bookmark, Building2, Camera, CheckCircle2, Download, ExternalLink, FileText, Globe2, Mail, MapPin, MessageCircle, Phone, Tag, UserRound } from 'lucide-react'
import { buildPostMetadata, buildTaskMetadata } from '@/lib/seo'
import { buildPostUrl, fetchArticleComments, fetchTaskPostBySlug, fetchTaskPosts } from '@/lib/task-data'
import { getTaskConfig, SITE_CONFIG, type TaskKey } from '@/lib/site-config'
import type { SitePost } from '@/lib/site-connector'
import { EditableSiteShell } from '@/editable/shell/EditableSiteShell'
import { getVisualPreset, visualSystem } from '@/editable/theme/visual-system'
import { getEditableCategory, getEditableExcerpt, getEditableTitle } from '@/editable/cards/PostCards'
import { ShareButton } from '@/editable/components/ShareButton'

export const revalidate = 3

export async function generateEditableDetailMetadata(task: TaskKey, params: Promise<{ slug?: string; username?: string }>) {
  const resolved = await params
  const slug = resolved.slug || resolved.username || ''
  const post = await fetchTaskPostBySlug(task, slug)
  return post ? await buildPostMetadata(task, post) : await buildTaskMetadata(task)
}

export async function EditableTaskDetailRoute({ task, params }: { task: TaskKey; params: Promise<{ slug?: string; username?: string }> }) {
  const resolved = await params
  const slug = resolved.slug || resolved.username || ''
  const post = await fetchTaskPostBySlug(task, slug)
  if (!post) notFound()
  const related = (await fetchTaskPosts(task, 7)).filter((item) => item.slug !== post.slug).slice(0, 4)
  const comments = task === 'article' ? await fetchArticleComments(post.slug, 50) : []
  return <TaskDetailView task={task} post={post} related={related} comments={comments} />
}

const getContent = (post: SitePost) => post.content && typeof post.content === 'object' ? post.content as Record<string, unknown> : {}
const asText = (value: unknown) => typeof value === 'string' ? value.trim() : ''
const isUrl = (value: string) => value.startsWith('/') || /^https?:\/\//i.test(value)

const getField = (post: SitePost, keys: string[]) => {
  const content = getContent(post)
  for (const key of keys) {
    const value = asText(content[key])
    if (value) return value
  }
  return ''
}

const getImages = (post: SitePost) => {
  const content = getContent(post)
  const media = Array.isArray(post.media) ? post.media.map((item) => item?.url).filter((url): url is string => typeof url === 'string' && isUrl(url)) : []
  const images = Array.isArray(content.images) ? content.images.filter((url): url is string => typeof url === 'string' && isUrl(url)) : []
  const singleImages = ['image', 'featuredImage', 'thumbnail', 'logo', 'avatar'].map((key) => asText(content[key])).filter((url) => url && isUrl(url))
  return [...media, ...images, ...singleImages].filter(Boolean).slice(0, 12)
}

const getBody = (post: SitePost) => {
  const content = getContent(post)
  return asText(content.body) || asText(content.description) || asText(content.details) || post.summary || 'Details will appear here once available.'
}

const escapeHtml = (value: string) => value
  .replace(/&/g, '&amp;')
  .replace(/</g, '&lt;')
  .replace(/>/g, '&gt;')
  .replace(/"/g, '&quot;')
  .replace(/'/g, '&#39;')

const safeUrl = (value: string) => /^https?:\/\//i.test(value) ? value : '#'

const linkifyMarkdown = (value: string) => value
  .replace(/\[([^\]]+)]\((https?:\/\/[^\s)]+)\)/gi, (_match, label, url) => `<a href="${safeUrl(url)}" target="_blank" rel="nofollow noopener noreferrer">${label}</a>`)

const linkifyText = (value: string) => linkifyMarkdown(value)
  .replace(/(^|[\s(>])((https?:\/\/)[^\s<)]+)/gi, (_match, prefix, url) => `${prefix}<a href="${safeUrl(url)}" target="_blank" rel="nofollow noopener noreferrer">${url}</a>`)

const hardenLinks = (html: string) => html.replace(/<a\s+([^>]*href=["'][^"']+["'][^>]*)>/gi, (_match, attrs) => {
  let next = String(attrs).replace(/\s+on\w+=("[^"]*"|'[^']*'|[^\s>]+)/gi, '')
  if (!/\starget=/i.test(next)) next += ' target="_blank"'
  if (!/\srel=/i.test(next)) next += ' rel="nofollow noopener noreferrer"'
  return `<a ${next}>`
})

const sanitizeHtml = (html: string) => hardenLinks(html
  .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')
  .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')
  .replace(/<(iframe|object|embed)[^>]*>[\s\S]*?<\/\1>/gi, '')
  .replace(/\s+on\w+=("[^"]*"|'[^']*'|[^\s>]+)/gi, '')
  .replace(/(href|src)=(['"])javascript:[\s\S]*?\2/gi, '$1="#"'))

const formatPlainText = (raw: string) => {
  const value = raw.trim()
  if (!value) return ''
  if (/<[a-z][\s\S]*>/i.test(value)) return sanitizeHtml(linkifyMarkdown(value))
  return value
    .split(/\n{2,}/)
    .map((part) => `<p>${linkifyText(escapeHtml(part).replace(/\n/g, '<br />'))}</p>`)
    .join('')
}

const summaryText = (post: SitePost) => post.summary || asText(getContent(post).description) || asText(getContent(post).excerpt) || getEditableExcerpt(post, 180)
const categoryOf = (post: SitePost, fallback: string) => getEditableCategory(post) || asText(getContent(post).category) || post.tags?.[0] || fallback
const mapSrcFor = (post: SitePost) => {
  const address = getField(post, ['address', 'location', 'city'])
  const lat = getField(post, ['lat', 'latitude'])
  const lng = getField(post, ['lng', 'lon', 'longitude'])
  if (lat && lng) return `https://maps.google.com/maps?q=${encodeURIComponent(`${lat},${lng}`)}&z=14&output=embed`
  if (address) return `https://maps.google.com/maps?q=${encodeURIComponent(address)}&z=13&output=embed`
  return ''
}

export function TaskDetailView({ task, post, related, comments = [] }: { task: TaskKey; post: SitePost; related: SitePost[]; comments?: Array<{ id: string; name: string; comment: string; createdAt: string }> }) {
  const preset = getVisualPreset(visualSystem.recommendedPreset as any)
  const detailVars = { '--detail-bg': preset.colors.background, '--detail-text': preset.colors.foreground, '--detail-surface': preset.colors.surface, '--detail-accent': preset.colors.accent } as CSSProperties

  return (
    <EditableSiteShell>
      <main style={detailVars} className="bg-[var(--detail-bg)] text-[var(--detail-text)]">
        {task === 'listing' ? <ListingDetail post={post} related={related} /> : null}
        {task === 'classified' ? <ClassifiedDetail post={post} related={related} /> : null}
        {task === 'image' ? <ImageDetail post={post} related={related} /> : null}
        {task === 'sbm' ? <BookmarkDetail post={post} related={related} /> : null}
        {task === 'pdf' ? <PdfDetail post={post} related={related} /> : null}
        {task === 'profile' ? <ProfileDetail post={post} related={related} /> : null}
        {task === 'article' ? <ArticleDetail post={post} related={related} comments={comments} /> : null}
      </main>
    </EditableSiteShell>
  )
}

function BackLink({ task }: { task: TaskKey }) {
  const taskConfig = getTaskConfig(task)
  return (
    <Link href={taskConfig?.route || '/'} className="inline-flex items-center gap-2 rounded-full border border-[#995f2f22] bg-white px-4 py-2 text-sm font-black text-[#24171a] shadow-[0_10px_24px_rgba(29,15,9,0.06)]">
      <ArrowLeft className="h-4 w-4" /> Back to {taskConfig?.label || 'posts'}
    </Link>
  )
}

function ArticleDetail({ post, related, comments }: { post: SitePost; related: SitePost[]; comments: Array<{ id: string; name: string; comment: string; createdAt: string }> }) {
  const images = getImages(post)
  return (
    <section className="mx-auto grid max-w-[1520px] gap-8 px-4 py-10 sm:px-6 lg:grid-cols-[minmax(0,1fr)_360px] lg:px-8 lg:py-16">
      <article className="min-w-0 rounded-[2.7rem] border border-[#6f4c2916] bg-[linear-gradient(180deg,#fffaf0,#f7ecd1)] p-5 shadow-[0_30px_90px_rgba(29,15,9,0.10)] sm:p-8 lg:p-12">
        <BackLink task="article" />
        <div className="mt-8 flex flex-wrap gap-2">
          <span className="rounded-full border border-[#995f2f22] bg-white px-4 py-2 text-[11px] font-black uppercase tracking-[0.2em] text-[#622b14]">{categoryOf(post, 'Article')}</span>
          {post.publishedAt ? <span className="rounded-full border border-[#995f2f22] bg-white px-4 py-2 text-[11px] font-black uppercase tracking-[0.2em] text-[#622b14]">{new Date(post.publishedAt).toLocaleDateString()}</span> : null}
        </div>
        <h1 className="mt-4 max-w-5xl text-4xl font-semibold leading-[0.94] tracking-[-0.07em] sm:text-5xl lg:text-7xl">{getEditableTitle(post)}</h1>
        <p className="mt-5 max-w-3xl text-lg leading-9 text-[var(--slot4-muted-text)]">{summaryText(post)}</p>
        {images[0] ? <img src={images[0]} alt={getEditableTitle(post)} className="mt-8 max-h-[620px] w-full rounded-[2rem] object-cover shadow-[0_22px_64px_rgba(29,15,9,0.12)]" /> : null}
        <BodyContent post={post} />
        <EditableComments slug={post.slug} comments={comments} />
      </article>
      <RelatedPanel task="article" post={post} related={related} />
    </section>
  )
}

function ListingDetail({ post, related }: { post: SitePost; related: SitePost[] }) {
  const images = getImages(post)
  const logo = images[0]
  const address = getField(post, ['address', 'location', 'city'])
  const phone = getField(post, ['phone', 'telephone', 'mobile'])
  const email = getField(post, ['email'])
  const website = getField(post, ['website', 'url'])
  const mapSrc = mapSrcFor(post)
  return (
    <section className="mx-auto max-w-[1520px] px-4 py-10 sm:px-6 lg:px-8 lg:py-16">
      <BackLink task="listing" />
      <div className="mt-8 grid gap-6 lg:grid-cols-[minmax(0,1fr)_420px]">
        <article className="rounded-[2.8rem] border border-[#6f4c2916] bg-white p-6 shadow-[0_30px_90px_rgba(29,15,9,0.10)] sm:p-9">
          <div className="grid gap-6 sm:grid-cols-[150px_1fr]">
            <div className="flex h-36 w-36 items-center justify-center overflow-hidden rounded-[2rem] bg-[#f7ecd1] ring-1 ring-[#995f2f20]">
              {logo ? <img src={logo} alt={getEditableTitle(post)} className="h-full w-full object-cover" /> : <Building2 className="h-14 w-14 text-[#995f2f]/45" />}
            </div>
            <div>
              <p className="text-xs font-black uppercase tracking-[0.28em] text-[#995f2f]">Business listing</p>
              <h1 className="mt-3 text-4xl font-semibold leading-[0.94] tracking-[-0.07em] sm:text-6xl">{getEditableTitle(post)}</h1>
              <p className="mt-5 max-w-3xl text-base leading-8 text-[var(--slot4-muted-text)]">{summaryText(post)}</p>
            </div>
          </div>
          <InfoGrid items={[['Location', address, MapPin], ['Phone', phone, Phone], ['Email', email, Mail], ['Website', website, Globe2]]} />
          <BodyContent post={post} />
          <ImageStrip images={images.slice(1)} label="Business showcase" title={getEditableTitle(post)} />
        </article>
        <aside className="space-y-5">
          {mapSrc ? <MapBox src={mapSrc} label={address || getEditableTitle(post)} /> : <ContactAction website={website} phone={phone} email={email} />}
          {mapSrc ? <ContactAction website={website} phone={phone} email={email} /> : null}
          <RelatedPanel task="listing" post={post} related={related} compact />
        </aside>
      </div>
    </section>
  )
}

function ClassifiedDetail({ post, related }: { post: SitePost; related: SitePost[] }) {
  const images = getImages(post)
  const price = getField(post, ['price', 'amount', 'budget'])
  const location = getField(post, ['location', 'address', 'city'])
  const condition = getField(post, ['condition', 'availability', 'type'])
  const phone = getField(post, ['phone', 'telephone', 'mobile'])
  const email = getField(post, ['email'])
  const website = getField(post, ['website', 'url'])
  return (
    <section className="mx-auto grid max-w-[1520px] gap-7 px-4 py-10 sm:px-6 lg:grid-cols-[0.84fr_1.16fr] lg:px-8 lg:py-16">
      <aside className="rounded-[2.5rem] border border-[#6f4c2916] bg-[#24171a] p-7 text-white shadow-[0_30px_90px_rgba(29,15,9,0.22)] lg:sticky lg:top-24 lg:self-start">
        <BackLink task="classified" />
        <p className="mt-10 text-xs font-black uppercase tracking-[0.28em] text-[#e4d6a9]">Classified notice</p>
        <h1 className="mt-4 text-4xl font-semibold leading-[0.94] tracking-[-0.07em] sm:text-5xl">{getEditableTitle(post)}</h1>
        <div className="mt-8 grid gap-3">
          {price ? <BadgeLine label="Price" value={price} /> : null}
          {condition ? <BadgeLine label="Condition" value={condition} /> : null}
          {location ? <BadgeLine label="Location" value={location} /> : null}
        </div>
        <div className="mt-8 flex flex-wrap gap-3">
          {phone ? <a href={`tel:${phone}`} className="rounded-full bg-[#e4d6a9] px-5 py-3 text-sm font-black text-[#24171a]">Call now</a> : null}
          {email ? <a href={`mailto:${email}`} className="rounded-full border border-white/18 px-5 py-3 text-sm font-black text-white">Email</a> : null}
        </div>
      </aside>
      <article className="rounded-[2.7rem] border border-[#6f4c2916] bg-white p-6 shadow-[0_30px_90px_rgba(29,15,9,0.10)] sm:p-9">
        <ImageStrip images={images} label="Offer images" large title={getEditableTitle(post)} />
        <BodyContent post={post} />
        <ContactAction website={website} phone={phone} email={email} />
        <RelatedPanel task="classified" post={post} related={related} />
      </article>
    </section>
  )
}

function ImageDetail({ post, related }: { post: SitePost; related: SitePost[] }) {
  const images = getImages(post)
  return (
    <section className="mx-auto max-w-[1520px] px-4 py-10 sm:px-6 lg:px-8 lg:py-16">
      <BackLink task="image" />
      <div className="mt-8 grid gap-8 lg:grid-cols-[0.72fr_1.28fr]">
        <aside className="rounded-[2.5rem] border border-[#6f4c2916] bg-white p-7 shadow-[0_30px_90px_rgba(29,15,9,0.10)] lg:sticky lg:top-24 lg:self-start">
          <div className="inline-flex items-center gap-2 rounded-full bg-[#24171a] px-4 py-2 text-xs font-black uppercase tracking-[0.2em] text-[#e4d6a9]"><Camera className="h-4 w-4" /> Image story</div>
          <h1 className="mt-6 text-4xl font-semibold leading-[0.94] tracking-[-0.07em] sm:text-5xl">{getEditableTitle(post)}</h1>
          <p className="mt-5 text-base leading-8 text-[var(--slot4-muted-text)]">{summaryText(post)}</p>
          <BodyContent post={post} compact />
        </aside>
        <div className="columns-1 gap-5 space-y-5 md:columns-2">
          {(images.length ? images : ['/placeholder.svg?height=900&width=1200']).map((image, index) => (
            <figure key={`${image}-${index}`} className="break-inside-avoid overflow-hidden rounded-[2rem] border border-[#6f4c2916] bg-white shadow-[0_16px_50px_rgba(29,15,9,0.08)]">
              <img src={image} alt={getEditableTitle(post)} className="w-full object-cover" />
              {index === 0 ? <figcaption className="p-5 text-sm font-bold text-[var(--slot4-muted-text)]">Featured visual from this image post.</figcaption> : null}
            </figure>
          ))}
        </div>
      </div>
      <div className="mt-10"><RelatedPanel task="image" post={post} related={related} /></div>
    </section>
  )
}

function BookmarkDetail({ post, related }: { post: SitePost; related: SitePost[] }) {
  const website = getField(post, ['website', 'url', 'link'])
  return (
    <section className="mx-auto grid max-w-[1520px] gap-8 px-4 py-10 sm:px-6 lg:grid-cols-[minmax(0,1fr)_360px] lg:px-8 lg:py-16">
      <article className="rounded-[2.7rem] border border-[#6f4c2916] bg-white p-7 shadow-[0_30px_90px_rgba(29,15,9,0.10)] sm:p-10">
        <BackLink task="sbm" />
        <div className="mt-10 flex h-20 w-20 items-center justify-center rounded-[2rem] bg-[#24171a] text-[#e4d6a9]"><Bookmark className="h-9 w-9" /></div>
        <h1 className="mt-7 text-4xl font-semibold leading-[0.94] tracking-[-0.07em] sm:text-6xl">{getEditableTitle(post)}</h1>
        <p className="mt-5 max-w-3xl text-lg leading-9 text-[var(--slot4-muted-text)]">{summaryText(post)}</p>
        {website ? <Link href={website} target="_blank" rel="noreferrer" className="mt-8 inline-flex items-center gap-2 rounded-full bg-[#24171a] px-5 py-3 text-sm font-black text-white">Open saved resource <ExternalLink className="h-4 w-4" /></Link> : null}
        <BodyContent post={post} />
      </article>
      <RelatedPanel task="sbm" post={post} related={related} />
    </section>
  )
}

function PdfDetail({ post, related }: { post: SitePost; related: SitePost[] }) {
  const fileUrl = getField(post, ['fileUrl', 'pdfUrl', 'documentUrl', 'url'])
  const images = getImages(post)
  return (
    <section className="mx-auto max-w-[1520px] px-4 py-10 sm:px-6 lg:px-8 lg:py-16">
      <div className="grid gap-8 xl:grid-cols-[minmax(0,1.16fr)_360px]">
        <article className="overflow-hidden rounded-[2.8rem] border border-[#6f4c2916] bg-[linear-gradient(180deg,#fffaf0,#f7ecd1)] shadow-[0_30px_90px_rgba(29,15,9,0.10)]">
          <div className="border-b border-[#6f4c2916] px-6 py-6 sm:px-8 lg:px-10 lg:py-8">
            <BackLink task="pdf" />
          </div>

          <div className="grid gap-7 px-6 py-6 sm:px-8 lg:px-10 lg:py-10">
            <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_300px] xl:grid-cols-[minmax(0,1fr)_340px]">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.28em] text-[#995f2f]">Document library</p>
                <h1 className="mt-4 max-w-4xl text-4xl font-semibold leading-[0.92] tracking-[-0.07em] sm:text-6xl">{getEditableTitle(post)}</h1>

                <div className="mt-7 flex flex-wrap gap-3">
                  <span className="rounded-full border border-[#995f2f22] bg-white px-4 py-2 text-[11px] font-black uppercase tracking-[0.18em] text-[#622b14]">{categoryOf(post, 'PDF')}</span>
                  <span className="rounded-full border border-[#995f2f22] bg-white px-4 py-2 text-[11px] font-black uppercase tracking-[0.18em] text-[#622b14]">Reader-friendly</span>
                  <span className="rounded-full border border-[#995f2f22] bg-white px-4 py-2 text-[11px] font-black uppercase tracking-[0.18em] text-[#622b14]">Copy link ready</span>
                </div>

                <div className="mt-8 flex flex-wrap gap-3">
                  {fileUrl ? <Link href={fileUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-full bg-[#24171a] px-5 py-3 text-sm font-black text-white">Download <Download className="h-4 w-4" /></Link> : null}
                  <ShareButton className="bg-[#fffaf0]" />
                </div>
              </div>

              <div className="grid gap-4 self-start">
                <div className="rounded-[2rem] bg-[#24171a] p-5 text-white shadow-[0_20px_60px_rgba(29,15,9,0.20)]">
                  <p className="text-[11px] font-black uppercase tracking-[0.26em] text-[#e4d6a9]">Quick scan</p>
                  <div className="mt-4 grid gap-3 text-sm leading-7 text-white/76">
                    <p className="inline-flex items-center gap-2"><Tag className="h-4 w-4 text-[#e4d6a9]" /> {categoryOf(post, 'PDF')}</p>
                    <p className="inline-flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-[#e4d6a9]" /> {SITE_CONFIG.name}</p>
                    <p className="inline-flex items-center gap-2"><Download className="h-4 w-4 text-[#e4d6a9]" /> Download-ready preview</p>
                  </div>
                </div>

                <div className="rounded-[2rem] border border-[#995f2f22] bg-white p-5 shadow-[0_16px_50px_rgba(29,15,9,0.08)]">
                  <p className="text-[11px] font-black uppercase tracking-[0.24em] text-[#995f2f]">Why this works</p>
                  <p className="mt-4 text-sm leading-7 text-[var(--slot4-muted-text)]">The page now gives the document proper stage space, stronger hierarchy, and a cleaner side rail so the preview feels like the main event.</p>
                </div>
              </div>
            </div>

            <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_300px] xl:grid-cols-[minmax(0,1fr)_340px]">
              <div className="overflow-hidden rounded-[2.3rem] border border-[#6f4c2916] bg-white shadow-[0_24px_80px_rgba(29,15,9,0.08)]">
                <div className="flex items-center justify-between border-b border-[#6f4c2916] bg-[#fffaf0] px-4 py-3">
                  <span className="text-sm font-black">Preview window</span>
                  {fileUrl ? <span className="text-[11px] font-black uppercase tracking-[0.18em] text-[#995f2f]">Live document</span> : null}
                </div>
                {fileUrl ? (
                  <iframe src={`${fileUrl}#toolbar=0&navpanes=0&scrollbar=0`} title={getEditableTitle(post)} className="h-[74vh] min-h-[38rem] w-full border-0" />
                ) : (
                  <div className="grid gap-6 p-6 lg:grid-cols-[1fr_320px]">
                    <div>
                      <BodyContent post={post} />
                    </div>
                    <div className="rounded-[2rem] bg-[#24171a] p-5 text-white">
                      <p className="text-[11px] font-black uppercase tracking-[0.26em] text-[#e4d6a9]">Preview unavailable</p>
                      <p className="mt-4 text-sm leading-7 text-white/76">This entry does not expose a direct PDF file, so the page falls back to the written summary and supporting content.</p>
                    </div>
                  </div>
                )}
              </div>

              <div className="grid gap-4 self-start">
                <div className="overflow-hidden rounded-[2.2rem] border border-[#6f4c2916] bg-white shadow-[0_24px_80px_rgba(29,15,9,0.08)]">
                  <div className="flex items-center justify-between border-b border-[#6f4c2916] bg-[#fffaf0] px-4 py-3">
                    <span className="text-sm font-black">Document cover</span>
                    {fileUrl ? <Link href={fileUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-full border border-[#995f2f22] bg-white px-3 py-2 text-xs font-black text-[#622b14]">Open file</Link> : null}
                  </div>
                  {images[0] ? (
                    <img src={images[0]} alt={getEditableTitle(post)} className="h-[22rem] w-full object-cover" />
                  ) : (
                    <div className="flex h-[22rem] items-center justify-center bg-[linear-gradient(180deg,#f6ead3,#ead7a8)]">
                      <div className="flex h-28 w-28 items-center justify-center rounded-[2rem] bg-[#24171a] text-[#e4d6a9]"><FileText className="h-12 w-12" /></div>
                    </div>
                  )}
                </div>

                <div className="rounded-[2rem] border border-[#995f2f22] bg-[linear-gradient(180deg,#fffdf6,#f8edd2)] p-5 shadow-[0_16px_50px_rgba(29,15,9,0.06)]">
                  <p className="text-[11px] font-black uppercase tracking-[0.24em] text-[#995f2f]">Reader note</p>
                  <p className="mt-4 text-sm leading-7 text-[var(--slot4-muted-text)]">Built for browsing without clutter: title first, action row second, and a large uninterrupted reading area below.</p>
                </div>
              </div>
            </div>
          </div>
        </article>

        <aside className="space-y-5 xl:sticky xl:top-24 xl:self-start">
          <div className="rounded-[2.2rem] border border-[#6f4c2916] bg-[#24171a] p-6 text-white shadow-[0_24px_80px_rgba(29,15,9,0.22)]">
            <p className="text-[11px] font-black uppercase tracking-[0.26em] text-[#e4d6a9]">Document details</p>
            <div className="mt-5 grid gap-3 text-sm leading-7 text-white/76">
              <p className="inline-flex items-center gap-2"><Tag className="h-4 w-4" /> {categoryOf(post, 'PDF')}</p>
              <p className="inline-flex items-center gap-2"><CheckCircle2 className="h-4 w-4" /> {SITE_CONFIG.name}</p>
              <p className="inline-flex items-center gap-2"><Download className="h-4 w-4" /> Share and download ready</p>
            </div>
          </div>
          <RelatedPanel task="pdf" post={post} related={related} compact />
        </aside>
      </div>
    </section>
  )
}

function ProfileDetail({ post, related }: { post: SitePost; related: SitePost[] }) {
  const images = getImages(post)
  const role = getField(post, ['role', 'designation', 'company', 'location'])
  const website = getField(post, ['website', 'url'])
  const email = getField(post, ['email'])
  return (
    <section className="mx-auto grid max-w-[1520px] gap-8 px-4 py-10 sm:px-6 lg:grid-cols-[420px_minmax(0,1fr)] lg:px-8 lg:py-16">
      <aside className="rounded-[2.7rem] border border-[#6f4c2916] bg-white p-8 text-center shadow-[0_30px_90px_rgba(29,15,9,0.10)] lg:sticky lg:top-24 lg:self-start">
        <BackLink task="profile" />
        <div className="mx-auto mt-10 flex h-40 w-40 items-center justify-center overflow-hidden rounded-full bg-[#f7ecd1] ring-1 ring-[#995f2f20]">
          {images[0] ? <img src={images[0]} alt={getEditableTitle(post)} className="h-full w-full object-cover" /> : <UserRound className="h-16 w-16 text-[#995f2f]/45" />}
        </div>
        <h1 className="mt-6 text-4xl font-semibold leading-[0.94] tracking-[-0.07em]">{getEditableTitle(post)}</h1>
        {role ? <p className="mt-3 text-xs font-black uppercase tracking-[0.18em] text-[#995f2f]">{role}</p> : null}
        <ContactAction website={website} email={email} />
      </aside>
      <article className="rounded-[2.7rem] border border-[#6f4c2916] bg-white p-7 shadow-[0_30px_90px_rgba(29,15,9,0.10)] sm:p-10">
        <BodyContent post={post} />
        <ImageStrip images={images.slice(1)} label="Profile gallery" title={getEditableTitle(post)} />
        <RelatedPanel task="profile" post={post} related={related} />
      </article>
    </section>
  )
}

function BodyContent({ post, compact = false }: { post: SitePost; compact?: boolean }) {
  return <div className={`article-content mt-8 max-w-none ${compact ? 'text-base leading-8' : 'text-lg leading-9'} text-[var(--slot4-page-text)]/88`} dangerouslySetInnerHTML={{ __html: formatPlainText(getBody(post)) }} />
}

function InfoGrid({ items }: { items: Array<[string, string, typeof MapPin]> }) {
  const visible = items.filter(([, value]) => value)
  if (!visible.length) return null
  return (
    <div className="mt-8 grid gap-3 sm:grid-cols-2">
      {visible.map(([label, value, Icon]) => (
        <div key={label} className="rounded-[1.5rem] border border-[#995f2f22] bg-[#fffaf0] p-4">
          <div className="flex items-center gap-2 text-xs font-black uppercase tracking-[0.16em] text-[#995f2f]"><Icon className="h-4 w-4" /> {label}</div>
          <p className="mt-2 break-words text-sm font-bold leading-6 text-[var(--slot4-page-text)]/86">{value}</p>
        </div>
      ))}
    </div>
  )
}

function ImageStrip({ images, label, large = false, title }: { images: string[]; label: string; large?: boolean; title?: string }) {
  if (!images.length) return null
  return (
    <section className="mt-8">
      <p className="text-xs font-black uppercase tracking-[0.22em] text-[#995f2f]">{label}</p>
      <div className={`mt-4 grid gap-3 ${large ? 'sm:grid-cols-2' : 'grid-cols-2 sm:grid-cols-4'}`}>
        {images.slice(0, large ? 4 : 8).map((image, index) => <img key={`${image}-${index}`} src={image} alt={title || 'Post image'} className="aspect-[4/3] rounded-[1.4rem] object-cover ring-1 ring-[#995f2f20]" />)}
      </div>
    </section>
  )
}

function MapBox({ src, label }: { src: string; label: string }) {
  return (
    <div className="overflow-hidden rounded-[2rem] border border-[#6f4c2916] bg-white shadow-[0_16px_50px_rgba(29,15,9,0.08)]">
      <div className="flex items-center gap-2 p-4 text-sm font-black"><MapPin className="h-4 w-4" /> {label || 'Map location'}</div>
      <iframe src={src} title="Map" loading="lazy" className="h-80 w-full border-0" />
    </div>
  )
}

function ContactAction({ website, phone, email }: { website?: string; phone?: string; email?: string }) {
  if (!website && !phone && !email) return null
  return (
    <div className="mt-5 rounded-[2rem] border border-[#6f4c2916] bg-[#fffaf0] p-5 shadow-[0_16px_50px_rgba(29,15,9,0.08)]">
      <p className="text-xs font-black uppercase tracking-[0.22em] text-[#995f2f]">Quick actions</p>
      <div className="mt-4 flex flex-wrap gap-3">
        {website ? <Link href={website} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-full bg-[#24171a] px-4 py-2 text-sm font-black text-white">Website <ExternalLink className="h-4 w-4" /></Link> : null}
        {phone ? <a href={`tel:${phone}`} className="inline-flex items-center gap-2 rounded-full border border-[#995f2f22] bg-white px-4 py-2 text-sm font-black text-[#24171a]"><Phone className="h-4 w-4" /> Call</a> : null}
        {email ? <a href={`mailto:${email}`} className="inline-flex items-center gap-2 rounded-full border border-[#995f2f22] bg-white px-4 py-2 text-sm font-black text-[#24171a]"><Mail className="h-4 w-4" /> Email</a> : null}
      </div>
    </div>
  )
}

function BadgeLine({ label, value }: { label: string; value: string }) {
  return <div className="flex items-center justify-between gap-4 rounded-2xl border border-white/12 bg-white/6 px-4 py-3 text-sm"><span className="font-black uppercase tracking-[0.16em] text-white/55">{label}</span><span className="font-black">{value}</span></div>
}

function RelatedPanel({ task, post, related, compact = false }: { task: TaskKey; post: SitePost; related: SitePost[]; compact?: boolean }) {
  const taskConfig = getTaskConfig(task)
  return (
    <aside className="min-w-0 space-y-5">
      {!compact ? (
        <div className="rounded-[2rem] border border-[#6f4c2916] bg-white/75 p-5 shadow-[0_16px_50px_rgba(29,15,9,0.08)] backdrop-blur">
          <p className="text-xs font-black uppercase tracking-[0.22em] text-[#995f2f]">About this post</p>
          <div className="mt-4 grid gap-3 text-sm font-bold text-[var(--slot4-muted-text)]">
            <p className="inline-flex items-center gap-2"><Tag className="h-4 w-4" /> Task: {taskConfig?.label || task}</p>
            <p className="inline-flex items-center gap-2"><CheckCircle2 className="h-4 w-4" /> Site: {SITE_CONFIG.name}</p>
          </div>
        </div>
      ) : null}
      {related.length ? (
        <div className="rounded-[2rem] border border-[#6f4c2916] bg-white/75 p-5 shadow-[0_16px_50px_rgba(29,15,9,0.08)] backdrop-blur">
          <div className="flex items-center justify-between gap-3">
            <h2 className="text-lg font-semibold tracking-[-0.04em]">More like this</h2>
            <Link href={taskConfig?.route || '/'} className="text-xs font-black uppercase tracking-[0.16em] text-[#995f2f]">View all</Link>
          </div>
          <div className="mt-5 grid gap-3">
            {related.map((item) => <RelatedCard key={item.id || item.slug} task={task} post={item} />)}
          </div>
        </div>
      ) : null}
    </aside>
  )
}

function RelatedCard({ task, post }: { task: TaskKey; post: SitePost }) {
  const title = getEditableTitle(post)
  const image = getImages(post)[0]
  return (
    <Link href={buildPostUrl(task, post.slug)} className="group flex gap-3 rounded-2xl border border-[#995f2f20] bg-white p-3 transition hover:-translate-y-0.5 hover:shadow-[0_18px_48px_rgba(29,15,9,0.14)]">
      {image && task !== 'sbm' ? <img src={image} alt={title} className="h-20 w-20 shrink-0 rounded-xl object-cover" /> : <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-xl bg-[#f7ecd1]"><FileText className="h-6 w-6 text-[#995f2f]/55" /></div>}
      <div className="min-w-0">
        <h3 className="line-clamp-3 text-sm font-black leading-tight tracking-[-0.03em]">{title}</h3>
        <p className="mt-2 line-clamp-2 text-xs leading-5 text-[var(--slot4-muted-text)]">{summaryText(post)}</p>
      </div>
    </Link>
  )
}

function EditableComments({ slug, comments }: { slug: string; comments: Array<{ id: string; name: string; comment: string; createdAt: string }> }) {
  return (
    <section className="mt-10 rounded-[2rem] border border-[#995f2f22] bg-[#24171a] p-5 text-white shadow-[0_16px_50px_rgba(29,15,9,0.18)]">
      <div className="flex items-center gap-2 text-lg font-semibold"><MessageCircle className="h-5 w-5 text-[#e4d6a9]" /> Comments</div>
      <div className="mt-5 grid gap-3">
        {comments.slice(0, 5).map((comment) => (
          <div key={comment.id} className="rounded-2xl border border-white/10 bg-white/5 p-4">
            <p className="text-sm font-black">{comment.name}</p>
            <p className="mt-2 text-sm leading-7 text-white/76">{comment.comment}</p>
          </div>
        ))}
        {!comments.length ? <p className="text-sm text-white/58">No comments yet for {slug}.</p> : null}
      </div>
    </section>
  )
}
