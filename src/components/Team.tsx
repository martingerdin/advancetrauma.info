import { Component } from '@geajs/core'
import { team } from '../data/content'
import { teamGroupViews } from '../data/team'
import type { TeamMember } from '../data/team'
import TeamMemberCard from './TeamMemberCard'

export default class Team extends Component {
  state = {
    searchQuery: '',
    selectedRoles: new Set<string>(),
    selectedAffiliations: new Set<string>(),
    filtersExpanded: false,
  }

  get allMembers(): TeamMember[] {
    return teamGroupViews.flatMap((group) => group.members)
  }

  get availableRoles(): string[] {
    const roles = new Set<string>()
    this.allMembers.forEach((member) => {
      if (member.roles) {
        member.roles.forEach((role) => {
          if (role) roles.add(role)
        })
      }
    })
    return Array.from(roles).sort()
  }

  get availableAffiliations(): string[] {
    const affiliations = new Set<string>()
    this.allMembers.forEach((member) => {
      if (member.affiliation) {
        affiliations.add(member.affiliation)
      }
    })
    return Array.from(affiliations).sort()
  }

  filterMembers(members: TeamMember[]): TeamMember[] {
    return members.filter((member) => {
      const matchesSearch =
        !this.state.searchQuery ||
        member.name.toLowerCase().includes(this.state.searchQuery.toLowerCase())

      const matchesRole =
        this.state.selectedRoles.size === 0 ||
        (member.roles &&
          member.roles.some((role) => role && this.state.selectedRoles.has(role)))

      const matchesAffiliation =
        this.state.selectedAffiliations.size === 0 ||
        (!!member.affiliation &&
          this.state.selectedAffiliations.has(member.affiliation))

      return matchesSearch && matchesRole && matchesAffiliation
    })
  }

  handleSearchInput = (event: Event) => {
    const target = event.target as HTMLInputElement
    this.state.searchQuery = target.value
  }

  handleRoleToggle = (role: string) => {
    if (this.state.selectedRoles.has(role)) {
      this.state.selectedRoles.delete(role)
    } else {
      this.state.selectedRoles.add(role)
    }
    this.state.selectedRoles = new Set(this.state.selectedRoles)
  }

  handleAffiliationToggle = (affiliation: string) => {
    if (this.state.selectedAffiliations.has(affiliation)) {
      this.state.selectedAffiliations.delete(affiliation)
    } else {
      this.state.selectedAffiliations.add(affiliation)
    }
    this.state.selectedAffiliations = new Set(this.state.selectedAffiliations)
  }

  handleClearFilters = () => {
    this.state.searchQuery = ''
    this.state.selectedRoles = new Set<string>()
    this.state.selectedAffiliations = new Set<string>()
    const searchInput = document.querySelector('.team-filters__search') as HTMLInputElement
    if (searchInput) searchInput.value = ''
  }

  toggleFilters = () => {
    this.state.filtersExpanded = !this.state.filtersExpanded
  }

  get activeFilterCount(): number {
    let count = this.state.selectedRoles.size + this.state.selectedAffiliations.size
    if (this.state.searchQuery) count += 1
    return count
  }

  template() {
    const filteredGroup0 = this.filterMembers(teamGroupViews[0].members)
    const filteredGroup1 = this.filterMembers(teamGroupViews[1].members)
    const hasResults = filteredGroup0.length > 0 || filteredGroup1.length > 0

    return (
      <section class="section" id="team">
        <div class="section__inner section__inner--split">
          <header class="section__intro">
            <h2 class="section__heading">{team.title}</h2>
            <p class="section__lead">{team.lead}</p>
          </header>
          <div class="team-main">
            <div class="team-filter-toggle">
              <button
                type="button"
                class="team-filter-toggle__btn"
                click={this.toggleFilters}
                aria-expanded={this.state.filtersExpanded}
              >
                <span>Filter</span>
                {this.activeFilterCount > 0 ? (
                  <span class="team-filter-toggle__badge">{this.activeFilterCount}</span>
                ) : null}
                <span class="team-filter-toggle__chevron" aria-hidden="true"></span>
              </button>
              {this.activeFilterCount > 0 ? (
                <button
                  type="button"
                  class="team-filter-toggle__clear"
                  click={this.handleClearFilters}
                >
                  Clear
                </button>
              ) : null}
            </div>

            {this.state.filtersExpanded ? (
              <div class="team-filters">
                <label class="team-filters__label">
                  <span class="team-filters__label-text">Search by name</span>
                  <input
                    type="text"
                    class="team-filters__search"
                    placeholder="Enter a name…"
                    input={this.handleSearchInput}
                  />
                </label>

                <details class="team-filters__group">
                  <summary class="team-filters__group-summary">
                    <span class="team-filters__group-title">Affiliation</span>
                    {this.state.selectedAffiliations.size > 0 ? (
                      <span class="team-filter-toggle__badge">
                        {this.state.selectedAffiliations.size}
                      </span>
                    ) : null}
                  </summary>
                  <div class="team-filters__checkboxes">
                    {this.availableAffiliations.map((affiliation) => (
                      <label class="team-filters__checkbox-label">
                        <input
                          type="checkbox"
                          class="team-filters__checkbox"
                          checked={this.state.selectedAffiliations.has(affiliation)}
                          change={() => this.handleAffiliationToggle(affiliation)}
                        />
                        <span class="team-filters__checkbox-text">{affiliation}</span>
                      </label>
                    ))}
                  </div>
                </details>

                <details class="team-filters__group">
                  <summary class="team-filters__group-summary">
                    <span class="team-filters__group-title">Role</span>
                    {this.state.selectedRoles.size > 0 ? (
                      <span class="team-filter-toggle__badge">
                        {this.state.selectedRoles.size}
                      </span>
                    ) : null}
                  </summary>
                  <div class="team-filters__checkboxes">
                    {this.availableRoles.map((role) => (
                      <label class="team-filters__checkbox-label">
                        <input
                          type="checkbox"
                          class="team-filters__checkbox"
                          checked={this.state.selectedRoles.has(role)}
                          change={() => this.handleRoleToggle(role)}
                        />
                        <span class="team-filters__checkbox-text">{role}</span>
                      </label>
                    ))}
                  </div>
                </details>
              </div>
            ) : null}

            {hasResults ? (
              <div class="team-groups">
                {filteredGroup0.length > 0 ? (
                  <div class="team-group">
                    <h3 class="team-group__title">{teamGroupViews[0].title}</h3>
                    <div class="team-cards">
                      {filteredGroup0.map((member) => (
                        <TeamMemberCard member={member} />
                      ))}
                    </div>
                  </div>
                ) : null}
                {filteredGroup1.length > 0 ? (
                  <div class="team-group">
                    <h3 class="team-group__title">{teamGroupViews[1].title}</h3>
                    <div class="team-cards">
                      {filteredGroup1.map((member) => (
                        <TeamMemberCard member={member} />
                      ))}
                    </div>
                  </div>
                ) : null}
              </div>
            ) : (
              <div class="team-no-results">
                <p>No team members match the selected filters.</p>
                <button
                  type="button"
                  class="team-no-results__reset"
                  click={this.handleClearFilters}
                >
                  Clear filters
                </button>
              </div>
            )}
          </div>
        </div>
      </section>
    )
  }
}
