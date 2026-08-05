import { Store } from '@geajs/core'

export type CookieConsentStatus = 'pending' | 'accepted' | 'declined'

const STORAGE_KEY = 'advancetrauma-cookie-consent'

function readStoredConsent(): CookieConsentStatus {
  try {
    const value = localStorage.getItem(STORAGE_KEY)
    if (value === 'accepted' || value === 'declined') return value
  } catch {
    // Private browsing or blocked storage — treat as undecided.
  }
  return 'pending'
}

function writeStoredConsent(status: CookieConsentStatus) {
  try {
    localStorage.setItem(STORAGE_KEY, status)
  } catch {
    // Ignore write failures; in-memory status still applies for this session.
  }
}

class CookieConsentStore extends Store {
  status: CookieConsentStatus = readStoredConsent()

  accept() {
    this.status = 'accepted'
    writeStoredConsent('accepted')
  }

  decline() {
    this.status = 'declined'
    writeStoredConsent('declined')
  }
}

export default new CookieConsentStore()
