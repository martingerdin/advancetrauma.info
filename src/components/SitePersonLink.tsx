import { Component } from '@geajs/core'
import { openTeamMemberCard } from '../lib/focus-card'

function openMember(event: Event) {
  event.preventDefault()
  event.stopPropagation()
  const name = (event.currentTarget as HTMLElement).getAttribute('data-member')
  if (name) openTeamMemberCard(name)
}

/** Clickable investigator / coordinator name on a site card. */
export default class SitePersonLink extends Component {
  declare props: {
    name: string
  }

  template({ name }: this['props']) {
    return (
      <span class="site-card__person-item">
        <button
          type="button"
          class="site-card__person"
          data-member={name}
          click={openMember}
        >
          {name}
        </button>
        <span class="site-card__person-sep" aria-hidden="true">
          {', '}
        </span>
      </span>
    )
  }
}
