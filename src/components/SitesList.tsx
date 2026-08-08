import { Component } from '@geajs/core'
import {
  participatingSites,
  siteBatchViews,
  type SiteBatch,
  type SiteBatchView,
} from '../data/sites'
import SitesBatch from './SitesBatch'

const availableStates = Array.from(
  new Set(participatingSites.map((site) => site.state)),
).sort()

const availableBatches: SiteBatch[] = ['1', '2', '3', '4', '5', '6']

/** Map to child components — Gea cannot safely `.map()` nested inline JSX. */
export default class SitesList extends Component {
  state = {
    searchQuery: '',
    selectedStates: new Set<string>(),
    selectedBatches: new Set<SiteBatch>(),
    filtersExpanded: false,
  }

  filterBatches(): SiteBatchView[] {
    const hasActiveFilters = this.activeFilterCount > 0
    if (!hasActiveFilters) return siteBatchViews

    const search = this.state.searchQuery.trim().toLowerCase()
    const hasSiteFilters = search !== '' || this.state.selectedStates.size > 0

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

          const matchesSearch =
            !search ||
            site.name.toLowerCase().includes(search) ||
            site.city.toLowerCase().includes(search) ||
            site.state.toLowerCase().includes(search) ||
            site.pi.toLowerCase().includes(search) ||
            (site.coordinators?.toLowerCase().includes(search) ?? false)

          return matchesState && matchesSearch
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
    if (this.state.selectedStates.has(stateName)) {
      this.state.selectedStates.delete(stateName)
    } else {
      this.state.selectedStates.add(stateName)
    }
    this.state.selectedStates = new Set(this.state.selectedStates)
  }

  handleBatchToggle = (batch: SiteBatch) => {
    if (this.state.selectedBatches.has(batch)) {
      this.state.selectedBatches.delete(batch)
    } else {
      this.state.selectedBatches.add(batch)
    }
    this.state.selectedBatches = new Set(this.state.selectedBatches)
  }

  handleClearFilters = () => {
    this.state.searchQuery = ''
    this.state.selectedStates = new Set<string>()
    this.state.selectedBatches = new Set<SiteBatch>()
    const searchInput = this.el?.querySelector(
      '.sites-filters__search',
    ) as HTMLInputElement | null
    if (searchInput) searchInput.value = ''
    this.el
      ?.querySelectorAll<HTMLInputElement>('.sites-filters__checkbox')
      .forEach((checkbox) => {
        checkbox.checked = false
      })
  }

  toggleFilters = () => {
    this.state.filtersExpanded = !this.state.filtersExpanded
  }

  get activeFilterCount(): number {
    let count = this.state.selectedStates.size + this.state.selectedBatches.size
    if (this.state.searchQuery) count += 1
    return count
  }

  template() {
    const filteredBatches = this.filterBatches()
    const hasResults = filteredBatches.length > 0

    return (
      <div class="sites-list">
        <div class="sites-filter-toggle">
          <button
            type="button"
            class="sites-filter-toggle__btn"
            click={this.toggleFilters}
            aria-expanded={this.state.filtersExpanded}
          >
            <span>Filter</span>
            {this.activeFilterCount > 0 ? (
              <span class="sites-filter-toggle__badge">{this.activeFilterCount}</span>
            ) : null}
            <span class="sites-filter-toggle__chevron" aria-hidden="true"></span>
          </button>
          {this.activeFilterCount > 0 ? (
            <button
              type="button"
              class="sites-filter-toggle__clear"
              click={this.handleClearFilters}
            >
              Clear
            </button>
          ) : null}
        </div>

        {this.state.filtersExpanded ? (
          <div class="sites-filters">
            <label class="sites-filters__label">
              <span class="sites-filters__label-text">Search by name</span>
              <input
                type="text"
                class="sites-filters__search"
                placeholder="Enter a site or city…"
                input={this.handleSearchInput}
              />
            </label>

            <details class="sites-filters__group">
              <summary class="sites-filters__group-summary">
                <span class="sites-filters__group-title">State</span>
                {this.state.selectedStates.size > 0 ? (
                  <span class="sites-filter-toggle__badge">
                    {this.state.selectedStates.size}
                  </span>
                ) : null}
              </summary>
              <div class="sites-filters__checkboxes">
                {availableStates.map((stateName) => (
                  <label class="sites-filters__checkbox-label">
                    <input
                      type="checkbox"
                      class="sites-filters__checkbox"
                      checked={this.state.selectedStates.has(stateName)}
                      change={() => this.handleStateToggle(stateName)}
                    />
                    <span class="sites-filters__checkbox-text">{stateName}</span>
                  </label>
                ))}
              </div>
            </details>

            <details class="sites-filters__group">
              <summary class="sites-filters__group-summary">
                <span class="sites-filters__group-title">Batch</span>
                {this.state.selectedBatches.size > 0 ? (
                  <span class="sites-filter-toggle__badge">
                    {this.state.selectedBatches.size}
                  </span>
                ) : null}
              </summary>
              <div class="sites-filters__checkboxes">
                {availableBatches.map((batch) => (
                  <label class="sites-filters__checkbox-label">
                    <input
                      type="checkbox"
                      class="sites-filters__checkbox"
                      checked={this.state.selectedBatches.has(batch)}
                      change={() => this.handleBatchToggle(batch)}
                    />
                    <span class="sites-filters__checkbox-text">Batch {batch}</span>
                  </label>
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
          <div class="sites-no-results">
            <p>No sites match the selected filters.</p>
            <button
              type="button"
              class="sites-no-results__reset"
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
