import { Component } from '@geajs/core'
import type { TeamMember } from '../data/team'
import TeamSiteLink from './TeamSiteLink'

function orcidUrl(orcid: string): string {
  const id = orcid.replace(/^https?:\/\/orcid\.org\//i, '').trim()
  return 'https://orcid.org/' + id
}

function orcidLabel(orcid: string): string {
  return orcid.replace(/^https?:\/\/orcid\.org\//i, '').trim()
}

function stopSummaryToggle(event: Event) {
  event.stopPropagation()
}

export default class TeamMemberCard extends Component {
  declare props: {
    member: TeamMember
  }

  template({ member }: this['props']) {
    return (
      <details class="team-card" data-member={member.name}>
        <summary class="team-card__summary">
          <h4 class="team-card__name">{member.name}</h4>
          {member.roles ? (
            <p class="team-card__role">{member.roles[0]}</p>
          ) : null}
        </summary>
        <div class="team-card__panel">
          {member.affiliation ? (
            <p class="team-card__affiliation">{member.affiliation}</p>
          ) : null}
          {member.email ? (
            <p class="team-card__email">
              <a href={'mailto:' + member.email} click={stopSummaryToggle}>
                {member.email}
              </a>
            </p>
          ) : null}
          {member.orcid ? (
            <p class="team-card__orcid">
              <a
                href={orcidUrl(member.orcid)}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={'ORCID profile for ' + member.name}
                click={stopSummaryToggle}
              >
                <img
                  class="team-card__orcid-icon"
                  src="/orcid-id-icon.svg"
                  width="16"
                  height="16"
                  alt=""
                  aria-hidden="true"
                />
                <span>{orcidLabel(member.orcid)}</span>
              </a>
            </p>
          ) : null}
          {member.profile ? (
            <p class="team-card__profile-link">
              <a
                href={member.profile}
                target="_blank"
                rel="noopener noreferrer"
                click={stopSummaryToggle}
              >
                Institutional profile
              </a>
            </p>
          ) : null}
          {member.linkedSites ? (
            <div class="team-card__sites">
              {member.linkedSites.map((site) => (
                <TeamSiteLink key={site.name} siteName={site.name} siteCity={site.city} />
              ))}
            </div>
          ) : null}
          {Array.isArray(member.roles) && member.roles.length > 1 ? (
            <ul class="team-card__roles">
              {member.roles.map(
                (role, idx) =>
                  role ? <li key={idx + 1}>{role}</li> : null
              )}
            </ul>
          ) : null}
     
        </div>
      </details>
    )
  }
}
