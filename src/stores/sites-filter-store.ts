import { Store } from '@geajs/core'
import type { SiteBatch, BatchStatus } from '../data/sites'

export type SitesFilterState = {
  search: string
  batches: Set<SiteBatch>
  statuses: Set<BatchStatus>
  cities: Set<string>
}

class SitesFilterStore extends Store<SitesFilterState> {
  constructor() {
    super({
      search: '',
      batches: new Set(),
      statuses: new Set(),
      cities: new Set(),
    })
  }

  setSearch(search: string) {
    this.setState({ search })
  }

  toggleBatch(batch: SiteBatch) {
    const batches = new Set(this.state.batches)
    if (batches.has(batch)) {
      batches.delete(batch)
    } else {
      batches.add(batch)
    }
    this.setState({ batches })
  }

  toggleStatus(status: BatchStatus) {
    const statuses = new Set(this.state.statuses)
    if (statuses.has(status)) {
      statuses.delete(status)
    } else {
      statuses.add(status)
    }
    this.setState({ statuses })
  }

  toggleCity(city: string) {
    const cities = new Set(this.state.cities)
    if (cities.has(city)) {
      cities.delete(city)
    } else {
      cities.add(city)
    }
    this.setState({ cities })
  }

  clearAll() {
    this.setState({
      search: '',
      batches: new Set(),
      statuses: new Set(),
      cities: new Set(),
    })
  }

  hasActiveFilters(): boolean {
    return (
      this.state.search !== '' ||
      this.state.batches.size > 0 ||
      this.state.statuses.size > 0 ||
      this.state.cities.size > 0
    )
  }
}

export default new SitesFilterStore()
