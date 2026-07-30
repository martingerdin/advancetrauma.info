import { Component } from '@geajs/core'

const playbackId = (import.meta.env.VITE_MUX_PLAYBACK_ID ?? '').trim()

const playerSrc = playbackId
  ? `https://player.mux.com/${encodeURIComponent(playbackId)}?${new URLSearchParams({
      'metadata-video-title': 'ADVANCE TRAUMA animation',
      'accent-color': '#f6851f',
    }).toString()}`
  : ''

export const hasHeroVideo = Boolean(playbackId)

export default class HeroVideo extends Component {
  template() {
    return (
      <div class="hero__video" id="hero-video">
        <iframe
          src={playerSrc}
          title="ADVANCE TRAUMA explainer animation"
          allow="accelerometer; gyroscope; autoplay; encrypted-media; picture-in-picture;"
          allowfullscreen="true"
        />
      </div>
    )
  }
}
