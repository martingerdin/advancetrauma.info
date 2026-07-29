import { Component } from '@geajs/core'
import { links } from '../data/content'

export default class SiteFooter extends Component {
  template() {
    return (
      <footer class="site-footer">
        <p>
          <a href={links.github} target="_blank" rel="noopener noreferrer">
            View source on GitHub
          </a>
        </p>
      </footer>
    )
  }
}
