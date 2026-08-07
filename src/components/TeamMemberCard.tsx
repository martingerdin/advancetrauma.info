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
                <svg
                  class="team-card__orcid-icon"
                  viewBox="0 0 256 256"
                  width="16"
                  height="16"
                  aria-hidden="true"
                  focusable="false"
                >
                  <path
                    fill="currentColor"
                    d="M256 128c0 70.7-57.3 128-128 128S0 198.7 0 128 57.3 0 128 0s128 57.3 128 128z"
                  />
                  <path
                    fill="#fff"
                    d="M86.3 186.2H70.9V79.1h15.4v107.1zM124.8 79.1h-39.2v15.2h12.4c10.4 0 17.3 2.3 21.5 6.9 4.2 4.6 6.3 11.2 6.3 19.6 0 9.1-2.4 16.2-7.1 21.3-4.7 5.1-11.6 7.7-20.7 7.7H98v36.4h15.4v-25.8h2.8l21.4 25.8h18.3l-24.2-28.5c7.8-2.2 13.9-6.4 18.2-12.6 4.3-6.2 6.5-14 6.5-23.3 0-12.3-3.7-21.8-11.1-28.6-7.4-6.8-18-10.1-31.8-10.1zm-12.2 53.8c5.6 0 9.8-1.4 12.6-4.2 2.8-2.8 4.2-6.9 4.2-12.3 0-5.1-1.4-9-4.1-11.7-2.7-2.7-6.8-4-12.2-4h-11v32.2h10.5zM201.5 162.5c-4.9 4.4-11.6 6.6-20.1 6.6-8.8 0-15.7-2.3-20.6-6.9-4.9-4.6-7.4-10.9-7.4-18.8v-39.3h15.2v37.5c0 4.8 1.2 8.5 3.6 11.1 2.4 2.6 5.9 3.9 10.4 3.9 4.6 0 8.2-1.3 10.7-3.9 2.5-2.6 3.8-6.3 3.8-11.1v-37.5h15.2v39.3c0 8.1-2.6 14.5-7.8 19.1z"
                  />
                </svg>
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
                <TeamSiteLink siteName={site.name} siteCity={site.city} />
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
