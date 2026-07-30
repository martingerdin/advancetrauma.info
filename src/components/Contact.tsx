import { Component } from '@geajs/core'
import { contact } from '../data/content'
import ContactForm from './ContactForm'

export default class Contact extends Component {
  template() {
    return (
      <section class="section" id="contact">
        <div class="section__inner section__inner--split">
          <header class="section__intro">
            <h2 class="section__heading">{contact.title}</h2>
            <p class="section__lead">{contact.lead}</p>
          </header>
          <ContactForm />
        </div>
      </section>
    )
  }
}
