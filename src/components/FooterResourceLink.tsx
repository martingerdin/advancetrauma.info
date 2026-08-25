import { Component } from '@geajs/core'
import type { footer } from '../data/content'

type FooterResource = (typeof footer.resources)[number]

/** Footer resources list item. */
export default class FooterResourceLink extends Component {
  declare props: {
    item: FooterResource
  }

  template({ item }: this['props']) {
    if (item.download) {
      return (
        <li>
          <a href={item.href} download>
            {item.label}
          </a>
        </li>
      )
    }

    return (
      <li>
        <a href={item.href} target="_blank" rel="noopener noreferrer">
          {item.label}
        </a>
      </li>
    )
  }
}
