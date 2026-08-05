import { Component } from '@geajs/core'
import { cookieConsent } from '../data/content'
import cookieConsentStore from '../stores/cookie-consent-store'

export default class CookieBanner extends Component {
  template() {
    return cookieConsentStore.status === 'pending' ? (
      <div
        class="cookie-banner"
        role="dialog"
        aria-live="polite"
        aria-label={cookieConsent.title}
      >
        <div class="cookie-banner__inner">
          <p class="cookie-banner__text">{cookieConsent.message}</p>
          <div class="cookie-banner__actions">
            <button
              type="button"
              class="cta cta--secondary"
              click={() => cookieConsentStore.decline()}
            >
              {cookieConsent.decline}
            </button>
            <button
              type="button"
              class="cta"
              click={() => cookieConsentStore.accept()}
            >
              {cookieConsent.accept}
            </button>
          </div>
        </div>
      </div>
    ) : null
  }
}
