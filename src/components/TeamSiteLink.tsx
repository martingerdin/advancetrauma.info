import { openSiteCard } from '../lib/focus-card'
import sitesMapStore from '../stores/sites-map-store'

type TeamSiteLinkProps = {
  siteName: string
  siteCity: string
}

/** Actions to open a site card or map popup from a team member card. */
export default function TeamSiteLink({ siteName, siteCity }: TeamSiteLinkProps) {
  return (
    <div class="team-card__site">
      <p class="team-card__site-name">{siteName}</p>
      <p class="team-card__site-city">{siteCity}</p>
      <div class="team-card__site-actions">
        <button
          type="button"
          class="team-card__site-action"
          click={(event: Event) => {
            event.preventDefault()
            event.stopPropagation()
            openSiteCard(siteName)
          }}
        >
          View site
        </button>
        <button
          type="button"
          class="team-card__site-action"
          click={(event: Event) => {
            event.preventDefault()
            event.stopPropagation()
            sitesMapStore.show(siteName)
          }}
        >
          Show on map
        </button>
      </div>
    </div>
  )
}
