import { Store } from '@geajs/core'

class NavStore extends Store {
  open = false

  toggle() {
    this.open = !this.open
    document.body.classList.toggle('nav-open', this.open)
  }

  close() {
    if (!this.open) return
    this.open = false
    document.body.classList.remove('nav-open')
  }
}

export default new NavStore()
