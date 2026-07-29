import { Component } from '@geajs/core'
import { contact } from '../data/content'
import ContactForm from './ContactForm'

export default class Contact extends Component {
  template() {
    return (
      <section class="section section--muted" id="contact">
        <div class="section__inner">
          <h2 class="section__heading">{contact.title}</h2>
          <p class="section__subheading">{contact.subtitle}</p>
          <ContactForm />
        </div>
      </section>
    )
  }
}
