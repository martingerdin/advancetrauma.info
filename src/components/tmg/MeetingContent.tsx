import { Component } from '@geajs/core'
import type { MeetingDetail } from '../../lib/tmg'
import MeetingAssetLink from './MeetingAssetLink'
import MeetingHtml from './MeetingHtml'

export default class MeetingContent extends Component {
  declare props: {
    detail: MeetingDetail | null
    loading: boolean
    errorMessage: string
  }

  template({ detail, loading, errorMessage }: this['props']) {
    if (loading) {
      return (
        <section class="tmg-meeting-content">
          <p class="tmg-meeting-content__status">Loading selected meeting…</p>
        </section>
      )
    }

    if (errorMessage) {
      return (
        <section class="tmg-meeting-content">
          <p class="tmg-meeting-content__status tmg-meeting-content__status--error">
            {errorMessage}
          </p>
        </section>
      )
    }

    if (!detail) {
      return (
        <section class="tmg-meeting-content">
          <p class="tmg-meeting-content__status">Select a meeting to view its updates.</p>
        </section>
      )
    }

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

        {detail.renderedFileName ? <MeetingHtml markup={detail.html} /> : null}

        {detail.assets.length > 0 ? (
          <div class="tmg-meeting-files">
            <h3 class="tmg-meeting-files__title">Meeting files</h3>
            <ul class="tmg-meeting-files__list">
              {detail.assets.map((asset) => (
                <MeetingAssetLink asset={asset} />
              ))}
            </ul>
          </div>
        ) : !detail.renderedFileName ? (
          <p class="tmg-meeting-content__rendered">
            No website files from this meeting are available yet.
          </p>
        ) : null}
      </section>
    )
  }
}
