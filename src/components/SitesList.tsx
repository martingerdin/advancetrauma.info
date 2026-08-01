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
        <div class="sites-batch">
          <div class="sites-batch__header">
            <h3 class="sites-batch__title sites-batch__title--1">{siteBatchViews[0].title}</h3>
            <div class="sites-batch__pills" aria-label="Batch 1 schedule">
              <span class={siteBatchViews[0].statusClass}>{siteBatchViews[0].statusLabel}</span>
              <span class="status-pill status-pill--meta">{siteBatchViews[0].startedPill}</span>
              <span class="status-pill status-pill--meta">{siteBatchViews[0].endsPill}</span>
            </div>
          </div>
          <div class="site-cards">
            <article class="site-card">
              <h4 class="site-card__title">
                <a
                  href={siteBatchViews[0].sites[0].website}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {siteBatchViews[0].sites[0].name}
                </a>
              </h4>
              <div class="site-card__meta">
                <span class="site-card__pi">{siteBatchViews[0].sites[0].pi}</span>
                <span class="site-card__city">{siteBatchViews[0].sites[0].city}</span>
              </div>
              <button
                type="button"
                class="site-card__map"
                data-site={siteBatchViews[0].sites[0].name}
                click={showOnMap}
              >
                Show on map
              </button>
            </article>
            <article class="site-card">
              <h4 class="site-card__title">
                <a
                  href={siteBatchViews[0].sites[1].website}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {siteBatchViews[0].sites[1].name}
                </a>
              </h4>
              <div class="site-card__meta">
                <span class="site-card__pi">{siteBatchViews[0].sites[1].pi}</span>
                <span class="site-card__city">{siteBatchViews[0].sites[1].city}</span>
              </div>
              <button
                type="button"
                class="site-card__map"
                data-site={siteBatchViews[0].sites[1].name}
                click={showOnMap}
              >
                Show on map
              </button>
            </article>
            <article class="site-card">
              <h4 class="site-card__title">
                <a
                  href={siteBatchViews[0].sites[2].website}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {siteBatchViews[0].sites[2].name}
                </a>
              </h4>
              <div class="site-card__meta">
                <span class="site-card__pi">{siteBatchViews[0].sites[2].pi}</span>
                <span class="site-card__city">{siteBatchViews[0].sites[2].city}</span>
              </div>
              <button
                type="button"
                class="site-card__map"
                data-site={siteBatchViews[0].sites[2].name}
                click={showOnMap}
              >
                Show on map
              </button>
            </article>
            <article class="site-card">
              <h4 class="site-card__title">
                <a
                  href={siteBatchViews[0].sites[3].website}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {siteBatchViews[0].sites[3].name}
                </a>
              </h4>
              <div class="site-card__meta">
                <span class="site-card__pi">{siteBatchViews[0].sites[3].pi}</span>
                <span class="site-card__city">{siteBatchViews[0].sites[3].city}</span>
              </div>
              <button
                type="button"
                class="site-card__map"
                data-site={siteBatchViews[0].sites[3].name}
                click={showOnMap}
              >
                Show on map
              </button>
            </article>
            <article class="site-card">
              <h4 class="site-card__title">
                <a
                  href={siteBatchViews[0].sites[4].website}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {siteBatchViews[0].sites[4].name}
                </a>
              </h4>
              <div class="site-card__meta">
                <span class="site-card__pi">{siteBatchViews[0].sites[4].pi}</span>
                <span class="site-card__city">{siteBatchViews[0].sites[4].city}</span>
              </div>
              <button
                type="button"
                class="site-card__map"
                data-site={siteBatchViews[0].sites[4].name}
                click={showOnMap}
              >
                Show on map
              </button>
            </article>
          </div>
        </div>
        <div class="sites-batch">
          <div class="sites-batch__header">
            <h3 class="sites-batch__title sites-batch__title--2">{siteBatchViews[1].title}</h3>
            <div class="sites-batch__pills" aria-label="Batch 2 schedule">
              <span class={siteBatchViews[1].statusClass}>{siteBatchViews[1].statusLabel}</span>
              <span class="status-pill status-pill--meta">{siteBatchViews[1].startedPill}</span>
              <span class="status-pill status-pill--meta">{siteBatchViews[1].endsPill}</span>
            </div>
          </div>
          <div class="site-cards">
            <article class="site-card">
              <h4 class="site-card__title">
                <a
                  href={siteBatchViews[1].sites[0].website}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {siteBatchViews[1].sites[0].name}
                </a>
              </h4>
              <div class="site-card__meta">
                <span class="site-card__pi">{siteBatchViews[1].sites[0].pi}</span>
                <span class="site-card__city">{siteBatchViews[1].sites[0].city}</span>
              </div>
              <button
                type="button"
                class="site-card__map"
                data-site={siteBatchViews[1].sites[0].name}
                click={showOnMap}
              >
                Show on map
              </button>
            </article>
            <article class="site-card">
              <h4 class="site-card__title">
                <a
                  href={siteBatchViews[1].sites[1].website}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {siteBatchViews[1].sites[1].name}
                </a>
              </h4>
              <div class="site-card__meta">
                <span class="site-card__pi">{siteBatchViews[1].sites[1].pi}</span>
                <span class="site-card__city">{siteBatchViews[1].sites[1].city}</span>
              </div>
              <button
                type="button"
                class="site-card__map"
                data-site={siteBatchViews[1].sites[1].name}
                click={showOnMap}
              >
                Show on map
              </button>
            </article>
            <article class="site-card">
              <h4 class="site-card__title">
                <a
                  href={siteBatchViews[1].sites[2].website}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {siteBatchViews[1].sites[2].name}
                </a>
              </h4>
              <div class="site-card__meta">
                <span class="site-card__pi">{siteBatchViews[1].sites[2].pi}</span>
                <span class="site-card__city">{siteBatchViews[1].sites[2].city}</span>
              </div>
              <button
                type="button"
                class="site-card__map"
                data-site={siteBatchViews[1].sites[2].name}
                click={showOnMap}
              >
                Show on map
              </button>
            </article>
            <article class="site-card">
              <h4 class="site-card__title">
                <a
                  href={siteBatchViews[1].sites[3].website}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {siteBatchViews[1].sites[3].name}
                </a>
              </h4>
              <div class="site-card__meta">
                <span class="site-card__pi">{siteBatchViews[1].sites[3].pi}</span>
                <span class="site-card__city">{siteBatchViews[1].sites[3].city}</span>
              </div>
              <button
                type="button"
                class="site-card__map"
                data-site={siteBatchViews[1].sites[3].name}
                click={showOnMap}
              >
                Show on map
              </button>
            </article>
            <article class="site-card">
              <h4 class="site-card__title">
                <a
                  href={siteBatchViews[1].sites[4].website}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {siteBatchViews[1].sites[4].name}
                </a>
              </h4>
              <div class="site-card__meta">
                <span class="site-card__pi">{siteBatchViews[1].sites[4].pi}</span>
                <span class="site-card__city">{siteBatchViews[1].sites[4].city}</span>
              </div>
              <button
                type="button"
                class="site-card__map"
                data-site={siteBatchViews[1].sites[4].name}
                click={showOnMap}
              >
                Show on map
              </button>
            </article>
          </div>
        </div>
      </div>
    )
  }
}
