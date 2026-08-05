let mapsLoader: Promise<void> | null = null

export function loadGoogleMaps(apiKey: string): Promise<void> {
  if (window.google?.maps) {
    return Promise.resolve()
  }

  if (mapsLoader) {
    return mapsLoader
  }

  mapsLoader = new Promise((resolve, reject) => {
    let settled = false

    const fail = (error: Error) => {
      if (settled) return
      settled = true
      mapsLoader = null
      reject(error)
    }

    const succeed = () => {
      if (settled) return
      settled = true
      resolve()
    }

    const previousAuthFailure = window.gm_authFailure
    window.gm_authFailure = () => {
      previousAuthFailure?.()
      fail(new Error('Google Maps authentication failed'))
    }

    const existing = document.querySelector<HTMLScriptElement>('script[data-google-maps]')
    if (existing) {
      existing.addEventListener('load', () => queueMicrotask(finishLoad))
      existing.addEventListener('error', () => fail(new Error('Failed to load Google Maps')))
      return
    }

    const script = document.createElement('script')
    // language=en keeps map UI/controls in English regardless of browser locale
    script.src = `https://maps.googleapis.com/maps/api/js?key=${encodeURIComponent(apiKey)}&language=en`
    script.async = true
    script.defer = true
    script.dataset.googleMaps = 'true'
    script.onload = () => queueMicrotask(finishLoad)
    script.onerror = () => fail(new Error('Failed to load Google Maps'))
    document.head.appendChild(script)

    function finishLoad() {
      if (!window.google?.maps) {
        fail(new Error('Google Maps failed to initialize'))
        return
      }
      succeed()
    }
  })

  return mapsLoader
}
