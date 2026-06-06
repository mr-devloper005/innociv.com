import type { CSSProperties } from 'react'

export const editableRootStyle = {
  '--slot4-page-bg': '#f4e7c4',
  '--slot4-page-text': '#1b100b',
  '--slot4-panel-bg': '#f7ebca',
  '--slot4-surface-bg': '#fffaf0',
  '--slot4-muted-text': '#6d5745',
  '--slot4-soft-muted-text': '#8a6d55',
  '--slot4-accent': '#995f2f',
  '--slot4-accent-fill': '#622b14',
  '--slot4-accent-soft': '#e4d6a9',
  '--slot4-dark-bg': '#221513',
  '--slot4-dark-text': '#fff8ea',
  '--slot4-media-bg': '#f1e1bc',
  '--slot4-cream': '#fff5dd',
  '--slot4-warm': '#f6e2b9',
  '--slot4-lavender': '#e8d7b8',
  '--slot4-gray': '#f7f2e6',
  '--slot4-body-gradient': 'radial-gradient(circle at top left, rgba(228,214,169,0.7), transparent 42%), radial-gradient(circle at 85% 10%, rgba(153,95,47,0.14), transparent 30%), linear-gradient(180deg, #fbf3d8 0%, #f6e7c4 36%, #f0e3be 68%, #f8f1df 100%)',
} as CSSProperties

export const editablePalette = {
  pageBg: 'bg-[var(--slot4-page-bg)]',
  pageText: 'text-[var(--slot4-page-text)]',
  panelBg: 'bg-[var(--slot4-panel-bg)]',
  panelText: 'text-[var(--slot4-page-text)]',
  surfaceBg: 'bg-[var(--slot4-surface-bg)]',
  surfaceText: 'text-[var(--slot4-page-text)]',
  mutedText: 'text-[var(--slot4-muted-text)]',
  softMutedText: 'text-[var(--slot4-soft-muted-text)]',
  accentText: 'text-[var(--slot4-accent)]',
  accentBg: 'bg-[var(--slot4-accent-fill)]',
  accentSoftBg: 'bg-[var(--slot4-accent-soft)]',
  accentSoftText: 'text-[var(--slot4-accent-soft)]',
  darkBg: 'bg-[var(--slot4-dark-bg)]',
  darkText: 'text-[var(--slot4-dark-text)]',
  mediaBg: 'bg-[var(--slot4-media-bg)]',
  creamBg: 'bg-[var(--slot4-cream)]',
  warmBg: 'bg-[var(--slot4-warm)]',
  lavenderBg: 'bg-[var(--slot4-lavender)]',
  grayBg: 'bg-[var(--slot4-gray)]',
  border: 'border-[#7d5b3622]',
  darkBorder: 'border-white/12',
  shadow: 'shadow-[0_18px_52px_rgba(54,31,15,0.08)]',
  shadowStrong: 'shadow-[0_28px_90px_rgba(29,15,9,0.22)]',
  overlay: 'bg-[linear-gradient(180deg,rgba(27,16,11,0.02),rgba(27,16,11,0.7))]',
} as const

export const editableDesignContract = {
  shell: {
    page: `min-h-screen ${editablePalette.pageBg} ${editablePalette.pageText}`,
    section: 'mx-auto w-full max-w-[1520px] px-4 sm:px-6 lg:px-8',
    sectionY: 'py-14 sm:py-16 lg:py-20',
  },
  layout: {
    safeGrid: 'grid gap-6 md:grid-cols-2 xl:grid-cols-3',
    featureGrid: 'grid gap-12 lg:grid-cols-[1.08fr_0.92fr] lg:items-center',
    rail: 'flex snap-x gap-5 overflow-x-auto pb-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden',
    minRailCard: 'w-[210px] shrink-0 snap-start sm:w-[240px]',
  },
  type: {
    eyebrow: 'text-[11px] font-black uppercase tracking-[0.26em]',
    heroTitle: 'text-4xl font-semibold leading-[0.95] tracking-[-0.06em] sm:text-5xl lg:text-[4.1rem]',
    sectionTitle: 'text-3xl font-semibold leading-[1.02] tracking-[-0.05em] sm:text-4xl lg:text-5xl',
    body: 'text-base leading-relaxed',
  },
  surface: {
    card: `rounded-[1.8rem] border ${editablePalette.border} ${editablePalette.surfaceBg} ${editablePalette.shadow}`,
    soft: `rounded-[1.8rem] border ${editablePalette.border} ${editablePalette.surfaceBg}`,
    dark: `rounded-[2rem] ${editablePalette.darkBg} ${editablePalette.darkText} ${editablePalette.shadowStrong}`,
  },
  button: {
    primary: `inline-flex items-center justify-center gap-2 rounded-full ${editablePalette.darkBg} px-7 py-3 text-sm font-black text-white transition duration-300 hover:-translate-y-0.5 hover:shadow-[0_18px_40px_rgba(27,16,11,0.22)]`,
    secondary: `inline-flex items-center justify-center gap-2 rounded-full border ${editablePalette.border} ${editablePalette.surfaceBg} px-7 py-3 text-sm font-black ${editablePalette.surfaceText} transition duration-300 hover:-translate-y-0.5 hover:bg-black/[0.03]`,
    accent: `inline-flex items-center justify-center gap-2 rounded-full ${editablePalette.accentBg} px-7 py-3 text-sm font-black text-white transition duration-300 hover:-translate-y-0.5 hover:opacity-95`,
  },
  media: {
    frame: `relative overflow-hidden rounded-[1.35rem] ${editablePalette.mediaBg}`,
    ratio: 'aspect-[4/5]',
  },
  motion: {
    lift: 'transition duration-300 hover:-translate-y-1 hover:shadow-[0_22px_64px_rgba(29,15,9,0.16)]',
    fade: 'transition duration-300 hover:opacity-85',
  },
} as const

export const aiLayoutRules = [
  'Change the full site color palette in editableRootStyle first; all homepage sections consume those CSS variables.',
  'Keep page structure in src/editable/sections/HomeSections.tsx so AI can redesign the whole home experience in one file.',
  'Use wide readable grids; never create skinny columns for paragraphs or cards.',
  'Use horizontal rails for dense post browsing, like the MysteryCoder reference layout.',
  'Keep dynamic post fetching intact; do not replace posts with mock arrays.',
  'Use postHref() for all post links so task-specific routes keep working.',
] as const
