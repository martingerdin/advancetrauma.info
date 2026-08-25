import { Component } from '@geajs/core'
import { footer } from '../data/content'
import { portals } from '../data/portals'
import { siteRevision } from '../lib/site-revision'
import FooterCredit from './FooterCredit'
import FooterPortalLink from './FooterPortalLink'
import FooterResourceLink from './FooterResourceLink'
import FooterSourceLink from './FooterSourceLink'
import FooterUpdatedLink from './FooterUpdatedLink'
import SectionNavLink from './SectionNavLink'

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
                {footer.navigate.map((item) => (
                  <SectionNavLink key={item.id} href={item.href} id={item.id} label={item.label} />
                ))}
                {portals.map((portal) => (
                  <FooterPortalLink key={portal.id} href={portal.href} label={portal.label} />
                ))}
              </ul>
            </nav>

            <nav class="site-footer__col" aria-label={footer.resourcesTitle}>
              <h2 class="site-footer__heading">{footer.resourcesTitle}</h2>
              <ul class="site-footer__list">
                {footer.resources.map((item) => (
                  <FooterResourceLink key={item.href} item={item} />
                ))}
              </ul>
            </nav>
          </div>
        </div>

        <div class="site-footer__bar">
          <FooterCredit />
          <div class="site-footer__meta">
            {siteRevision.available ? <FooterUpdatedLink /> : null}
            <FooterSourceLink />
          </div>
        </div>
      </footer>
    )
  }
}
