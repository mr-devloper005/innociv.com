'use client'

import { Building2, FileText, Image as ImageIcon, Mail, MapPin, Phone, Sparkles, Bookmark } from 'lucide-react'
import { pagesContent } from '@/editable/content/pages.content'
import { getFactoryState } from '@/design/factory/get-factory-state'
import { getProductKind } from '@/design/factory/get-product-kind'
import { EditableContactLeadForm } from '@/editable/components/EditableContactLeadForm'
import { EditableSiteShell } from '@/editable/shell/EditableSiteShell'

function getTone(kind: ReturnType<typeof getProductKind>) {
  if (kind === 'directory') {
    return {
      shell: 'bg-[linear-gradient(180deg,#f7edd2,#efe0bd)] text-[#1b100b]',
      panel: 'border border-[#6f4c2916] bg-white',
      soft: 'border border-[#6f4c2916] bg-[#fffaf0]',
      muted: 'text-[var(--slot4-muted-text)]',
      action: 'bg-[#24171a] text-white hover:opacity-95',
    }
  }
  if (kind === 'editorial') {
    return {
      shell: 'bg-[linear-gradient(180deg,#f7edd2,#efe0bd)] text-[#1b100b]',
      panel: 'border border-[#6f4c2916] bg-white',
      soft: 'border border-[#6f4c2916] bg-[#fffaf0]',
      muted: 'text-[var(--slot4-muted-text)]',
      action: 'bg-[#24171a] text-white hover:opacity-95',
    }
  }
  if (kind === 'visual') {
    return {
      shell: 'bg-[#0f1110] text-white',
      panel: 'border border-white/10 bg-white/6',
      soft: 'border border-white/10 bg-white/5',
      muted: 'text-white/72',
      action: 'bg-[#e4d6a9] text-[#24171a] hover:opacity-95',
    }
  }
  return {
    shell: 'bg-[linear-gradient(180deg,#f7edd2,#efe0bd)] text-[#1b100b]',
    panel: 'border border-[#6f4c2916] bg-white',
    soft: 'border border-[#6f4c2916] bg-[#fffaf0]',
    muted: 'text-[var(--slot4-muted-text)]',
    action: 'bg-[#24171a] text-white hover:opacity-95',
  }
}

export default function ContactPage() {
  const { recipe } = getFactoryState()
  const productKind = getProductKind(recipe)
  const tone = getTone(productKind)

  const lanes =
    productKind === 'directory'
      ? [
          { icon: Building2, title: 'Business onboarding', body: 'Add listings, verify operational details, and bring your business surface live quickly.' },
          { icon: Phone, title: 'Partnership support', body: 'Talk through bulk publishing, local growth, and operational setup questions.' },
          { icon: MapPin, title: 'Coverage requests', body: 'Need a new geography or category lane? We can shape the directory around it.' },
        ]
      : productKind === 'editorial'
        ? [
            { icon: FileText, title: 'Editorial submissions', body: 'Pitch essays, columns, and long-form ideas that fit the publication.' },
            { icon: Mail, title: 'Newsletter partnerships', body: 'Coordinate sponsorships, collaborations, and issue-level campaigns.' },
            { icon: Sparkles, title: 'Contributor support', body: 'Get help with voice, formatting, and publication workflow questions.' },
          ]
        : productKind === 'visual'
          ? [
              { icon: ImageIcon, title: 'Creator collaborations', body: 'Discuss gallery launches, creator features, and visual campaigns.' },
              { icon: Sparkles, title: 'Licensing and use', body: 'Reach out about usage rights, commercial requests, and visual partnerships.' },
              { icon: Mail, title: 'Media kits', body: 'Request creator decks, editorial support, or visual feature placement.' },
            ]
          : [
              { icon: Bookmark, title: 'Collection submissions', body: 'Suggest resources, boards, and links that deserve a place in the library.' },
              { icon: Mail, title: 'Resource partnerships', body: 'Coordinate curation projects, reference pages, and link programs.' },
              { icon: Sparkles, title: 'Curator support', body: 'Need help organizing shelves, collections, or profile-connected boards?' },
            ]

  return (
    <EditableSiteShell className={tone.shell}>
      <main className="mx-auto max-w-[1520px] px-4 py-14 sm:px-6 lg:px-8">
        <section className="grid gap-8 lg:grid-cols-[0.95fr_1.05fr] lg:items-start">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.24em] text-[#995f2f]">{pagesContent.contact.eyebrow}</p>
            <h1 className="mt-4 max-w-2xl text-5xl font-semibold leading-[0.94] tracking-[-0.07em] sm:text-6xl">{pagesContent.contact.title}</h1>
            <p className={`mt-5 max-w-2xl text-base leading-8 ${tone.muted}`}>{pagesContent.contact.description}</p>
            <div className="mt-8 space-y-4">
              {lanes.map((lane) => (
                <div key={lane.title} className={`rounded-[1.8rem] p-5 ${tone.soft}`}>
                  <lane.icon className="h-5 w-5 text-[#995f2f]" />
                  <h2 className="mt-3 text-xl font-semibold tracking-[-0.04em]">{lane.title}</h2>
                  <p className={`mt-2 text-sm leading-7 ${tone.muted}`}>{lane.body}</p>
                </div>
              ))}
            </div>
          </div>

          <div className={`rounded-[2.4rem] p-7 shadow-[0_24px_80px_rgba(29,15,9,0.10)] ${tone.panel}`}>
            <h2 className="text-2xl font-semibold tracking-[-0.04em]">{pagesContent.contact.formTitle}</h2>
            <EditableContactLeadForm />
          </div>
        </section>
      </main>
    </EditableSiteShell>
  )
}
