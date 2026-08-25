import { Component } from '@geajs/core'
import tmgStore from '../../stores/tmg-store'

export default class LoginForm extends Component {
  template() {
    return (
      <div class="tmg__login-card">
        <form class="contact-form" submit={(event: Event) => tmgStore.submitPassword(event)}>
          <label>
            TMG password
            <input
              type="password"
              name="password"
              autocomplete="current-password"
              placeholder="Enter password"
              value={tmgStore.password}
              input={(event: Event) => tmgStore.setPassword((event.target as HTMLInputElement).value)}
              disabled={!tmgStore.configured}
              required
            />
          </label>
          <button class="cta" type="submit" disabled={!tmgStore.configured}>
            Access TMG updates
          </button>
          <p class={tmgStore.loginStatusClass}>{tmgStore.loginStatusMessage}</p>
        </form>
      </div>
    )
  }
}
