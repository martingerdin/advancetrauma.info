import { Component } from '@geajs/core'
import { about } from '../data/content'

export default class About extends Component {
  template() {
    return (
      <section class="section section--muted" id="about">
        <div class="section__inner">
          <h2 class="section__heading">{about.title}</h2>
          <p class="section__subheading">{about.subtitle}</p>
          <div class="section__body">
            {about.paragraphs.map((paragraph) => (
              <p>{paragraph}</p>
            ))}
            <p>
              We are an international collaboration led by researchers at{' '}
              <a href={about.partners[0].href} target="_blank" rel="noopener noreferrer">
                {about.partners[0].name}
              </a>
              , the{' '}
              <a href={about.partners[1].href} target="_blank" rel="noopener noreferrer">
                {about.partners[1].name}
              </a>
              , and the{' '}
              <a href={about.partners[2].href} target="_blank" rel="noopener noreferrer">
                {about.partners[2].name}
              </a>
              .
            </p>
            <p class="section__resources">
              <a href={about.resources[0].href} download>
                {about.resources[0].label}
              </a>
              <span aria-hidden="true">·</span>
              <a href={about.resources[1].href} target="_blank" rel="noopener noreferrer">
                {about.resources[1].label}
              </a>
              <span aria-hidden="true">·</span>
              <a href={about.resources[2].href} target="_blank" rel="noopener noreferrer">
                {about.resources[2].label}
              </a>
            </p>
          </div>
        </div>
      </section>
    )
  }
}
