import { Component } from '@geajs/core'
import {
  participatingSites,
  siteBatches,
  siteBatchViews,
  type SiteBatch,
  type SiteBatchView,
} from '../data/sites'
import {
  countActiveFilters,
  resetFilterControls,
  toggleInSet,
} from '../lib/filter-set'
import FilterCheckbox from './FilterCheckbox'
import SitesBatch from './SitesBatch'

const availableStates = Array.from(
  new Set(participatingSites.map((site) => site.state)),
).sort()

const availableCities = Array.from(
  new Set(participatingSites.map((site) => site.city)),
).sort()

const availableBatches: SiteBatch[] = siteBatches.map((batch) => batch.id)

/** Map to child components — Gea cannot safely `.map()` nested inline JSX. */
export default class SitesList extends Component {
  state = {
    searchQuery: '',
    selectedStates: new Set<string>(),
    selectedCities: new Set<string>(),
    selectedBatches: new Set<SiteBatch>(),
    filtersExpanded: false,
  }

  filterBatches(): SiteBatchView[] {
    const hasActiveFilters = this.activeFilterCount > 0
    if (!hasActiveFilters) return siteBatchViews

    const search = this.state.searchQuery.trim().toLowerCase()
    const hasSiteFilters =
      search !== '' ||
      this.state.selectedStates.size > 0 ||
      this.state.selectedCities.size > 0

    return siteBatchViews
      .map((batch) => {
        if (
          this.state.selectedBatches.size > 0 &&
          !this.state.selectedBatches.has(batch.id)
        ) {
          return null
        }

        const sites = batch.sites.filter((site) => {
          const matchesState =
            this.state.selectedStates.size === 0 ||
            this.state.selectedStates.has(site.state)

          const matchesCity =
            this.state.selectedCities.size === 0 ||
            this.state.selectedCities.has(site.city)

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
            this.state.selectedBatches.has(batch.id) &&
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

  handleSearchInput = (event: Event) => {
    const target = event.target as HTMLInputElement
    this.state.searchQuery = target.value
  }

  handleStateToggle = (stateName: string) => {
    this.state.selectedStates = toggleInSet(this.state.selectedStates, stateName)
  }

  handleCityToggle = (city: string) => {
    this.state.selectedCities = toggleInSet(this.state.selectedCities, city)
  }

  handleBatchToggle = (batch: SiteBatch) => {
    this.state.selectedBatches = toggleInSet(this.state.selectedBatches, batch)
  }

  handleClearFilters = () => {
    this.state.searchQuery = ''
    this.state.selectedStates = new Set<string>()
    this.state.selectedCities = new Set<string>()
    this.state.selectedBatches = new Set<SiteBatch>()
    resetFilterControls(this.el)
  }

  toggleFilters = () => {
    this.state.filtersExpanded = !this.state.filtersExpanded
  }

  get activeFilterCount(): number {
    return countActiveFilters(
      [
        this.state.selectedStates.size,
        this.state.selectedCities.size,
        this.state.selectedBatches.size,
      ],
      this.state.searchQuery,
    )
  }

  template() {
    const filteredBatches = this.filterBatches()
    const hasResults = filteredBatches.length > 0

    return (
      <div class="sites-list">
        <div class="filter-toggle">
          <button
            type="button"
            class="filter-toggle__btn"
            click={this.toggleFilters}
            aria-expanded={this.state.filtersExpanded}
          >
            <span>Filter</span>
            {this.activeFilterCount > 0 ? (
              <span class="filter-toggle__badge">{this.activeFilterCount}</span>
            ) : null}
            <span class="filter-toggle__chevron" aria-hidden="true"></span>
          </button>
          {this.activeFilterCount > 0 ? (
            <button
              type="button"
              class="filter-toggle__clear"
              click={this.handleClearFilters}
            >
              Clear
            </button>
          ) : null}
        </div>

        {this.state.filtersExpanded ? (
          <div class="filters">
            <label class="filters__label">
              <span class="filters__label-text">Search by name</span>
              <input
                type="text"
                class="filters__search"
                placeholder="Enter a site or city…"
                input={this.handleSearchInput}
              />
            </label>

            <details class="filters__group">
              <summary class="filters__group-summary">
                <span class="filters__group-title">State</span>
                {this.state.selectedStates.size > 0 ? (
                  <span class="filter-toggle__badge">
                    {this.state.selectedStates.size}
                  </span>
                ) : null}
              </summary>
              <div class="filters__checkboxes">
                {availableStates.map((stateName) => (
                  <FilterCheckbox
                    label={stateName}
                    checked={this.state.selectedStates.has(stateName)}
                    onChange={() => this.handleStateToggle(stateName)}
                  />
                ))}
              </div>
            </details>

            <details class="filters__group">
              <summary class="filters__group-summary">
                <span class="filters__group-title">City</span>
                {this.state.selectedCities.size > 0 ? (
                  <span class="filter-toggle__badge">
                    {this.state.selectedCities.size}
                  </span>
                ) : null}
              </summary>
              <div class="filters__checkboxes">
                {availableCities.map((city) => (
                  <FilterCheckbox
                    label={city}
                    checked={this.state.selectedCities.has(city)}
                    onChange={() => this.handleCityToggle(city)}
                  />
                ))}
              </div>
            </details>

            <details class="filters__group">
              <summary class="filters__group-summary">
                <span class="filters__group-title">Batch</span>
                {this.state.selectedBatches.size > 0 ? (
                  <span class="filter-toggle__badge">
                    {this.state.selectedBatches.size}
                  </span>
                ) : null}
              </summary>
              <div class="filters__checkboxes">
                {availableBatches.map((batch) => (
                  <FilterCheckbox
                    label={'Batch ' + batch}
                    checked={this.state.selectedBatches.has(batch)}
                    onChange={() => this.handleBatchToggle(batch)}
                  />
                ))}
              </div>
            </details>
          </div>
        ) : null}

        {hasResults ? (
          <div class="sites-batches">
            {filteredBatches.map((batch) => (
              <SitesBatch batch={batch} />
            ))}
          </div>
        ) : (
          <div class="no-results">
            <p>No sites match the selected filters.</p>
            <button
              type="button"
              class="no-results__reset"
              click={this.handleClearFilters}
            >
              Clear filters
            </button>
          </div>
        )}
      </div>
    )
  }
}
