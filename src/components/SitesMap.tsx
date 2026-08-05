import { Component } from '@geajs/core'
import { cookieConsent } from '../data/content'
import cookieConsentStore from '../stores/cookie-consent-store'
import SitesMapCanvas from './SitesMapCanvas'

export default class SitesMap extends Component {
  template() {
    return (
      <div>
        {cookieConsentStore.status === 'accepted' ? (
          <SitesMapCanvas />
        ) : (
          <div
            class="sites-map sites-map--consent"
            data-map
            role="region"
            aria-label="Participating sites map"
          >
            <p class="sites-map__consent-text">{cookieConsent.mapPrompt}</p>
            <button
              type="button"
              class="cta"
              click={() => cookieConsentStore.accept()}
            >
              {cookieConsent.mapLoad}
            </button>
          </div>
        )}
      </div>
    )
  }
}
