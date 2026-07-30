import { Component } from '@geajs/core'
import type MuxPlayerElement from '@mux/mux-player'

const playbackId = (import.meta.env.VITE_MUX_PLAYBACK_ID ?? '').trim()

export const hasHeroVideo = Boolean(playbackId)

const muxPlayerReady = hasHeroVideo ? import('@mux/mux-player') : null

function getHeroPlayer(): MuxPlayerElement | null {
  const frame = document.getElementById('hero-video')
  return frame?.querySelector('mux-player') ?? null
}

export function playHeroVideo(event: Event) {
  event.preventDefault()
  const frame = document.getElementById('hero-video')
  const player = getHeroPlayer()
  if (!frame || !player || !playbackId) return

  // Keep play() synchronous with the tap so mobile browsers treat it as a user gesture.
  // Reloading an iframe with ?autoplay=1 breaks that chain and is blocked on mobile.
  frame.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
  void player.play().catch(() => {
    // If playback is blocked, the player is still scrolled into view for a manual tap.
  })
}

export default class HeroVideo extends Component {
  async onAfterRender() {
    if (!playbackId || !muxPlayerReady || !this.el) return

    const frame =
      this.el.id === 'hero-video'
        ? this.el
        : this.el.querySelector<HTMLElement>('#hero-video')
    if (!frame || frame.querySelector('mux-player')) return

    await muxPlayerReady

    if (frame.querySelector('mux-player')) return

    const player = document.createElement('mux-player') as MuxPlayerElement
    player.playbackId = playbackId
    player.setAttribute('metadata-video-title', 'ADVANCE TRAUMA animation')
    player.accentColor = '#f6851f'
    player.playsInline = true
    player.setAttribute('title', 'ADVANCE TRAUMA explainer animation')
    frame.appendChild(player)
  }

  template() {
    return <div class="hero__video" id="hero-video" />
  }
}
