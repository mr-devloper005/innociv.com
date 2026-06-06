import { slot4BrandConfig } from '@/editable/theme/brand.config'

export const pagesContent = {
  home: {
    metadata: {
      title: 'A refined home for reading and discovery',
      description: 'Explore PDFs, articles, images, listings, and saved references through a premium editorial layout.',
      openGraphTitle: 'A refined home for reading and discovery',
      openGraphDescription: 'Browse posts and documents through a premium editorial experience built for clarity and calm.',
      keywords: ['document library', 'editorial home', 'premium browsing', 'PDF discovery'],
    },
    hero: {
      badge: 'Curated archive',
      title: ['Luxury reading for', 'documents, stories, and discovery.'],
      description: 'Move through an archive that feels more like a magazine shelf than a feed, with stronger hierarchy and calmer browsing.',
      primaryCta: { label: 'Browse library', href: '/pdf' },
      secondaryCta: { label: 'Explore stories', href: '/article' },
      searchPlaceholder: 'Search documents, titles, categories, or topics',
      focusLabel: 'Focus',
      featureCardBadge: 'featured cover',
      featureCardTitle: 'Recent posts shape the look and rhythm of the archive.',
      featureCardDescription: 'The most relevant documents stay close to the top with a richer, easier-to-scan visual system.',
    },
    intro: {
      badge: 'About the experience',
      title: 'Built for people who enjoy browsing polished pages and useful documents.',
      paragraphs: [
        'The site brings together PDFs, articles, image-led posts, and practical resources in one connected place.',
        'Instead of forcing every post into the same card, the layout shifts to fit the content and keep the page feeling alive.',
        'The result is a more elevated browsing experience that still stays easy to use on mobile and desktop.',
      ],
      sideBadge: 'At a glance',
      sidePoints: [
        'Editorial homepage with stronger visual hierarchy.',
        'Different card styles for different kinds of content.',
        'Cleaner search, navigation, and archive browsing.',
        'Safe fallbacks for missing image, summary, or category fields.',
      ],
      primaryLink: { label: 'Browse PDFs', href: '/pdf' },
      secondaryLink: { label: 'Search site', href: '/search' },
    },
    cta: {
      badge: 'Keep exploring',
      title: 'A premium reading space for useful documents and thoughtful posts.',
      description: 'Browse, search, and open content through a calmer layout that gives the site a more polished identity.',
      primaryCta: { label: 'Open PDF library', href: '/pdf' },
      secondaryCta: { label: 'Contact us', href: '/contact' },
    },
    taskSection: {
      heading: 'Latest {label}',
      descriptionSuffix: 'Fresh posts in this section appear here automatically.',
    },
  },
  about: {
    badge: 'About this site',
    title: 'A refined place to browse PDFs with more calm, clarity, and style.',
    description: `${slot4BrandConfig.siteName} is designed for people who enjoy opening useful documents, scanning ideas quickly, and moving through a library that feels polished instead of crowded.`,
    paragraphs: [
      'The experience is built around readable layouts, generous spacing, and document-first presentation so files feel easier to discover and easier to open.',
      'From the homepage rails to the PDF detail pages, every section aims to keep browsing smooth, elegant, and practical across desktop and mobile screens.',
      'Alongside PDFs, the site can also surface related posts, references, and supporting content in a way that still keeps the document itself at the center.',
    ],
    values: [
      {
        title: 'Document-first browsing',
        description: 'Important files get stronger hierarchy, clearer actions, and layouts that feel built for reading instead of generic posting.',
      },
      {
        title: 'Premium visual rhythm',
        description: 'Warm tones, spacious sections, and varied card styles help the library feel elevated without making it harder to use.',
      },
      {
        title: 'Responsive by default',
        description: 'The layout stays clean on phones, tablets, and larger screens so document discovery remains comfortable everywhere.',
      },
    ],
  },
  contact: {
    eyebrow: `Contact ${slot4BrandConfig.siteName}`,
    title: 'A direct line for questions, publishing help, and general support.',
    description: 'Tell us what you need and we will route it through the right path without making the form feel generic.',
    formTitle: 'Send a message',
  },
  search: {
    metadata: {
      title: 'Search',
      description: 'Search documents, posts, topics, categories, and content across the site.',
    },
    hero: {
      badge: 'Search the archive',
      title: 'Find PDFs, stories, and useful posts faster.',
      description: 'Use keywords, categories, and content types to move through the archive with less friction.',
      placeholder: 'Search by keyword, title, topic, or category',
    },
    resultsTitle: 'Latest searchable content',
  },
  create: {
    metadata: {
      title: 'Create',
      description: 'Create and submit new content for the site.',
    },
    locked: {
      badge: 'Creator access',
      title: 'Login to create new content.',
      description: 'Use your account to open the publishing workspace and create posts for the active sections of the site.',
    },
    hero: {
      badge: 'Publishing workspace',
      title: 'Create content for every active section.',
      description: 'Choose the content type, add details, and prepare a clean post with images, links, summary, and body content.',
    },
    formTitle: 'Content details',
    submitLabel: 'Submit content',
    successTitle: 'Content submitted successfully.',
  },
  auth: {
    login: {
      metadataDescription: 'Login page for this site.',
      badge: 'Member access',
      title: 'Welcome back to your publishing space.',
      description: 'Login to continue browsing, managing submissions, and creating new content from your account.',
      formTitle: 'Login',
      submitLabel: 'Continue',
      noAccount: 'No account matched these details. Create an account first, then login.',
      success: 'Login successful. Redirecting...',
      createCta: 'Create an account',
    },
    signup: {
      metadataDescription: 'Signup page for this site.',
      badge: 'Site access',
      title: 'Create your account and start publishing.',
      description: 'Create an account to access the publishing workspace, save details, and submit content through the site.',
      formTitle: 'Create account',
      submitLabel: 'Create account',
      passwordShort: 'Use at least 4 characters for the password.',
      success: 'Account created successfully. Redirecting...',
      loginCta: 'Login',
    },
  },
  detailPages: {
    article: {
      relatedTitle: 'Related articles',
      fallbackTitle: 'Article details',
    },
    listing: {
      relatedTitle: 'Related listings',
      fallbackTitle: 'Listing details',
    },
    image: {
      relatedTitle: 'Related visuals',
      fallbackTitle: 'Image details',
    },
    profile: {
      relatedTitle: 'Suggested articles',
      fallbackDescription: 'Profile details will appear here once available.',
      visitButton: 'Visit Official Site',
    },
  },
} as const
