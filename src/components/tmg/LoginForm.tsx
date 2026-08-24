import { Component } from '@geajs/core'

export default class LoginForm extends Component {
  declare props: {
    configured: boolean
    password: string
    errorMessage: string
    onInput: (event: Event) => void
    onSubmit: (event: Event) => void
  }

  template({ configured, password, errorMessage, onInput, onSubmit }: this['props']) {
    return (
      <form class="tmg-login" submit={onSubmit}>
        <label class="tmg-login__label">
          <span class="tmg-login__label-text">TMG password</span>
          <input
            class="tmg-login__input"
            type="password"
            name="password"
            autocomplete="current-password"
            placeholder="Enter password"
            value={password}
            input={onInput}
            disabled={!configured}
            required
          />
        </label>
        <button class="cta" type="submit" disabled={!configured}>
          Access TMG updates
        </button>
        {!configured ? (
          <p class="tmg-login__status tmg-login__status--error">
            TMG access is not configured yet.
          </p>
        ) : errorMessage ? (
          <p class="tmg-login__status tmg-login__status--error">{errorMessage}</p>
        ) : (
          <p class="tmg-login__status">
            Enter the shared password to view the latest TMG meeting materials.
          </p>
        )}
      </form>
    )
  }
}
