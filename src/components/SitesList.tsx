import { Component } from '@geajs/core'
import { siteBatchViews } from '../data/sites'
import SitesBatch from './SitesBatch'

/** Map to child components — Gea cannot safely `.map()` nested inline JSX. */
export default class SitesList extends Component {
  template() {
    return (
      <div class="sites-batches">
        {siteBatchViews.map((batch) => (
          <SitesBatch batch={batch} />
        ))}
      </div>
    )
  }
}
