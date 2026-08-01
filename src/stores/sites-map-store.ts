import { Store } from '@geajs/core'

class SitesMapStore extends Store {
  private focusHandler: ((name: string) => void) | null = null
  private pendingName: string | null = null

  register(handler: (name: string) => void) {
    this.focusHandler = handler
    if (this.pendingName) {
      const name = this.pendingName
      this.pendingName = null
      handler(name)
    }
  }

  unregister(handler: (name: string) => void) {
    if (this.focusHandler === handler) {
      this.focusHandler = null
    }
  }

  /** Scroll the sites map into view and open the matching marker popup. */
  show(name: string) {
    const map = document.querySelector<HTMLElement>('[data-map]')
    map?.scrollIntoView({ behavior: 'smooth', block: 'center' })
    if (this.focusHandler) {
      this.focusHandler(name)
      return
    }
    this.pendingName = name
  }
}

export default new SitesMapStore()
