import { Component } from '@geajs/core'
import { footer } from '../data/content'
import navStore from '../stores/nav-store'
import PortalNav from './PortalNav'
import SectionNavLink from './SectionNavLink'

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
              {footer.navigate.map((item) => (
                <SectionNavLink key={item.id} href={item.href} id={item.id} label={item.label} />
              ))}
              <PortalNav />
            </ul>
          </nav>
        </div>
      </header>
    )
  }
}
