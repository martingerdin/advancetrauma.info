import { Component } from '@geajs/core'
import { sanitizeMeetingHtml } from '../../lib/sanitize-html'

export default class MeetingHtml extends Component {
  declare props: {
    markup: string
  }

  onAfterRender() {
    if (!this.el) return
    // Defense in depth: sanitize again at the DOM sink.
    this.el.innerHTML = sanitizeMeetingHtml(this.props.markup)
  }

  template() {
    return <div class="tmg-meeting-content__body"></div>
  }
}
