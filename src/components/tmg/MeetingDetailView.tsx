import { Component } from '@geajs/core'
import type { MeetingAsset, MeetingDetail } from '../../lib/tmg'
import MeetingAssetLink from './MeetingAssetLink'
import MeetingHtml from './MeetingHtml'
import MeetingPresentationLink from './MeetingPresentationLink'

/** Selected TMG meeting heading, rendered notes, and listed files. */
export default class MeetingDetailView extends Component {
  declare props: {
    detail: MeetingDetail
  }

  /** HMR may re-render against a detail object loaded before `presentations` existed. */
  get presentations(): MeetingAsset[] {
    return this.props.detail.presentations ?? []
  }

  get assets(): MeetingAsset[] {
    return this.props.detail.assets ?? []
  }

  get emptyFilesMessage(): string {
    if (this.props.detail.renderedFileName || this.presentations.length > 0 || this.assets.length > 0) {
      return ''
    }
    return 'No website files from this meeting are available yet.'
  }

  template({ detail }: this['props']) {
    return (
      <section class="tmg-meeting-content">
        <div class="tmg-meeting-content__header">
          <div>
            <h2 class="tmg-meeting-content__title">{detail.title}</h2>
            <p class="tmg-meeting-content__meta">{detail.dateLabel}</p>
          </div>
          <a
            class="tmg-meeting-content__folder-link"
            href={detail.repoUrl}
            target="_blank"
            rel="noopener noreferrer"
          >
            Open folder on GitHub
          </a>
        </div>

        {this.presentations.length > 0 ? (
          <div class="tmg-meeting-presentations">
            {this.presentations.map((presentation) => (
              <MeetingPresentationLink key={presentation.downloadUrl} presentation={presentation} />
            ))}
          </div>
        ) : null}

        {this.assets.length > 0 ? (
          <div class="tmg-meeting-files">
            <h3 class="tmg-meeting-files__title">Meeting files</h3>
            <ul class="tmg-meeting-files__list">
              {this.assets.map((asset) => (
                <MeetingAssetLink key={asset.downloadUrl} asset={asset} />
              ))}
            </ul>
          </div>
        ) : null}

        {this.emptyFilesMessage ? (
          <p class="tmg-meeting-content__status">{this.emptyFilesMessage}</p>
        ) : null}

        {detail.renderedFileName ? <MeetingHtml key={detail.id} markup={detail.html} /> : null}
      </section>
    )
  }
}
