import { Component } from '@geajs/core'
import { openSiteCard } from '../lib/focus-card'
import { showSiteOnMap } from '../lib/show-site-on-map'

function viewSite(event: Event) {
  event.preventDefault()
  event.stopPropagation()
  const name = (event.currentTarget as HTMLElement).getAttribute('data-site')
  if (name) openSiteCard(name)
}

function showOnMap(event: Event) {
  showSiteOnMap(event, { stopPropagation: true })
}

/** Actions to open a site card or map popup from a team member card. */
export default class TeamSiteLink extends Component {
  declare props: {
    siteName: string
    siteCity: string
  }

  template({ siteName, siteCity }: this['props']) {
    return (
      <div class="team-card__site">
        <p class="team-card__site-name">{siteName}</p>
        <p class="team-card__site-city">{siteCity}</p>
        <div class="team-card__site-actions">
          <button type="button" class="team-card__site-action" data-site={siteName} click={viewSite}>
            View site
          </button>
          <button
            type="button"
            class="team-card__site-action"
            data-site={siteName}
            click={showOnMap}
          >
            Show on map
          </button>
        </div>
      </div>
    )
  }
}
