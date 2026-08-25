import { Component } from '@geajs/core'
import { footer } from '../data/content'
import { portals } from '../data/portals'
import heroVisibilityStore from '../stores/hero-visibility-store'
import navStore from '../stores/nav-store'
import HeaderSignOut from './HeaderSignOut'
import PortalNavLink from './PortalNavLink'
import SectionNavLink from './SectionNavLink'
import TrialProgress from './TrialProgress'

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

          {heroVisibilityStore.inView ? null : <TrialProgress variant="header" />}

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
              {portals.map((portal, index) => (
                <PortalNavLink
                  key={portal.id}
                  href={portal.href}
                  label={portal.label}
                  divided={index === 0}
                />
              ))}
              <HeaderSignOut />
            </ul>
          </nav>
        </div>
      </header>
    )
  }
}
