import { Component } from '@geajs/core'
import sitesFilterStore from '../stores/sites-filter-store'
import { participatingSites, batchStatusLabels, type SiteBatch, type BatchStatus } from '../data/sites'

export default class SitesFilters extends Component {
  private unsubscribe?: () => void

  mounted() {
    this.unsubscribe = sitesFilterStore.subscribe(() => {
      this.update()
    })
  }

  unmounted() {
    this.unsubscribe?.()
  }

  handleSearchInput = (e: Event) => {
    const input = e.target as HTMLInputElement
    sitesFilterStore.setSearch(input.value)
  }

  handleBatchToggle = (batch: SiteBatch) => () => {
    sitesFilterStore.toggleBatch(batch)
  }

  handleStatusToggle = (status: BatchStatus) => () => {
    sitesFilterStore.toggleStatus(status)
  }

  handleCityToggle = (city: string) => () => {
    sitesFilterStore.toggleCity(city)
  }

  handleClearAll = () => {
    sitesFilterStore.clearAll()
  }

  template() {
    const state = sitesFilterStore.state
    const hasActiveFilters = sitesFilterStore.hasActiveFilters()

    // Get unique cities from participating sites
    const cities = Array.from(new Set(participatingSites.map((site) => site.city))).sort()

    const batches: SiteBatch[] = ['1', '2', '3', '4', '5', '6']
    const statuses: BatchStatus[] = ['ongoing', 'completed', 'upcoming', 'starting', 'screening']

    return (
      <div class="sites-filters">
        <div class="sites-filters__header">
          <h3 class="sites-filters__title">Filter Sites</h3>
          {hasActiveFilters ? (
            <button class="sites-filters__clear" onClick={this.handleClearAll} type="button">
              Clear all
            </button>
          ) : null}
        </div>

        <div class="sites-filters__groups">
          {/* Search */}
          <div class="sites-filters__group">
            <label class="sites-filters__label" for="sites-search">
              Search
            </label>
            <input
              id="sites-search"
              class="sites-filters__search"
              type="text"
              placeholder="Search by site name..."
              value={state.search}
              onInput={this.handleSearchInput}
            />
          </div>

          {/* Batch filter */}
          <div class="sites-filters__group">
            <label class="sites-filters__label">Batch</label>
            <div class="sites-filters__options">
              {batches.map((batch) => (
                <label class="sites-filters__checkbox-label">
                  <input
                    type="checkbox"
                    checked={state.batches.has(batch)}
                    onChange={this.handleBatchToggle(batch)}
                  />
                  <span>Batch {batch}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Status filter */}
          <div class="sites-filters__group">
            <label class="sites-filters__label">Status</label>
            <div class="sites-filters__options">
              {statuses.map((status) => (
                <label class="sites-filters__checkbox-label">
                  <input
                    type="checkbox"
                    checked={state.statuses.has(status)}
                    onChange={this.handleStatusToggle(status)}
                  />
                  <span>{batchStatusLabels[status]}</span>
                </label>
              ))}
            </div>
          </div>

          {/* City filter */}
          <div class="sites-filters__group">
            <label class="sites-filters__label">City</label>
            <div class="sites-filters__options">
              {cities.map((city) => (
                <label class="sites-filters__checkbox-label">
                  <input
                    type="checkbox"
                    checked={state.cities.has(city)}
                    onChange={this.handleCityToggle(city)}
                  />
                  <span>{city}</span>
                </label>
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }
}
