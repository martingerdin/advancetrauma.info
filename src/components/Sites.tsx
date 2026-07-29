import { Component } from '@geajs/core'
import { sites } from '../data/content'
import SitesMap from './SitesMap'

export default class Sites extends Component {
  template() {
    return (
      <section class="section" id="sites">
        <div class="section__inner section__inner--wide">
          <h2 class="section__heading">{sites.title}</h2>
          <p class="section__subheading">{sites.subtitle}</p>
          <SitesMap />
        </div>
      </section>
    )
  }
}
