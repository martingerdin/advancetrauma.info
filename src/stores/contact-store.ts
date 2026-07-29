import { Store } from '@geajs/core'

export type ContactStatus = 'idle' | 'submitting' | 'success' | 'error'

class ContactStore extends Store {
  name = ''
  email = ''
  message = ''
  status: ContactStatus = 'idle'
  statusMessage = ''

  setName(value: string) {
    this.name = value
  }

  setEmail(value: string) {
    this.email = value
  }

  setMessage(value: string) {
    this.message = value
  }

  reset() {
    this.name = ''
    this.email = ''
    this.message = ''
  }

  async submit(event: Event) {
    event.preventDefault()

    const accessKey = import.meta.env.VITE_WEB3FORMS_ACCESS_KEY
    if (!accessKey) {
      this.status = 'error'
      this.statusMessage = 'Contact form is not configured.'
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
          name: this.name,
          email: this.email,
          message: this.message,
        }),
      })

      const data = await response.json()
      if (response.status === 200) {
        this.status = 'success'
        this.statusMessage = data.message || 'Message sent successfully.'
        this.reset()
      } else {
        this.status = 'error'
        this.statusMessage = data.message || 'Something went wrong.'
      }
    } catch {
      this.status = 'error'
      this.statusMessage = 'Something went wrong!'
    }
  }
}

export default new ContactStore()
