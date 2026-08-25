import { Component } from '@geajs/core'
import type { AnimationItem } from 'lottie-web'

const lottieReady = import('lottie-web/build/player/lottie_light.js')

function prefersReducedMotion() {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

export default class HeroAtmosphere extends Component {
  private anim: AnimationItem | null = null
  private started = false

  async onAfterRender() {
    if (this.started || !this.el || prefersReducedMotion()) return
    this.started = true

    const [{ default: lottie }, response] = await Promise.all([
      lottieReady,
      fetch('/hero-atmosphere.json'),
    ])
    if (!this.el || !response.ok) return

    const animationData = await response.json()
    if (!this.el) return

    this.anim = lottie.loadAnimation({
      container: this.el,
      renderer: 'svg',
      loop: true,
      autoplay: true,
      animationData,
      rendererSettings: {
        preserveAspectRatio: 'xMidYMid slice',
        progressiveLoad: true,
        viewBoxOnly: true,
      },
    })
  }

  dispose() {
    this.anim?.destroy()
    this.anim = null
    super.dispose()
  }

  template() {
    return <div class="hero__atmosphere" aria-hidden="true"></div>
  }
}
