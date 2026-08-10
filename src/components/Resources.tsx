import { Component } from '@geajs/core'
import { resources } from '../data/content'
import ResourceCard from './ResourceCard'

export default class Resources extends Component {
  template() {
    return (
      <section class="section" id="resources">
        <div class="section__inner section__inner--split">
          <header class="section__intro">
            <h2 class="section__heading">{resources.title}</h2>
            <p class="section__lead">{resources.lead}</p>
          </header>
          <div class="resource-cards">
            {resources.items.map((item) => (
              <ResourceCard item={item} />
            ))}
          </div>
        </div>
      </section>
    )
  }
}
