import { Component } from '@geajs/core'
import { sites } from '../data/content'
import SitesList from './SitesList'
import SitesMap from './SitesMap'

export default class Sites extends Component {
  template() {
    return (
      <section class="section section--muted" id="sites">
        <div class="section__inner">
          <h2 class="section__heading">{sites.title}</h2>
          <p class="section__subheading">{sites.subtitle}</p>
          <SitesMap />
          <SitesList />
        </div>
      </section>
    )
  }
}
