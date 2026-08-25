import { marked } from 'marked'
import { escapeHtml } from './escape-html'
import { sanitizeMeetingHtml } from './sanitize-html'

const GITHUB_OWNER = 'martingerdin'
const GITHUB_REPO = 'advance-trauma-trial'
const GITHUB_TREE_API = `https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}/git/trees/main?recursive=1`
const TMG_PREFIX = 'meetings/trial-management-group/'
const WEBSITE_MANIFEST = 'website.json'
/** Cap remote Markdown size before parsing to limit client-side DoS. */
const MAX_CONTENT_BYTES = 512_000

const dateFormatter = new Intl.DateTimeFormat('en-GB', {
  day: 'numeric',
  month: 'short',
  year: 'numeric',
})

const INLINE_CONTENT_FILE = 'content.md'

type GitTreeEntry = {
  path: string
  type: 'blob' | 'tree'
}

type GitTreeResponse = {
  truncated: boolean
  tree: GitTreeEntry[]
}

type WebsiteManifest = {
  title?: string
  date?: string
  files?: unknown
}

export type WebsiteFile = {
  path: string
  role?: string
  /** Display label for the file list; falls back to a humanized role or filename. */
  name?: string
}

export type MeetingSummary = {
  id: string
  title: string
  dateLabel: string
  repoUrl: string
  files: WebsiteFile[]
}

export type MeetingAsset = {
  name: string
  label: string
  kind: 'markdown' | 'html' | 'pdf' | 'docx' | 'pptx' | 'other'
  role?: string
  downloadUrl: string
  repoUrl: string
}

export type MeetingDetail = {
  id: string
  title: string
  dateLabel: string
  repoUrl: string
  html: string
  renderedFileName: string | null
  renderedSourceUrl: string | null
  /** HTML presentations opened via “View presentation” (not listed as downloads). */
  presentations: MeetingAsset[]
  assets: MeetingAsset[]
}

function githubFileUrl(path: string, kind: 'raw' | 'blob' | 'tree'): string {
  const encodedPath = path
    .split('/')
    .map((segment) => encodeURIComponent(segment))
    .join('/')

  if (kind === 'raw') {
    return `https://raw.githubusercontent.com/${GITHUB_OWNER}/${GITHUB_REPO}/main/${encodedPath}`
  }

  return `https://github.com/${GITHUB_OWNER}/${GITHUB_REPO}/${kind}/main/${encodedPath}`
}

function extension(name: string): string {
  const parts = name.toLowerCase().split('.')
  return parts.length > 1 ? parts[parts.length - 1] : ''
}

function assetKind(name: string): MeetingAsset['kind'] {
  const ext = extension(name)
  if (ext === 'md' || ext === 'qmd' || ext === 'markdown') return 'markdown'
  if (ext === 'html' || ext === 'htm') return 'html'
  if (ext === 'pdf') return 'pdf'
  if (ext === 'doc' || ext === 'docx') return 'docx'
  if (ext === 'ppt' || ext === 'pptx') return 'pptx'
  return 'other'
}

function roleKey(role: string | undefined): string {
  return (role || '').trim().toLowerCase()
}

/** HTML decks listed as presentation-web (or presentation*.html). */
export function isWebPresentation(asset: Pick<MeetingAsset, 'name' | 'kind' | 'role'>): boolean {
  const role = roleKey(asset.role)
  if (role === 'presentation-pdf') return false
  if (role === 'presentation-web') return true
  return asset.kind === 'html' && (role.includes('presentation') || /^presentation\./i.test(asset.name))
}

/** HTTPS directory URL so Reveal can resolve `new URL("…", document.baseURI)` (blob: bases throw). */
function presentationBaseHref(rawUrl: string): string {
  const match = rawUrl.match(
    /^https:\/\/raw\.githubusercontent\.com\/([^/]+)\/([^/]+)\/[^/]+\/(.+)\/[^/]+$/,
  )
  if (!match) return 'https://cdn.jsdelivr.net/'

  const [, owner, repo, dir] = match
  return `https://cdn.jsdelivr.net/gh/${owner}/${repo}@main/${dir}/`
}

function withPresentationBase(html: string, baseHref: string): string {
  const tag = `<base href="${baseHref}">`
  if (/<head[^>]*>/i.test(html)) {
    return html.replace(/<head[^>]*>/i, (open) => `${open}${tag}`)
  }
  return `${tag}${html}`
}

/**
 * Open a self-contained HTML presentation in a new tab.
 * GitHub raw serves .html as text/plain, so we fetch and open a text/html blob.
 * A `<base href>` is injected because Reveal resolves plugin paths with
 * `new URL(…, document.baseURI)`, which throws for blob: documents.
 */
export async function openWebPresentation(asset: MeetingAsset): Promise<void> {
  const response = await fetch(asset.downloadUrl)
  if (!response.ok) {
    throw new Error(`Unable to load presentation (${response.status}).`)
  }

  const html = withPresentationBase(await response.text(), presentationBaseHref(asset.downloadUrl))
  const blob = new Blob([html], { type: 'text/html;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const opened = window.open(url, '_blank', 'noopener,noreferrer')
  if (!opened) {
    URL.revokeObjectURL(url)
    throw new Error('Pop-up blocked. Allow pop-ups to view the presentation.')
  }

  window.setTimeout(() => URL.revokeObjectURL(url), 60_000)
}

function humanizeFileLabel(value: string): string {
  return value
    .replace(/[-_]+/g, ' ')
    .trim()
    .replace(/\b\w/g, (char) => char.toUpperCase())
}

function assetLabel(file: WebsiteFile, pathName: string): string {
  if (file.name?.trim()) return file.name.trim()

  const role = (file.role || '').trim().toLowerCase()
  if (role === 'presentation-pdf' || role === 'presentation-web') return 'Presentation'
  if (role === 'content' || role === 'content-pdf') return 'Notes'
  if (file.role?.trim()) return humanizeFileLabel(file.role)
  return humanizeFileLabel(pathName.replace(/\.[^.]+$/, ''))
}

function fileName(path: string): string {
  return path.split('/').pop() ?? path
}

function isInlineContentFile(path: string): boolean {
  return fileName(path).toLowerCase() === INLINE_CONTENT_FILE
}

function formatMeetingDate(value: string | undefined, fallbackId: string): string {
  const isoMatch = value?.match(/^(\d{4})-(\d{2})-(\d{2})/)
  if (isoMatch) {
    const date = new Date(Date.UTC(Number(isoMatch[1]), Number(isoMatch[2]) - 1, Number(isoMatch[3])))
    return dateFormatter.format(date)
  }

  if (/^\d{8}$/.test(fallbackId)) {
    const date = new Date(
      Date.UTC(Number(fallbackId.slice(0, 4)), Number(fallbackId.slice(4, 6)) - 1, Number(fallbackId.slice(6, 8))),
    )
    return dateFormatter.format(date)
  }

  return fallbackId
}

function parseWebsiteFiles(files: unknown): WebsiteFile[] {
  if (!Array.isArray(files)) return []

  return files.flatMap((file) => {
    if (typeof file === 'string' && file.trim()) {
      return [{ path: file.trim() }]
    }

    if (file && typeof file === 'object' && 'path' in file) {
      const path = typeof file.path === 'string' ? file.path.trim() : ''
      if (!path) return []

      const role = 'role' in file && typeof file.role === 'string' ? file.role.trim() : ''
      const name = 'name' in file && typeof file.name === 'string' ? file.name.trim() : ''
      return [{ path, role: role || undefined, name: name || undefined }]
    }

    return []
  })
}

function stripFrontmatter(source: string): string {
  if (!source.startsWith('---\n')) return source

  const end = source.indexOf('\n---\n', 4)
  if (end === -1) return source

  return source.slice(end + 5)
}

function normalizeQuartoMarkdown(source: string): string {
  return stripFrontmatter(source)
    .replace(/\{\.[^}\n]+\}/g, '')
    .replace(/\^([^^\n]+)\^/g, (_match, text: string) => `<sup>${escapeHtml(text)}</sup>`)
}

/** Reject path segments that could escape the meeting folder. */
function isSafeRelativePath(path: string): boolean {
  if (!path || path.startsWith('/') || path.includes('\\') || path.includes('\0')) {
    return false
  }

  return !path.split('/').some((segment) => !segment || segment === '.' || segment === '..')
}

async function fetchJson<T>(url: string): Promise<T> {
  const response = await fetch(url, {
    headers: {
      Accept: 'application/vnd.github+json',
    },
  })

  if (!response.ok) {
    throw new Error(`GitHub request failed (${response.status})`)
  }

  return (await response.json()) as T
}

async function fetchText(url: string): Promise<string> {
  const response = await fetch(url)

  if (!response.ok) {
    throw new Error(`Document request failed (${response.status})`)
  }

  return response.text()
}

let treePromise: Promise<GitTreeResponse> | null = null

function meetingIdFromManifestPath(path: string): string | null {
  const match = path.match(new RegExp(`^${TMG_PREFIX.replaceAll('/', '\\/')}([^/]+)\\/${WEBSITE_MANIFEST}$`))
  return match?.[1] ?? null
}

function getGitTree(): Promise<GitTreeResponse> {
  if (!treePromise) {
    treePromise = fetchJson<GitTreeResponse>(GITHUB_TREE_API).catch((error) => {
      treePromise = null
      throw error
    })
  }

  return treePromise
}

function resolveListedFile(meetingId: string, listedPath: string, blobs: GitTreeEntry[]): GitTreeEntry | undefined {
  const relativePath = listedPath.replace(/^\.\//, '')
  if (!isSafeRelativePath(relativePath)) return undefined

  const meetingRoot = `${TMG_PREFIX}${meetingId}/`
  const fullPath = `${meetingRoot}${relativePath}`
  if (!fullPath.startsWith(meetingRoot)) return undefined

  return blobs.find((entry) => entry.path === fullPath)
}

export async function fetchMeetingIndex(): Promise<MeetingSummary[]> {
  const tree = await getGitTree()
  if (tree.truncated) {
    throw new Error('GitHub file tree was truncated; cannot list TMG meetings.')
  }
  const blobs = tree.tree.filter((entry) => entry.type === 'blob')
  const manifestPaths = blobs
    .map((entry) => entry.path)
    .filter((path) => meetingIdFromManifestPath(path))

  const meetings = await Promise.all(
    manifestPaths.map(async (manifestPath) => {
      const id = meetingIdFromManifestPath(manifestPath)
      if (!id) return null

      const manifest = JSON.parse(await fetchText(githubFileUrl(manifestPath, 'raw'))) as WebsiteManifest

      return {
        id,
        title: manifest.title?.trim() || 'TMG meeting',
        dateLabel: formatMeetingDate(manifest.date, id),
        repoUrl: githubFileUrl(`${TMG_PREFIX}${id}`, 'tree'),
        files: parseWebsiteFiles(manifest.files),
      } satisfies MeetingSummary
    }),
  )

  return meetings
    .filter((meeting): meeting is MeetingSummary => meeting !== null)
    .sort((left, right) => right.id.localeCompare(left.id))
}

export async function fetchMeetingDetail(meeting: MeetingSummary): Promise<MeetingDetail> {
  const tree = await getGitTree()
  const blobs = tree.tree.filter((entry) => entry.type === 'blob')

  const listedAssets = meeting.files.flatMap((file) => {
    const blob = resolveListedFile(meeting.id, file.path, blobs)
    if (!blob) return []

    const name = fileName(file.path)
    return [
      {
        name,
        label: assetLabel(file, name),
        kind: assetKind(name),
        role: file.role,
        downloadUrl: githubFileUrl(blob.path, 'raw'),
        repoUrl: githubFileUrl(blob.path, 'blob'),
      } satisfies MeetingAsset,
    ]
  })

  const contentAsset = listedAssets.find((asset) => isInlineContentFile(asset.name))
  const presentations = listedAssets.filter((asset) => isWebPresentation(asset))
  const assets = listedAssets.filter(
    (asset) => !isInlineContentFile(asset.name) && !isWebPresentation(asset),
  )

  if (!contentAsset) {
    return {
      id: meeting.id,
      title: meeting.title,
      dateLabel: meeting.dateLabel,
      repoUrl: meeting.repoUrl,
      html: '',
      renderedFileName: null,
      renderedSourceUrl: null,
      presentations,
      assets,
    }
  }

  const source = await fetchText(contentAsset.downloadUrl)
  if (new TextEncoder().encode(source).byteLength > MAX_CONTENT_BYTES) {
    throw new Error('Meeting notes are too large to render safely.')
  }

  const rendered = String(marked.parse(normalizeQuartoMarkdown(source), { async: false }))
  const html = sanitizeMeetingHtml(rendered)

  return {
    id: meeting.id,
    title: meeting.title,
    dateLabel: meeting.dateLabel,
    repoUrl: meeting.repoUrl,
    html,
    renderedFileName: contentAsset.name,
    renderedSourceUrl: contentAsset.repoUrl,
    presentations,
    assets,
  }
}
