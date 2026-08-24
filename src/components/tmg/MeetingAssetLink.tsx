import { Component } from '@geajs/core'
import type { MeetingAsset } from '../../lib/tmg'

function assetKindLabel(asset: MeetingAsset): string {
  if (asset.role) {
    return asset.role.replace(/[-_]+/g, ' ')
  }
  if (asset.kind === 'markdown') return 'Markdown'
  if (asset.kind === 'pdf') return 'PDF'
  if (asset.kind === 'docx') return 'Word'
  if (asset.kind === 'pptx') return 'Slides'
  return 'File'
}

export default class MeetingAssetLink extends Component {
  declare props: {
    asset: MeetingAsset
  }

  template({ asset }: this['props']) {
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
}
