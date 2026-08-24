import type { MeetingAsset } from '../../lib/tmg'

function assetKindLabel(asset: MeetingAsset): string {
  const role = (asset.role || '').trim().toLowerCase()
  if (role === 'presentation-pdf') return 'Presentation'
  if (asset.role) {
    return asset.role.replace(/[-_]+/g, ' ')
  }
  if (asset.kind === 'markdown') return 'Markdown'
  if (asset.kind === 'html') return 'HTML'
  if (asset.kind === 'pdf') return 'PDF'
  if (asset.kind === 'docx') return 'Word'
  if (asset.kind === 'pptx') return 'Slides'
  return 'File'
}

/** Download row for a file listed in a meeting’s website.json. */
export default function MeetingAssetLink({ asset }: { asset: MeetingAsset }) {
  return (
    <li class="tmg-meeting-files__item">
      <a
        class="tmg-meeting-files__link"
        href={asset.downloadUrl}
        target="_blank"
        rel="noopener noreferrer"
      >
        <span class="tmg-meeting-files__kind">{assetKindLabel(asset)}</span>
        <span>{asset.name}</span>
      </a>
    </li>
  )
}
