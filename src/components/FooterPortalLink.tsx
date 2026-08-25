import { Component } from '@geajs/core'

/** Portal area link (e.g. TMG) in the footer navigate list. */
export default class FooterPortalLink extends Component {
  declare props: {
    href: string
    label: string
  }

  template({ href, label }: this['props']) {
    return (
      <li>
        <a href={href}>{label}</a>
      </li>
    )
  }
}
