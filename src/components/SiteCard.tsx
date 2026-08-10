import { Component } from '@geajs/core'
import type { ParticipatingSite } from '../data/sites'
import { showSiteOnMap } from '../lib/show-site-on-map'
import SitePersonLink from './SitePersonLink'

export default class SiteCard extends Component {
  declare props: {
    site: ParticipatingSite
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
              <SitePersonLink name={name} />
            ))}
          </p>
          {site.coordinatorNames.length > 0 ? (
            <p class="site-card__coordinators">
              {site.coordinatorNames.map((name) => (
                <SitePersonLink name={name} />
              ))}
            </p>
          ) : null}
          <div class="site-card__actions">
            <a href={site.website} target="_blank" rel="noopener noreferrer">
              Visit website
            </a>
            <button
              type="button"
              class="site-card__map"
              data-site={site.name}
              click={showSiteOnMap}
            >
              Show on map
            </button>
          </div>
        </div>
      </details>
    )
  }
}
