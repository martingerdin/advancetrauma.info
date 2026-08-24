import { Store } from '@geajs/core'
import {
  fetchMeetingDetail,
  fetchMeetingIndex,
  type MeetingDetail,
  type MeetingSummary,
} from '../lib/tmg'

type LoadStatus = 'idle' | 'loading' | 'ready' | 'error'

const SESSION_KEY = 'advance-trauma-tmg-authenticated'

async function sha256Hex(value: string): Promise<string> {
  const encoded = new TextEncoder().encode(value)
  const digest = await crypto.subtle.digest('SHA-256', encoded)
  return Array.from(new Uint8Array(digest))
    .map((byte) => byte.toString(16).padStart(2, '0'))
    .join('')
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
    return Boolean(import.meta.env.VITE_TMG_PASSWORD_HASH)
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

  hydrateAuth() {
    if (this.authInitialized) return

    this.authInitialized = true
    this.authenticated =
      typeof window !== 'undefined' && window.sessionStorage.getItem(SESSION_KEY) === 'true'
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

    if (!this.configured) {
      this.loginError = 'TMG access is not configured yet.'
      return
    }

    const expectedHash = import.meta.env.VITE_TMG_PASSWORD_HASH.trim().toLowerCase()
    const actualHash = await sha256Hex(this.password)

    if (actualHash !== expectedHash) {
      this.loginError = 'Incorrect password.'
      return
    }

    this.password = ''
    this.loginError = ''
    this.authenticated = true
    window.sessionStorage.setItem(SESSION_KEY, 'true')
    await this.loadMeetings()
  }

  logout() {
    this.authenticated = false
    this.password = ''
    this.loginError = ''
    this.detailError = ''
    window.sessionStorage.removeItem(SESSION_KEY)
  }

  async loadMeetings() {
    if (this.indexStatus === 'loading') return

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
