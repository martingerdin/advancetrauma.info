import { Component } from '@geajs/core'
import { sites } from '../data/content'
import SitesFilters from './SitesFilters'
import SitesList from './SitesList'
import SitesMap from './SitesMap'

export default class Sites extends Component {
  template() {
    return (
      <section class="section section--muted" id="sites">
        <div class="section__inner section__inner--split">
          <header class="section__intro">
            <h2 class="section__heading">{sites.title}</h2>
            <p class="section__lead">{sites.lead}</p>
          </header>
          <div class="section__main">
            <SitesMap />
            <SitesFilters />
            <SitesList />
          </div>
        </div>
      </section>
    )
  }
}
