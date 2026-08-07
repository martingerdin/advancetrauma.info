import { Store } from '@geajs/core'
import type { SiteBatch, BatchStatus } from '../data/sites'

class SitesFilterStore extends Store {
  search = ''
  batches = new Set<SiteBatch>()
  statuses = new Set<BatchStatus>()
  cities = new Set<string>()

  setSearch(search: string) {
    this.search = search
  }

  toggleBatch(batch: SiteBatch) {
    if (this.batches.has(batch)) {
      this.batches.delete(batch)
    } else {
      this.batches.add(batch)
    }
    // Trigger update
    this.batches = new Set(this.batches)
  }

  toggleStatus(status: BatchStatus) {
    if (this.statuses.has(status)) {
      this.statuses.delete(status)
    } else {
      this.statuses.add(status)
    }
    // Trigger update
    this.statuses = new Set(this.statuses)
  }

  toggleCity(city: string) {
    if (this.cities.has(city)) {
      this.cities.delete(city)
    } else {
      this.cities.add(city)
    }
    // Trigger update
    this.cities = new Set(this.cities)
  }

  clearAll() {
    this.search = ''
    this.batches = new Set()
    this.statuses = new Set()
    this.cities = new Set()
  }

  hasActiveFilters(): boolean {
    return (
      this.search !== '' ||
      this.batches.size > 0 ||
      this.statuses.size > 0 ||
      this.cities.size > 0
    )
  }
}

export default new SitesFilterStore()
