import { Store } from '@geajs/core'
import {
  fetchMeetingDetail,
  fetchMeetingIndex,
  type MeetingDetail,
  type MeetingSummary,
} from '../lib/tmg'

type LoadStatus = 'idle' | 'loading' | 'ready' | 'error'

/** Session proof must equal the configured password hash (not a forgeable "true" flag). */
const SESSION_KEY = 'advance-trauma-tmg-session'

async function sha256Hex(value: string): Promise<string> {
  const encoded = new TextEncoder().encode(value)
  const digest = await crypto.subtle.digest('SHA-256', encoded)
  return Array.from(new Uint8Array(digest))
    .map((byte) => byte.toString(16).padStart(2, '0'))
    .join('')
}

/** Constant-time string compare to avoid leaking hash length/prefix via early exit. */
function timingSafeEqual(left: string, right: string): boolean {
  const length = Math.max(left.length, right.length)
  let mismatch = left.length === right.length ? 0 : 1

  for (let index = 0; index < length; index += 1) {
    const a = left.charCodeAt(index) || 0
    const b = right.charCodeAt(index) || 0
    mismatch |= a ^ b
  }

  return mismatch === 0
}

function expectedPasswordHash(): string {
  return (import.meta.env.VITE_TMG_PASSWORD_HASH ?? '').trim().toLowerCase()
}

class TmgStore extends Store {
  password = ''
  loginError = ''
  authenticated = false
  authInitialized = false

  meetings: MeetingSummary[] = []
  selectedMeetingId = ''
  selectedMeeting: MeetingDetail | null = null

  indexStatus: LoadStatus = 'idle'
  detailStatus: LoadStatus = 'idle'
  detailError = ''

  get configured(): boolean {
    return Boolean(expectedPasswordHash())
  }

  get loginStatusMessage(): string {
    if (!this.configured) return 'TMG access is not configured yet.'
    if (this.loginError) return this.loginError
    return 'Enter the shared password to view the latest TMG meeting materials.'
  }

  get loginStatusClass(): string {
    if (!this.configured || this.loginError) {
      return 'contact-form__status contact-form__status--error'
    }
    return 'contact-form__status'
  }

  get meetingsMessage(): string {
    if (this.indexStatus === 'idle' || this.indexStatus === 'loading') return 'Loading meetings…'
    if (this.indexStatus === 'error') {
      return this.detailError || 'Unable to load TMG meetings from GitHub.'
    }
    if (this.indexStatus === 'ready' && this.meetings.length === 0) return 'No meetings found.'
    return ''
  }

  get meetingsMessageClass(): string {
    if (this.indexStatus === 'error') {
      return 'tmg-meeting-list__status tmg-meeting-list__status--error'
    }
    return 'tmg-meeting-list__status'
  }

  private readSessionProof(): string {
    if (typeof window === 'undefined') return ''
    return window.sessionStorage.getItem(SESSION_KEY) ?? ''
  }

  private hasValidSession(): boolean {
    const expected = expectedPasswordHash()
    if (!expected) return false
    return timingSafeEqual(this.readSessionProof(), expected)
  }

  hydrateAuth() {
    if (this.authInitialized) return

    this.authInitialized = true
    this.authenticated = this.hasValidSession()

    // Drop legacy forgeable "true" flags and any other invalid proof.
    if (!this.authenticated && typeof window !== 'undefined') {
      window.sessionStorage.removeItem(SESSION_KEY)
      window.sessionStorage.removeItem('advance-trauma-tmg-authenticated')
    }
  }

  initialize() {
    this.hydrateAuth()

    if (this.authenticated && this.indexStatus === 'idle') {
      void this.loadMeetings()
    }
  }

  setPassword(value: string) {
    this.password = value
    if (this.loginError) this.loginError = ''
  }

  async submitPassword(event: Event) {
    event.preventDefault()

    const expectedHash = expectedPasswordHash()
    if (!expectedHash) {
      this.loginError = 'TMG access is not configured yet.'
      return
    }

    const actualHash = await sha256Hex(this.password)

    if (!timingSafeEqual(actualHash, expectedHash)) {
      this.loginError = 'Incorrect password.'
      return
    }

    this.password = ''
    this.loginError = ''
    this.authenticated = true
    window.sessionStorage.setItem(SESSION_KEY, expectedHash)
    await this.loadMeetings()
  }

  logout() {
    this.authenticated = false
    this.password = ''
    this.loginError = ''
    this.detailError = ''
    this.meetings = []
    this.selectedMeetingId = ''
    this.selectedMeeting = null
    this.indexStatus = 'idle'
    this.detailStatus = 'idle'
    window.sessionStorage.removeItem(SESSION_KEY)
    window.sessionStorage.removeItem('advance-trauma-tmg-authenticated')
  }

  async loadMeetings() {
    if (this.indexStatus === 'loading') return
    if (!this.hasValidSession()) {
      this.logout()
      return
    }

    this.indexStatus = 'loading'
    this.detailError = ''

    try {
      this.meetings = await fetchMeetingIndex()
      this.indexStatus = 'ready'

      if (this.meetings.length === 0) {
        this.selectedMeetingId = ''
        this.selectedMeeting = null
        return
      }

      if (!this.selectedMeetingId) {
        this.selectedMeetingId = this.meetings[0].id
      }

      await this.loadSelectedMeeting()
    } catch (error) {
      this.indexStatus = 'error'
      this.detailError =
        error instanceof Error ? error.message : 'Unable to load TMG meetings from GitHub.'
    }
  }

  async selectMeeting(id: string) {
    if (id === this.selectedMeetingId && this.selectedMeeting) return
    this.selectedMeetingId = id
    await this.loadSelectedMeeting()
  }

  async loadSelectedMeeting() {
    const meeting = this.meetings.find((item) => item.id === this.selectedMeetingId)
    if (!meeting) return
    if (!this.hasValidSession()) {
      this.logout()
      return
    }

    this.detailStatus = 'loading'
    this.detailError = ''

    try {
      this.selectedMeeting = await fetchMeetingDetail(meeting)
      this.detailStatus = 'ready'
    } catch (error) {
      this.detailStatus = 'error'
      this.detailError =
        error instanceof Error ? error.message : 'Unable to load the selected meeting.'
    }
  }
}

const tmgStore = new TmgStore()
tmgStore.hydrateAuth()

export default tmgStore
