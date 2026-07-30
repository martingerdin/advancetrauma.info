import { Component } from '@geajs/core'
import { footer } from '../data/content'
import { scrollToSection } from '../lib/scroll-to-section'

function goToSection(event: Event, id: string) {
  scrollToSection(event, id)
}

const footerYear = String(new Date().getFullYear())

export default class SiteFooter extends Component {
  template() {
    return (
      <footer class="site-footer">
        <div class="site-footer__inner">
          <div class="site-footer__brand">
            <a class="site-footer__logo" href="/">
              {footer.brand}
            </a>
            <p class="site-footer__tagline">{footer.tagline}</p>
          </div>

          <div class="site-footer__columns">
            <nav class="site-footer__col" aria-label={footer.navigateTitle}>
              <h2 class="site-footer__heading">{footer.navigateTitle}</h2>
              <ul class="site-footer__list">
                <li>
                  <a
                    href={footer.navigate[0].href}
                    click={(e: Event) => goToSection(e, footer.navigate[0].id)}
                  >
                    {footer.navigate[0].label}
                  </a>
                </li>
                <li>
                  <a
                    href={footer.navigate[1].href}
                    click={(e: Event) => goToSection(e, footer.navigate[1].id)}
                  >
                    {footer.navigate[1].label}
                  </a>
                </li>
                <li>
                  <a
                    href={footer.navigate[2].href}
                    click={(e: Event) => goToSection(e, footer.navigate[2].id)}
                  >
                    {footer.navigate[2].label}
                  </a>
                </li>
                <li>
                  <a
                    href={footer.navigate[3].href}
                    click={(e: Event) => goToSection(e, footer.navigate[3].id)}
                  >
                    {footer.navigate[3].label}
                  </a>
                </li>
              </ul>
            </nav>

            <nav class="site-footer__col" aria-label={footer.resourcesTitle}>
              <h2 class="site-footer__heading">{footer.resourcesTitle}</h2>
              <ul class="site-footer__list">
                <li>
                  <a href={footer.resources[0].href} download>
                    {footer.resources[0].label}
                  </a>
                </li>
                <li>
                  <a
                    href={footer.resources[1].href}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {footer.resources[1].label}
                  </a>
                </li>
                <li>
                  <a
                    href={footer.resources[2].href}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {footer.resources[2].label}
                  </a>
                </li>
              </ul>
            </nav>
          </div>
        </div>

        <div class="site-footer__bar">
          <p class="site-footer__credit">
            <span>{footer.creditPrefix}</span>{' '}
            <a
              href={footer.partners[0].href}
              target="_blank"
              rel="noopener noreferrer"
            >
              {footer.partners[0].name}
            </a>
            , the{' '}
            <a
              href={footer.partners[1].href}
              target="_blank"
              rel="noopener noreferrer"
            >
              {footer.partners[1].name}
            </a>
            , and the{' '}
            <a
              href={footer.partners[2].href}
              target="_blank"
              rel="noopener noreferrer"
            >
              {footer.partners[2].name}
            </a>
            .
          </p>
          <div class="site-footer__meta">
            <p class="site-footer__copy">
              <span class="site-footer__copy-mark">©</span>
              <span>{footerYear}</span>
              <span class="site-footer__copy-brand">{footer.brand}</span>
            </p>
            <a
              class="site-footer__source"
              href={footer.sourceHref}
              target="_blank"
              rel="noopener noreferrer"
            >
              {footer.sourceLabel}
            </a>
          </div>
        </div>
      </footer>
    )
  }
}
