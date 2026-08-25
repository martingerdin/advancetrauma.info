import { Component } from '@geajs/core'
import { footer } from '../data/content'

/** Footer credit line naming the collaborating institutions. */
export default class FooterCredit extends Component {
  template() {
    return (
      <p class="site-footer__credit">
        <span>{footer.creditPrefix}</span>
        <span> </span>
        <a href={footer.partners[0].href} target="_blank" rel="noopener noreferrer">
          {footer.partners[0].name}
        </a>
        <span>, the </span>
        <a href={footer.partners[1].href} target="_blank" rel="noopener noreferrer">
          {footer.partners[1].name}
        </a>
        <span>, and the </span>
        <a href={footer.partners[2].href} target="_blank" rel="noopener noreferrer">
          {footer.partners[2].name}
        </a>
        <span>.</span>
      </p>
    )
  }
}
