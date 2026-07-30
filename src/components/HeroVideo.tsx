import { Component } from '@geajs/core'

const playbackId = (import.meta.env.VITE_MUX_PLAYBACK_ID ?? '').trim()

const playerParams = new URLSearchParams({
  'metadata-video-title': 'ADVANCE TRAUMA animation',
  'accent-color': '#f6851f',
})

const playerSrc = playbackId
  ? `https://player.mux.com/${encodeURIComponent(playbackId)}?${playerParams.toString()}`
  : ''

export const hasHeroVideo = Boolean(playbackId)

export function playHeroVideo(event: Event) {
  event.preventDefault()
  const frame = document.getElementById('hero-video')
  const iframe = frame?.querySelector('iframe')
  if (!iframe || !playbackId) return

  frame?.scrollIntoView({ behavior: 'smooth', block: 'nearest' })

  const url = new URL(iframe.src || playerSrc)
  url.searchParams.set('autoplay', 'true')
  // Reload with autoplay so playback starts from this user gesture
  iframe.src = url.toString()
}

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
