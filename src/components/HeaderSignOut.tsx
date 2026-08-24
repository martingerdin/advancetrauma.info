import navStore from '../stores/nav-store'
import tmgStore from '../stores/tmg-store'

/** Quiet header action, shown next to TMG once the shared session is active. */
export default function HeaderSignOut() {
  return (
    <button
      class={
        tmgStore.authenticated
          ? 'site-header__sign-out'
          : 'site-header__sign-out site-header__sign-out--hidden'
      }
      type="button"
      click={() => {
        tmgStore.logout()
        navStore.close()
      }}
    >
      Sign out
    </button>
  )
}
