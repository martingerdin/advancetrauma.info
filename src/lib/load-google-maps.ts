import { importLibrary, setOptions } from '@googlemaps/js-api-loader'

let mapsReady: Promise<void> | null = null

/**
 * Load the Maps JS API via dynamic library import (recommended loading pattern).
 * See https://developers.google.com/maps/documentation/javascript/load-maps-js-api
 */
export function loadGoogleMaps(apiKey: string): Promise<void> {
  if (mapsReady) return mapsReady

  setOptions({
    key: apiKey,
    v: 'weekly',
    language: 'en',
  })

  mapsReady = Promise.all([importLibrary('maps'), importLibrary('marker')])
    .then(() => undefined)
    .catch((error) => {
      mapsReady = null
      throw error
    })

  return mapsReady
}
