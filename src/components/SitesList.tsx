import { Component } from '@geajs/core'
import { siteBatches } from '../data/sites'

export default class SitesList extends Component {
  template() {
    return (
      <div class="sites-batches">
        <div class="sites-batch">
          <h3 class="sites-batch__title sites-batch__title--1">{siteBatches[0].title}</h3>
          <ul class="sites-list">
            {siteBatches[0].sites.map((site) => (
              <li>
                <a href={site.website} target="_blank" rel="noopener noreferrer">
                  {site.name}
                </a>
                <span class="sites-list__city">{site.city}</span>
              </li>
            ))}
          </ul>
        </div>
        <div class="sites-batch">
          <h3 class="sites-batch__title sites-batch__title--2">{siteBatches[1].title}</h3>
          <ul class="sites-list">
            {siteBatches[1].sites.map((site) => (
              <li>
                <a href={site.website} target="_blank" rel="noopener noreferrer">
                  {site.name}
                </a>
                <span class="sites-list__city">{site.city}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    )
  }
}
