import { links } from '../data/content'

declare const __SITE_COMMIT_SHA__: string
declare const __SITE_COMMIT_SHORT__: string
declare const __SITE_COMMIT_DATE__: string

const sha = typeof __SITE_COMMIT_SHA__ === 'string' ? __SITE_COMMIT_SHA__ : ''
const shortSha = typeof __SITE_COMMIT_SHORT__ === 'string' ? __SITE_COMMIT_SHORT__ : ''
const isoDate = typeof __SITE_COMMIT_DATE__ === 'string' ? __SITE_COMMIT_DATE__ : ''

const dateLabel = isoDate
  ? new Intl.DateTimeFormat('en-GB', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    }).format(new Date(isoDate))
  : ''

export const siteRevision = {
  sha,
  shortSha,
  isoDate,
  dateLabel,
  href: sha ? `${links.github}/commit/${sha}` : links.github,
  available: Boolean(sha && dateLabel),
}
