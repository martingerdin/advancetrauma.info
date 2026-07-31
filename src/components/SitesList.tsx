import { Component } from '@geajs/core'
import { siteBatchViews } from '../data/sites'

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
            {siteBatchViews[0].sites.map((site) => (
              <a href={site.website} target="_blank" rel="noopener noreferrer" class="site-card">
                <div class="site-card__media">
                  <img src={site.image} alt="" width="640" height="480" loading="lazy" decoding="async" />
                </div>
                <div class="site-card__body">
                  <h4 class="site-card__title">{site.name}</h4>
                  <div class="site-card__meta">
                    <span class="site-card__pi">{site.pi}</span>
                    <span class="site-card__city">{site.city}</span>
                  </div>
                </div>
              </a>
            ))}
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
            {siteBatchViews[1].sites.map((site) => (
              <a href={site.website} target="_blank" rel="noopener noreferrer" class="site-card">
                <div class="site-card__media">
                  <img src={site.image} alt="" width="640" height="480" loading="lazy" decoding="async" />
                </div>
                <div class="site-card__body">
                  <h4 class="site-card__title">{site.name}</h4>
                  <div class="site-card__meta">
                    <span class="site-card__pi">{site.pi}</span>
                    <span class="site-card__city">{site.city}</span>
                  </div>
                </div>
              </a>
            ))}
          </div>
        </div>
      </div>
    )
  }
}
