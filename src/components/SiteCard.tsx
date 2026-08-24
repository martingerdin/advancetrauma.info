import { Component } from '@geajs/core'
import type { ParticipatingSite } from '../data/sites'
import { safeHttpUrl } from '../lib/escape-html'
import sitesMapStore from '../stores/sites-map-store'
import SitePersonLink from './SitePersonLink'

export default class SiteCard extends Component {
  declare props: {
    site: ParticipatingSite
  }

  get websiteHref(): string | null {
    return safeHttpUrl(this.props.site.website)
  }

  template({ site }: this['props']) {
    return (
      <details class="site-card" data-site={site.name}>
        <summary class="site-card__summary">
          <span class="site-card__title">{site.name}</span>
          <span class="site-card__city">{site.city}</span>
        </summary>
        <div class="site-card__panel">
          <p class="site-card__pi">
            {site.investigatorNames.map((name) => (
              <SitePersonLink key={name} name={name} />
            ))}
          </p>
          {site.coordinatorNames.length > 0 ? (
            <p class="site-card__coordinators">
              {site.coordinatorNames.map((name) => (
                <SitePersonLink key={name} name={name} />
              ))}
            </p>
          ) : null}
          <div class="site-card__actions">
            {this.websiteHref ? (
              <a href={this.websiteHref} target="_blank" rel="noopener noreferrer">
                Visit website
              </a>
            ) : null}
            <button
              type="button"
              class="site-card__map"
              click={(event: Event) => {
                event.preventDefault()
                sitesMapStore.show(site.name)
              }}
            >
              Show on map
            </button>
          </div>
        </div>
      </details>
    )
  }
}
