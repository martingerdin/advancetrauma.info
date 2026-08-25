import { Store } from '@geajs/core'

class HeroVisibilityStore extends Store {
  inView = true

  private observer?: IntersectionObserver
  private observed?: Element

  watch(element: Element) {
    if (this.observed === element) return
    this.disconnect()

    this.observer = new IntersectionObserver(
      ([entry]) => {
        this.inView = entry.isIntersecting
      },
      {
        threshold: 0,
        rootMargin: '-64px 0px 0px 0px',
      },
    )

    this.observer.observe(element)
    this.observed = element
  }

  disconnect() {
    this.observer?.disconnect()
    this.observer = undefined
    this.observed = undefined
  }
}

export default new HeroVisibilityStore()
