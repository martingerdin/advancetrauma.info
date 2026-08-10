import { Component } from '@geajs/core'
import {
  participatingSites,
  siteBatches,
  siteBatchViews,
  type SiteBatch,
  type SiteBatchView,
} from '../data/sites'
import { countActiveFilters } from '../lib/filter-set'
import FilterCheckbox from './FilterCheckbox'
import SitesBatch from './SitesBatch'

const availableStates = Array.from(
  new Set(participatingSites.map((site) => site.state)),
).sort()

const availableCities = Array.from(
  new Set(participatingSites.map((site) => site.city)),
).sort()

const availableBatches: SiteBatch[] = siteBatches.map((batch) => batch.id)

/** Participating sites list with local filter UI state. */
export default class SitesList extends Component {
  searchQuery = ''
  selectedStates: string[] = []
  selectedCities: string[] = []
  selectedBatches: string[] = []
  filtersExpanded = false

  get activeFilterCount(): number {
    return countActiveFilters(
      [
        this.selectedStates.length,
        this.selectedCities.length,
        this.selectedBatches.length,
      ],
      this.searchQuery,
    )
  }

  get filteredBatches(): SiteBatchView[] {
    if (this.activeFilterCount === 0) return siteBatchViews

    const search = this.searchQuery.trim().toLowerCase()
    const hasSiteFilters =
      search !== '' ||
      this.selectedStates.length > 0 ||
      this.selectedCities.length > 0

    return siteBatchViews
      .map((batch) => {
        if (
          this.selectedBatches.length > 0 &&
          !this.selectedBatches.includes(batch.id)
        ) {
          return null
        }

        const sites = batch.sites.filter((site) => {
          const matchesState =
            this.selectedStates.length === 0 ||
            this.selectedStates.includes(site.state)
          const matchesCity =
            this.selectedCities.length === 0 ||
            this.selectedCities.includes(site.city)
          const matchesSearch =
            !search ||
            site.name.toLowerCase().includes(search) ||
            site.city.toLowerCase().includes(search) ||
            site.state.toLowerCase().includes(search) ||
            site.pi.toLowerCase().includes(search) ||
            (site.coordinators?.toLowerCase().includes(search) ?? false)

          return matchesState && matchesCity && matchesSearch
        })

        if (sites.length === 0) {
          // Keep empty future batches only when explicitly selected and no site filters
          if (
            batch.sites.length === 0 &&
            this.selectedBatches.includes(batch.id) &&
            !hasSiteFilters
          ) {
            return batch
          }
          return null
        }

        return { ...batch, sites }
      })
      .filter((batch): batch is SiteBatchView => batch !== null)
  }

  clearFilters() {
    this.searchQuery = ''
    this.selectedStates.splice(0)
    this.selectedCities.splice(0)
    this.selectedBatches.splice(0)
  }

  template() {
    return (
      <div class="sites-list">
        <div class="filter-toggle">
          <button
            type="button"
            class="filter-toggle__btn"
            click={() => {
              this.filtersExpanded = !this.filtersExpanded
            }}
            aria-expanded={this.filtersExpanded}
          >
            <span>Filter</span>
            {this.activeFilterCount > 0 ? (
              <span class="filter-toggle__badge">{this.activeFilterCount}</span>
            ) : null}
            <span class="filter-toggle__chevron" aria-hidden="true"></span>
          </button>
          {this.activeFilterCount > 0 ? (
            <button type="button" class="filter-toggle__clear" click={this.clearFilters}>
              Clear
            </button>
          ) : null}
        </div>

        {this.filtersExpanded ? (
          <div class="filters">
            <label class="filters__label">
              <span class="filters__label-text">Search by name</span>
              <input
                type="text"
                class="filters__search"
                placeholder="Enter a site or city…"
                value={this.searchQuery}
                input={(event: Event) => {
                  this.searchQuery = (event.target as HTMLInputElement).value
                }}
              />
            </label>

            <details class="filters__group">
              <summary class="filters__group-summary">
                <span class="filters__group-title">State</span>
                {this.selectedStates.length > 0 ? (
                  <span class="filter-toggle__badge">{this.selectedStates.length}</span>
                ) : null}
              </summary>
              <div class="filters__checkboxes">
                {availableStates.map((stateName) => (
                  <FilterCheckbox
                    key={stateName}
                    label={stateName}
                    selected={this.selectedStates}
                  />
                ))}
              </div>
            </details>

            <details class="filters__group">
              <summary class="filters__group-summary">
                <span class="filters__group-title">City</span>
                {this.selectedCities.length > 0 ? (
                  <span class="filter-toggle__badge">{this.selectedCities.length}</span>
                ) : null}
              </summary>
              <div class="filters__checkboxes">
                {availableCities.map((city) => (
                  <FilterCheckbox key={city} label={city} selected={this.selectedCities} />
                ))}
              </div>
            </details>

            <details class="filters__group">
              <summary class="filters__group-summary">
                <span class="filters__group-title">Batch</span>
                {this.selectedBatches.length > 0 ? (
                  <span class="filter-toggle__badge">{this.selectedBatches.length}</span>
                ) : null}
              </summary>
              <div class="filters__checkboxes">
                {availableBatches.map((batch) => (
                  <FilterCheckbox
                    key={batch}
                    label={'Batch ' + batch}
                    value={batch}
                    selected={this.selectedBatches}
                  />
                ))}
              </div>
            </details>
          </div>
        ) : null}

        {this.filteredBatches.length > 0 ? (
          <div class="sites-batches">
            {this.filteredBatches.map((batch) => (
              <SitesBatch key={batch.id} batch={batch} />
            ))}
          </div>
        ) : (
          <div class="no-results">
            <p>No sites match the selected filters.</p>
            <button type="button" class="no-results__reset" click={this.clearFilters}>
              Clear filters
            </button>
          </div>
        )}
      </div>
    )
  }
}
