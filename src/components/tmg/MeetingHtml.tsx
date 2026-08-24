import { Component } from '@geajs/core'

export default class MeetingHtml extends Component {
  declare props: {
    markup: string
  }

  onAfterRender() {
    if (this.el) this.el.innerHTML = this.props.markup
  }

  template() {
    return <div class="tmg-meeting-content__body"></div>
  }
}
