import { Component } from '@geajs/core'
import { resources } from '../data/content'

export default class Resources extends Component {
  template() {
    return (
      <section class="section" id="resources">
        <div class="section__inner">
          <h2 class="section__heading">{resources.title}</h2>
          <p class="section__subheading">{resources.subtitle}</p>
          <div class="resource-cards">
            <a
              class="resource-card"
              href={resources.items[0].href}
              download
            >
              <h3 class="resource-card__title">{resources.items[0].label}</h3>
              <p class="resource-card__description">{resources.items[0].description}</p>
            </a>
            <a
              class="resource-card"
              href={resources.items[1].href}
              target="_blank"
              rel="noopener noreferrer"
            >
              <h3 class="resource-card__title">{resources.items[1].label}</h3>
              <p class="resource-card__description">{resources.items[1].description}</p>
            </a>
            <a
              class="resource-card"
              href={resources.items[2].href}
              target="_blank"
              rel="noopener noreferrer"
            >
              <h3 class="resource-card__title">{resources.items[2].label}</h3>
              <p class="resource-card__description">{resources.items[2].description}</p>
            </a>
          </div>
        </div>
      </section>
    )
  }
}
