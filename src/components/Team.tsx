import { Component } from '@geajs/core'
import { team } from '../data/content'
import { teamGroupViews } from '../data/team'
import TeamMemberCard from './TeamMemberCard'

export default class Team extends Component {
  template() {
    return (
      <section class="section" id="team">
        <div class="section__inner section__inner--split">
          <header class="section__intro">
            <h2 class="section__heading">{team.title}</h2>
            <p class="section__lead">{team.lead}</p>
          </header>
          <div class="team-groups">
            <div class="team-group">
              <h3 class="team-group__title">{teamGroupViews[0].title}</h3>
              <div class="team-cards">
                {teamGroupViews[0].members.map((member) => (
                  <TeamMemberCard member={member} />
                ))}
              </div>
            </div>
            {teamGroupViews[1].members.length > 0 ? (
              <div class="team-group">
                <h3 class="team-group__title">{teamGroupViews[1].title}</h3>
                <div class="team-cards">
                  {teamGroupViews[1].members.map((member) => (
                    <TeamMemberCard member={member} />
                  ))}
                </div>
              </div>
            ) : null}
          </div>
        </div>
      </section>
    )
  }
}
