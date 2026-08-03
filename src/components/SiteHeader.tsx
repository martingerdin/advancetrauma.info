import { Component } from '@geajs/core'
import { scrollToSection } from '../lib/scroll-to-section'
import navStore from '../stores/nav-store'

function goToSection(event: Event, id: string) {
  navStore.close()
  scrollToSection(event, id)
}

export default class SiteHeader extends Component {
  onAfterRender() {
    if (this.el?.dataset.navBound) return
    this.el!.dataset.navBound = 'true'

    this.onKeydown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') navStore.close()
    }
    window.addEventListener('keydown', this.onKeydown)
  }

  dispose() {
    if (this.onKeydown) {
      window.removeEventListener('keydown', this.onKeydown)
    }
    navStore.close()
    super.dispose()
  }

  private onKeydown?: (event: KeyboardEvent) => void

  template() {
    return (
      <header class={navStore.open ? 'site-header site-header--open' : 'site-header'}>
        <div class="site-header__inner">
          <a class="site-header__brand" href="/" click={() => navStore.close()}>
            <span>ADVANCE TRAUMA</span>
          </a>

          <button
            type="button"
            class="site-header__menu-btn"
            aria-expanded={navStore.open ? 'true' : 'false'}
            aria-controls="site-nav"
            click={() => navStore.toggle()}
          >
            <span class="site-header__menu-icon" aria-hidden="true">
              <span />
              <span />
              <span />
            </span>
            <span class="site-header__menu-label">{navStore.open ? 'Close' : 'Menu'}</span>
          </button>

          <nav id="site-nav" class="site-header__panel" aria-label="Page sections">
            <ul class="site-header__nav">
              <li>
                <a href="#about" click={(e: Event) => goToSection(e, 'about')}>
                  About
                </a>
              </li>
              <li>
                <a href="#resources" click={(e: Event) => goToSection(e, 'resources')}>
                  Resources
                </a>
              </li>
              <li>
                <a href="#sites" click={(e: Event) => goToSection(e, 'sites')}>
                  Sites
                </a>
              </li>
              <li>
                <a href="#team" click={(e: Event) => goToSection(e, 'team')}>
                  Team
                </a>
              </li>
              <li>
                <a href="#contact" click={(e: Event) => goToSection(e, 'contact')}>
                  Contact
                </a>
              </li>
            </ul>
          </nav>
        </div>
      </header>
    )
  }
}
