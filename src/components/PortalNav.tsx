import { Component } from '@geajs/core'
import { portals } from '../data/portals'
import HeaderSignOut from './HeaderSignOut'
import PortalNavLink from './PortalNavLink'

/** Header portal group — visually separated from public section links. */
export default class PortalNav extends Component {
  template() {
    return (
      <li class="site-header__portals">
        {portals.map((portal) => (
          <PortalNavLink key={portal.id} href={portal.href} label={portal.label} />
        ))}
        <HeaderSignOut />
      </li>
    )
  }
}
