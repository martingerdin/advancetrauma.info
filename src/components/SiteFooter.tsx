import { Component } from '@geajs/core'
import { footer } from '../data/content'
import { scrollToSection } from '../lib/scroll-to-section'
import { siteRevision } from '../lib/site-revision'

function goToSection(event: Event, id: string) {
  scrollToSection(event, id)
}

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
            {siteRevision.available ? (
              <a
                class="site-footer__updated"
                href={siteRevision.href}
                target="_blank"
                rel="noopener noreferrer"
                title={siteRevision.shortSha}
              >
                <span>Updated</span>
                <time datetime={siteRevision.isoDate}>{siteRevision.dateLabel}</time>
              </a>
            ) : null}
            <a
              class="site-footer__source"
              href={footer.sourceHref}
              target="_blank"
              rel="noopener noreferrer"
            >
              {footer.sourceLabel}
              <svg
                class="site-footer__github-icon"
                viewBox="0 0 16 16"
                width="16"
                height="16"
                aria-hidden="true"
                focusable="false"
              >
                <path
                  fill="currentColor"
                  d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27s1.36.09 2 .27c1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.01 8.01 0 0 0 16 8c0-4.42-3.58-8-8-8"
                />
              </svg>
            </a>
          </div>
        </div>
      </footer>
    )
  }
}
