import { Component } from '@geajs/core'
import type { TeamMember } from '../data/team'

export default class TeamMemberCard extends Component {
  declare props: {
    member: TeamMember
  }

  template({ member }: this['props']) {
    return (
      <article class="team-card">
        <h4 class="team-card__name">{member.name}</h4>
        {member.role ? <p class="team-card__role">{member.role}</p> : null}
        {member.affiliation ? (
          <p class="team-card__affiliation">{member.affiliation}</p>
        ) : null}
        {member.email ? (
          <a class="team-card__email" href={'mailto:' + member.email}>
            {member.email}
          </a>
        ) : null}
      </article>
    )
  }
}
