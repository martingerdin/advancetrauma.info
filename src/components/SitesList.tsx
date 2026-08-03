import { Component } from '@geajs/core'
import { siteBatchViews } from '../data/sites'
import sitesMapStore from '../stores/sites-map-store'

function showOnMap(event: Event) {
  event.preventDefault()
  const name = (event.currentTarget as HTMLElement).getAttribute('data-site')
  if (name) sitesMapStore.show(name)
}

export default class SitesList extends Component {
  template() {
    return (
      <div class="sites-batches">
        {siteBatchViews.map((batch) => (
          <div class="sites-batch">
            <div class="sites-batch__header">
              <h3 class={batch.titleClass}>{batch.title}</h3>
              <div class="sites-batch__pills" aria-label={`${batch.title} schedule`}>
                <span class={batch.statusClass}>{batch.statusLabel}</span>
                {batch.startedPill ? (
                  <span class="status-pill status-pill--meta">{batch.startedPill}</span>
                ) : null}
                {batch.endsPill ? (
                  <span class="status-pill status-pill--meta">{batch.endsPill}</span>
                ) : null}
              </div>
            </div>
            {batch.sites.length > 0 ? (
              <div class="site-cards">
                {batch.sites.map((site) => (
                  <details class="site-card">
                    <summary class="site-card__summary">
                      <span class="site-card__title">{site.name}</span>
                      <span class="site-card__city">{site.city}</span>
                    </summary>
                    <div class="site-card__panel">
                      <p class="site-card__pi">{site.pi}</p>
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
                ))}
              </div>
            ) : null}
          </div>
        ))}
      </div>
    )
  }
}
