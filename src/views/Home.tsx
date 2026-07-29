import { Component } from '@geajs/core'
import ContactForm from '../components/ContactForm'
import Hero from '../components/Hero'
import SitesMap from '../components/SitesMap'
import { links, summaryParagraphs } from '../data/content'

export default class Home extends Component {
  template() {
    return (
      <div>
        <Hero />

        <section class="section section--muted" id="summary">
          <div class="section__inner">
            <h2 class="section__heading">Summary</h2>
            <div class="section__body">
              {summaryParagraphs.map((paragraph) => (
                <p>{paragraph}</p>
              ))}
              <p>
                It is an international collaboration led by researchers at{' '}
                <a href={links.karolinska} target="_blank" rel="noopener noreferrer">
                  Karolinska Institutet
                </a>
                , the{' '}
                <a href={links.georgeInstitute} target="_blank" rel="noopener noreferrer">
                  George Institute for Global Health in India
                </a>
                , and the{' '}
                <a href={links.birmingham} target="_blank" rel="noopener noreferrer">
                  University of Birmingham
                </a>
                .
              </p>
            </div>
          </div>
        </section>

        <section class="section" id="sites">
          <div class="section__inner section__inner--wide">
            <h2 class="section__heading">Participating Sites</h2>
            <p class="section__subheading">
              Explore the hospitals participating in the ADVANCE TRAUMA trial across India.
            </p>
            <SitesMap />
          </div>
        </section>

        <section class="section section--muted" id="contact">
          <div class="section__inner">
            <h2 class="section__heading">Contact Us</h2>
            <p class="section__subheading">
              If you have any questions about the ADVANCE TRAUMA trial, please contact us.
            </p>
            <ContactForm />
          </div>
        </section>
      </div>
    )
  }
}
