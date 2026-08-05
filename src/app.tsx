import { Component, RouterView } from '@geajs/core'
import CookieBanner from './components/CookieBanner'
import SiteFooter from './components/SiteFooter'
import SiteHeader from './components/SiteHeader'
import { router } from './router'

// Keep a local binding so the Vite/Rollup build does not tree-shake the
// RouterView import away (Gea's JSX transform references it by name).
const RouteOutlet = RouterView

export default class App extends Component {
  template() {
    return (
      <div class="site-shell">
        <SiteHeader />
        <main class="site-main">
          <RouteOutlet router={router} />
        </main>
        <SiteFooter />
        <CookieBanner />
      </div>
    )
  }
}
