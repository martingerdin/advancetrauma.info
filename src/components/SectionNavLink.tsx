import { Component } from '@geajs/core'
import { scrollToSection } from '../lib/scroll-to-section'
import navStore from '../stores/nav-store'

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
        <a
          href={href}
          click={(event: Event) => {
            navStore.close()
            scrollToSection(event, id)
          }}
        >
          {label}
        </a>
      </li>
    )
  }
}
