import { Component } from '@geajs/core'
import { siteBatchViews } from '../data/sites'
import sitesMapStore from '../stores/sites-map-store'

function showOnMap(event: Event) {
  event.preventDefault()
  const name = (event.currentTarget as HTMLElement).getAttribute('data-site')
  if (name) sitesMapStore.show(name)
}

/** Gea cannot safely `.map()` nested JSX — keep site cards unrolled. */
export default class SitesList extends Component {
  template() {
    return (
      <div class="sites-batches">
        <div class="sites-batch">
          <div class="sites-batch__header">
            <h3 class={siteBatchViews[0].titleClass}>{siteBatchViews[0].title}</h3>
            <div class="sites-batch__pills" aria-label="Batch 1 schedule">
              <span class={siteBatchViews[0].statusClass}>{siteBatchViews[0].statusLabel}</span>
              <span class="status-pill status-pill--meta">{siteBatchViews[0].startedPill}</span>
              <span class="status-pill status-pill--meta">{siteBatchViews[0].endsPill}</span>
            </div>
          </div>
          <div class="site-cards">
            <details class="site-card">
              <summary class="site-card__summary">
                <span class="site-card__title">{siteBatchViews[0].sites[0].name}</span>
                <span class="site-card__city">{siteBatchViews[0].sites[0].city}</span>
              </summary>
              <div class="site-card__panel">
                <p class="site-card__pi">{siteBatchViews[0].sites[0].pi}</p>
                <div class="site-card__actions">
                  <a
                    href={siteBatchViews[0].sites[0].website}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Visit website
                  </a>
                  <button
                    type="button"
                    class="site-card__map"
                    data-site={siteBatchViews[0].sites[0].name}
                    click={showOnMap}
                  >
                    Show on map
                  </button>
                </div>
              </div>
            </details>
            <details class="site-card">
              <summary class="site-card__summary">
                <span class="site-card__title">{siteBatchViews[0].sites[1].name}</span>
                <span class="site-card__city">{siteBatchViews[0].sites[1].city}</span>
              </summary>
              <div class="site-card__panel">
                <p class="site-card__pi">{siteBatchViews[0].sites[1].pi}</p>
                <div class="site-card__actions">
                  <a
                    href={siteBatchViews[0].sites[1].website}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Visit website
                  </a>
                  <button
                    type="button"
                    class="site-card__map"
                    data-site={siteBatchViews[0].sites[1].name}
                    click={showOnMap}
                  >
                    Show on map
                  </button>
                </div>
              </div>
            </details>
            <details class="site-card">
              <summary class="site-card__summary">
                <span class="site-card__title">{siteBatchViews[0].sites[2].name}</span>
                <span class="site-card__city">{siteBatchViews[0].sites[2].city}</span>
              </summary>
              <div class="site-card__panel">
                <p class="site-card__pi">{siteBatchViews[0].sites[2].pi}</p>
                <div class="site-card__actions">
                  <a
                    href={siteBatchViews[0].sites[2].website}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Visit website
                  </a>
                  <button
                    type="button"
                    class="site-card__map"
                    data-site={siteBatchViews[0].sites[2].name}
                    click={showOnMap}
                  >
                    Show on map
                  </button>
                </div>
              </div>
            </details>
            <details class="site-card">
              <summary class="site-card__summary">
                <span class="site-card__title">{siteBatchViews[0].sites[3].name}</span>
                <span class="site-card__city">{siteBatchViews[0].sites[3].city}</span>
              </summary>
              <div class="site-card__panel">
                <p class="site-card__pi">{siteBatchViews[0].sites[3].pi}</p>
                <div class="site-card__actions">
                  <a
                    href={siteBatchViews[0].sites[3].website}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Visit website
                  </a>
                  <button
                    type="button"
                    class="site-card__map"
                    data-site={siteBatchViews[0].sites[3].name}
                    click={showOnMap}
                  >
                    Show on map
                  </button>
                </div>
              </div>
            </details>
            <details class="site-card">
              <summary class="site-card__summary">
                <span class="site-card__title">{siteBatchViews[0].sites[4].name}</span>
                <span class="site-card__city">{siteBatchViews[0].sites[4].city}</span>
              </summary>
              <div class="site-card__panel">
                <p class="site-card__pi">{siteBatchViews[0].sites[4].pi}</p>
                <div class="site-card__actions">
                  <a
                    href={siteBatchViews[0].sites[4].website}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Visit website
                  </a>
                  <button
                    type="button"
                    class="site-card__map"
                    data-site={siteBatchViews[0].sites[4].name}
                    click={showOnMap}
                  >
                    Show on map
                  </button>
                </div>
              </div>
            </details>
          </div>
        </div>

        <div class="sites-batch">
          <div class="sites-batch__header">
            <h3 class={siteBatchViews[1].titleClass}>{siteBatchViews[1].title}</h3>
            <div class="sites-batch__pills" aria-label="Batch 2 schedule">
              <span class={siteBatchViews[1].statusClass}>{siteBatchViews[1].statusLabel}</span>
              <span class="status-pill status-pill--meta">{siteBatchViews[1].startedPill}</span>
              <span class="status-pill status-pill--meta">{siteBatchViews[1].endsPill}</span>
            </div>
          </div>
          <div class="site-cards">
            <details class="site-card">
              <summary class="site-card__summary">
                <span class="site-card__title">{siteBatchViews[1].sites[0].name}</span>
                <span class="site-card__city">{siteBatchViews[1].sites[0].city}</span>
              </summary>
              <div class="site-card__panel">
                <p class="site-card__pi">{siteBatchViews[1].sites[0].pi}</p>
                <div class="site-card__actions">
                  <a
                    href={siteBatchViews[1].sites[0].website}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Visit website
                  </a>
                  <button
                    type="button"
                    class="site-card__map"
                    data-site={siteBatchViews[1].sites[0].name}
                    click={showOnMap}
                  >
                    Show on map
                  </button>
                </div>
              </div>
            </details>
            <details class="site-card">
              <summary class="site-card__summary">
                <span class="site-card__title">{siteBatchViews[1].sites[1].name}</span>
                <span class="site-card__city">{siteBatchViews[1].sites[1].city}</span>
              </summary>
              <div class="site-card__panel">
                <p class="site-card__pi">{siteBatchViews[1].sites[1].pi}</p>
                <div class="site-card__actions">
                  <a
                    href={siteBatchViews[1].sites[1].website}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Visit website
                  </a>
                  <button
                    type="button"
                    class="site-card__map"
                    data-site={siteBatchViews[1].sites[1].name}
                    click={showOnMap}
                  >
                    Show on map
                  </button>
                </div>
              </div>
            </details>
            <details class="site-card">
              <summary class="site-card__summary">
                <span class="site-card__title">{siteBatchViews[1].sites[2].name}</span>
                <span class="site-card__city">{siteBatchViews[1].sites[2].city}</span>
              </summary>
              <div class="site-card__panel">
                <p class="site-card__pi">{siteBatchViews[1].sites[2].pi}</p>
                <div class="site-card__actions">
                  <a
                    href={siteBatchViews[1].sites[2].website}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Visit website
                  </a>
                  <button
                    type="button"
                    class="site-card__map"
                    data-site={siteBatchViews[1].sites[2].name}
                    click={showOnMap}
                  >
                    Show on map
                  </button>
                </div>
              </div>
            </details>
            <details class="site-card">
              <summary class="site-card__summary">
                <span class="site-card__title">{siteBatchViews[1].sites[3].name}</span>
                <span class="site-card__city">{siteBatchViews[1].sites[3].city}</span>
              </summary>
              <div class="site-card__panel">
                <p class="site-card__pi">{siteBatchViews[1].sites[3].pi}</p>
                <div class="site-card__actions">
                  <a
                    href={siteBatchViews[1].sites[3].website}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Visit website
                  </a>
                  <button
                    type="button"
                    class="site-card__map"
                    data-site={siteBatchViews[1].sites[3].name}
                    click={showOnMap}
                  >
                    Show on map
                  </button>
                </div>
              </div>
            </details>
            <details class="site-card">
              <summary class="site-card__summary">
                <span class="site-card__title">{siteBatchViews[1].sites[4].name}</span>
                <span class="site-card__city">{siteBatchViews[1].sites[4].city}</span>
              </summary>
              <div class="site-card__panel">
                <p class="site-card__pi">{siteBatchViews[1].sites[4].pi}</p>
                <div class="site-card__actions">
                  <a
                    href={siteBatchViews[1].sites[4].website}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Visit website
                  </a>
                  <button
                    type="button"
                    class="site-card__map"
                    data-site={siteBatchViews[1].sites[4].name}
                    click={showOnMap}
                  >
                    Show on map
                  </button>
                </div>
              </div>
            </details>
          </div>
        </div>

        <div class="sites-batch">
          <div class="sites-batch__header">
            <h3 class={siteBatchViews[2].titleClass}>{siteBatchViews[2].title}</h3>
            <div class="sites-batch__pills" aria-label="Batch 3 schedule">
              <span class={siteBatchViews[2].statusClass}>{siteBatchViews[2].statusLabel}</span>
            </div>
          </div>
        </div>

        <div class="sites-batch">
          <div class="sites-batch__header">
            <h3 class={siteBatchViews[3].titleClass}>{siteBatchViews[3].title}</h3>
            <div class="sites-batch__pills" aria-label="Batch 4 schedule">
              <span class={siteBatchViews[3].statusClass}>{siteBatchViews[3].statusLabel}</span>
            </div>
          </div>
        </div>

        <div class="sites-batch">
          <div class="sites-batch__header">
            <h3 class={siteBatchViews[4].titleClass}>{siteBatchViews[4].title}</h3>
            <div class="sites-batch__pills" aria-label="Batch 5 schedule">
              <span class={siteBatchViews[4].statusClass}>{siteBatchViews[4].statusLabel}</span>
            </div>
          </div>
        </div>

        <div class="sites-batch">
          <div class="sites-batch__header">
            <h3 class={siteBatchViews[5].titleClass}>{siteBatchViews[5].title}</h3>
            <div class="sites-batch__pills" aria-label="Batch 6 schedule">
              <span class={siteBatchViews[5].statusClass}>{siteBatchViews[5].statusLabel}</span>
            </div>
          </div>
        </div>
      </div>
    )
  }
}
