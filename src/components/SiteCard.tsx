import { Component } from '@geajs/core'
import type { ParticipatingSite } from '../data/sites'
import sitesMapStore from '../stores/sites-map-store'

function showOnMap(event: Event) {
  event.preventDefault()
  const name = (event.currentTarget as HTMLElement).getAttribute('data-site')
  if (name) sitesMapStore.show(name)
}

export default class SiteCard extends Component {
  declare props: {
    site: ParticipatingSite
  }

  template({ site }: this['props']) {
    return (
      <details class="site-card">
        <summary class="site-card__summary">
          <span class="site-card__title">{site.name}</span>
          <span class="site-card__city">{site.city}</span>
        </summary>
        <div class="site-card__panel">
          <p class="site-card__pi">{site.pi}</p>
          {site.coordinators ? (
            <p class="site-card__coordinators">{site.coordinators}</p>
          ) : null}
          <div class="site-card__actions">
            <a href={site.website} target="_blank" rel="noopener noreferrer">
              Visit website
            </a>
            <button
              type="button"
              class="site-card__map"
              data-site={site.name}
              click={showOnMap}
            >
              Show on map
            </button>
          </div>
        </div>
      </details>
    )
  }
}
