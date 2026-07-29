import { Component } from '@geajs/core'
import contactStore from '../stores/contact-store'

export default class ContactForm extends Component {
  template() {
    const statusClass =
      contactStore.status === 'success'
        ? 'contact-form__status contact-form__status--ok'
        : contactStore.status === 'error'
          ? 'contact-form__status contact-form__status--error'
          : 'contact-form__status'

    return (
      <form class="contact-form" submit={(e: Event) => contactStore.submit(e)}>
        <label>
          Name
          <input
            type="text"
            name="name"
            required
            value={contactStore.name}
            input={(e: Event) => contactStore.setName((e.target as HTMLInputElement).value)}
          />
        </label>
        <label>
          Email
          <input
            type="email"
            name="email"
            required
            value={contactStore.email}
            input={(e: Event) => contactStore.setEmail((e.target as HTMLInputElement).value)}
          />
        </label>
        <label>
          Message
          <textarea
            name="message"
            required
            value={contactStore.message}
            input={(e: Event) => contactStore.setMessage((e.target as HTMLTextAreaElement).value)}
          />
        </label>
        <button class="cta" type="submit" disabled={contactStore.status === 'submitting'}>
          Submit
        </button>
        <p class={statusClass}>{contactStore.statusMessage}</p>
      </form>
    )
  }
}
