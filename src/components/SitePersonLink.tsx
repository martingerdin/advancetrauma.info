import { openTeamMemberCard } from '../lib/focus-card'

/** Clickable investigator / coordinator name on a site card. */
export default function SitePersonLink({ name }: { name: string }) {
  return (
    <span class="site-card__person-item">
      <button
        type="button"
        class="site-card__person"
        click={(event: Event) => {
          event.preventDefault()
          event.stopPropagation()
          openTeamMemberCard(name)
        }}
      >
        {name}
      </button>
      <span class="site-card__person-sep" aria-hidden="true">
        {', '}
      </span>
    </span>
  )
}
