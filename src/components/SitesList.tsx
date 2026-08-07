import { Component } from '@geajs/core'
import { siteBatchViews, getBatchStatus, type SiteBatchView } from '../data/sites'
import sitesFilterStore from '../stores/sites-filter-store'
import SitesBatch from './SitesBatch'

/** Map to child components — Gea cannot safely `.map()` nested inline JSX. */
export default class SitesList extends Component {
  private unsubscribe?: () => void

  mounted() {
    this.unsubscribe = sitesFilterStore.subscribe(() => {
      this.update()
    })
  }

  unmounted() {
    this.unsubscribe?.()
  }

  getFilteredBatches(): SiteBatchView[] {
    const state = sitesFilterStore.state
    const hasActiveFilters = sitesFilterStore.hasActiveFilters()

    if (!hasActiveFilters) {
      return siteBatchViews
    }

    return siteBatchViews
      .map((batch) => {
        // Filter batch by status
        if (state.statuses.size > 0 && !state.statuses.has(batch.status)) {
          return null
        }

        // Filter batch by batch number
        if (state.batches.size > 0 && !state.batches.has(batch.id)) {
          return null
        }

        // Filter sites within batch
        const filteredSites = batch.sites.filter((site) => {
          // Filter by city
          if (state.cities.size > 0 && !state.cities.has(site.city)) {
            return false
          }

          // Filter by search term
          if (state.search) {
            const searchLower = state.search.toLowerCase()
            const nameMatch = site.name.toLowerCase().includes(searchLower)
            const cityMatch = site.city.toLowerCase().includes(searchLower)
            const piMatch = site.pi.toLowerCase().includes(searchLower)
            const coordinatorMatch = site.coordinators?.toLowerCase().includes(searchLower)
            return nameMatch || cityMatch || piMatch || coordinatorMatch
          }

          return true
        })

        // If batch has no sites after filtering, don't show it
        if (filteredSites.length === 0) {
          return null
        }

        return {
          ...batch,
          sites: filteredSites,
        }
      })
      .filter((batch): batch is SiteBatchView => batch !== null)
  }

  template() {
    const filteredBatches = this.getFilteredBatches()

    return (
      <div class="sites-batches">
        {filteredBatches.length > 0 ? (
          filteredBatches.map((batch) => <SitesBatch batch={batch} />)
        ) : (
          <div class="sites-batches__empty">
            <p>No sites match the selected filters.</p>
          </div>
        )}
      </div>
    )
  }
}
