import { Component } from '@geajs/core'
import navStore from '../stores/nav-store'
import tmgStore from '../stores/tmg-store'

/** Quiet header action, shown next to TMG once the shared session is active. */
export default class HeaderSignOut extends Component {
  template() {
    return (
      <li
        class={
          tmgStore.authenticated
            ? 'site-header__sign-out-item'
            : 'site-header__sign-out-item site-header__sign-out-item--hidden'
        }
      >
        <button
          class="site-header__sign-out"
          type="button"
          click={() => {
            tmgStore.logout()
            navStore.close()
          }}
        >
          Sign out
        </button>
      </li>
    )
  }
}
