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
          <ul class="sites-list">
            {siteBatchViews[0].sites.map((site) => (
              <li>
                <a href={site.website} target="_blank" rel="noopener noreferrer">
                  {site.name}
                </a>
                <span class="sites-list__city">{site.city}</span>
              </li>
            ))}
          </ul>
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
          <ul class="sites-list">
            {siteBatchViews[1].sites.map((site) => (
              <li>
                <a href={site.website} target="_blank" rel="noopener noreferrer">
                  {site.name}
                </a>
                <span class="sites-list__city">{site.city}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    )
  }
}
