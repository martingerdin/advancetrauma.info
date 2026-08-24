import { Component } from '@geajs/core'
import { siteRevision } from '../lib/site-revision'

/** Footer link to the current site revision on GitHub. */
export default class FooterUpdatedLink extends Component {
  template() {
    return (
      <a
        class="site-footer__updated"
        href={siteRevision.href}
        target="_blank"
        rel="noopener noreferrer"
        title={siteRevision.shortSha}
      >
        <span>Updated</span>
        <time datetime={siteRevision.isoDate}>{siteRevision.dateLabel}</time>
      </a>
    )
  }
}
