import { Component } from '@geajs/core'
import { scrollToSection } from '../lib/scroll-to-section'
import navStore from '../stores/nav-store'

function goToSection(event: Event) {
  navStore.close()
  const id = (event.currentTarget as HTMLElement).getAttribute('data-section')
  if (id) scrollToSection(event, id)
}

/** In-page section link for header and footer navigation. */
export default class SectionNavLink extends Component {
  declare props: {
    href: string
    id: string
    label: string
  }

  template({ href, id, label }: this['props']) {
    return (
      <li>
        <a href={href} data-section={id} click={goToSection}>
          {label}
        </a>
      </li>
    )
  }
}
