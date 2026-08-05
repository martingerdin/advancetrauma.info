import { Component } from '@geajs/core'
import type { SiteBatchView } from '../data/sites'
import SiteCard from './SiteCard'

export default class SitesBatch extends Component {
  declare props: {
    batch: SiteBatchView
  }

  template({ batch }: this['props']) {
    return (
      <div class="sites-batch">
        <div class="sites-batch__header">
          <h3 class={batch.titleClass}>{batch.title}</h3>
          <div class="sites-batch__pills" aria-label={batch.title + ' schedule'}>
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
              <SiteCard site={site} />
            ))}
          </div>
        ) : null}
      </div>
    )
  }
}
