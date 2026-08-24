import { Component } from '@geajs/core'
import navStore from '../stores/nav-store'

/** One link in the header portal group (TMG, future patient/investigator areas, etc.). */
export default class PortalNavLink extends Component {
  declare props: {
    href: string
    label: string
    /** First portal after public section links — shows the group divider. */
    divided?: boolean
  }

  template({ href, label, divided }: this['props']) {
    return (
      <li class={divided ? 'site-header__portal-item site-header__portal-item--start' : 'site-header__portal-item'}>
        <a class="site-header__portal" href={href} click={() => navStore.close()}>
          {label}
        </a>
      </li>
    )
  }
}
