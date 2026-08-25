import { Store } from '@geajs/core'

export type ContactStatus = 'idle' | 'submitting' | 'success' | 'error'

const MAX_NAME_LENGTH = 120
const MAX_EMAIL_LENGTH = 254
const MAX_MESSAGE_LENGTH = 5000

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

class ContactStore extends Store {
  name = ''
  email = ''
  message = ''
  /** Honeypot for bots; must stay empty. */
  website = ''
  status: ContactStatus = 'idle'
  statusMessage = ''

  setName(value: string) {
    this.name = value.slice(0, MAX_NAME_LENGTH)
  }

  setEmail(value: string) {
    this.email = value.slice(0, MAX_EMAIL_LENGTH)
  }

  setMessage(value: string) {
    this.message = value.slice(0, MAX_MESSAGE_LENGTH)
  }

  setWebsite(value: string) {
    this.website = value
  }

  reset() {
    this.name = ''
    this.email = ''
    this.message = ''
    this.website = ''
  }

  async submit(event: Event) {
    event.preventDefault()

    const accessKey = import.meta.env.VITE_WEB3FORMS_ACCESS_KEY
    if (!accessKey) {
      this.status = 'error'
      this.statusMessage = 'Contact form is not configured.'
      return
    }

    // Silent success for bots that fill the honeypot.
    if (this.website.trim()) {
      this.status = 'success'
      this.statusMessage = 'Message sent successfully.'
      this.reset()
      return
    }

    const name = this.name.trim()
    const email = this.email.trim()
    const message = this.message.trim()

    if (!name || !email || !message) {
      this.status = 'error'
      this.statusMessage = 'Please fill in all fields.'
      return
    }

    if (!EMAIL_PATTERN.test(email)) {
      this.status = 'error'
      this.statusMessage = 'Please enter a valid email address.'
      return
    }

    this.status = 'submitting'
    this.statusMessage = 'Please wait...'

    try {
      const response = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({
          access_key: accessKey,
          subject: 'ADVANCE TRAUMA Trial - Contact Form Submission',
          name,
          email,
          message,
          // Web3Forms botcheck: non-empty value marks the submission as spam.
          botcheck: this.website,
        }),
      })

      const payload = (await response.json()) as { success?: boolean }
      if (response.ok && payload.success !== false) {
        this.status = 'success'
        // Use a fixed success copy; do not render untrusted API strings into the UI.
        this.statusMessage = 'Message sent successfully.'
        this.reset()
      } else {
        this.status = 'error'
        this.statusMessage = 'Something went wrong. Please try again later.'
      }
    } catch {
      this.status = 'error'
      this.statusMessage = 'Something went wrong!'
    }
  }
}

export default new ContactStore()
