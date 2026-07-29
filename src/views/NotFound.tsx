import { Component, Link } from '@geajs/core'

const RouteLink = Link

export default class NotFound extends Component {
  template() {
    return (
      <div class="not-found">
        <h1>Page not found</h1>
        <p>That page does not exist.</p>
        <RouteLink to="/" class="cta" label="Back to home" />
      </div>
    )
  }
}
