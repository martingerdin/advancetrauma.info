import { Component } from '@geajs/core'

function scrollToSection(event: Event, id: string) {
  event.preventDefault()
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  history.replaceState(null, '', `#${id}`)
}

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
              <a href="#summary" click={(e: Event) => scrollToSection(e, 'summary')}>
                Summary
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
