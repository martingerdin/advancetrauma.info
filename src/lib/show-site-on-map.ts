import sitesMapStore from '../stores/sites-map-store'

/** Focus a site on the map from a `data-site` control. */
export function showSiteOnMap(event: Event, options?: { stopPropagation?: boolean }) {
  event.preventDefault()
  if (options?.stopPropagation) event.stopPropagation()
  const name = (event.currentTarget as HTMLElement).getAttribute('data-site')
  if (name) sitesMapStore.show(name)
}
