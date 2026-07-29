import { Component } from '@geajs/core'

export default class SiteHeader extends Component {
  template() {
    return (
      <header class="site-header">
        <a class="site-header__brand" href="/">
          <img class="site-header__mark" src="/brandmark.png" alt="" />
          <span>ADVANCE TRAUMA</span>
        </a>
        <nav aria-label="Page sections">
          <ul class="site-header__nav">
            <li>
              <a href="#summary">Summary</a>
            </li>
            <li>
              <a href="#sites">Sites</a>
            </li>
            <li>
              <a href="#contact">Contact</a>
            </li>
          </ul>
        </nav>
      </header>
    )
  }
}
