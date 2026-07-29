import { Component } from '@geajs/core'
import { scrollToSection } from '../lib/scroll-to-section'

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
              <a href="#about" click={(e: Event) => scrollToSection(e, 'about')}>
                About
              </a>
            </li>
            <li>
              <a href="#resources" click={(e: Event) => scrollToSection(e, 'resources')}>
                Resources
              </a>
            </li>
            <li>
              <a href="#sites" click={(e: Event) => scrollToSection(e, 'sites')}>
                Sites
              </a>
            </li>
            <li>
              <a href="#contact" click={(e: Event) => scrollToSection(e, 'contact')}>
                Contact
              </a>
            </li>
          </ul>
        </nav>
      </header>
    )
  }
}
