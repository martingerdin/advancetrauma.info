import { Component } from '@geajs/core'
import { team } from '../data/content'
import { teamGroupViews } from '../data/team'
import type { TeamMember } from '../data/team'
import {
  countActiveFilters,
  resetFilterControls,
  toggleInSet,
} from '../lib/filter-set'
import FilterCheckbox from './FilterCheckbox'
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
    this.state.selectedRoles = toggleInSet(this.state.selectedRoles, role)
  }

  handleAffiliationToggle = (affiliation: string) => {
    this.state.selectedAffiliations = toggleInSet(
      this.state.selectedAffiliations,
      affiliation,
    )
  }

  handleClearFilters = () => {
    this.state.searchQuery = ''
    this.state.selectedRoles = new Set<string>()
    this.state.selectedAffiliations = new Set<string>()
    resetFilterControls(this.el)
  }

  toggleFilters = () => {
    this.state.filtersExpanded = !this.state.filtersExpanded
  }

  get activeFilterCount(): number {
    return countActiveFilters(
      [this.state.selectedRoles.size, this.state.selectedAffiliations.size],
      this.state.searchQuery,
    )
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
            <div class="filter-toggle">
              <button
                type="button"
                class="filter-toggle__btn"
                click={this.toggleFilters}
                aria-expanded={this.state.filtersExpanded}
              >
                <span>Filter</span>
                {this.activeFilterCount > 0 ? (
                  <span class="filter-toggle__badge">{this.activeFilterCount}</span>
                ) : null}
                <span class="filter-toggle__chevron" aria-hidden="true"></span>
              </button>
              {this.activeFilterCount > 0 ? (
                <button
                  type="button"
                  class="filter-toggle__clear"
                  click={this.handleClearFilters}
                >
                  Clear
                </button>
              ) : null}
            </div>

            {this.state.filtersExpanded ? (
              <div class="filters">
                <label class="filters__label">
                  <span class="filters__label-text">Search by name</span>
                  <input
                    type="text"
                    class="filters__search"
                    placeholder="Enter a name…"
                    input={this.handleSearchInput}
                  />
                </label>

                <details class="filters__group">
                  <summary class="filters__group-summary">
                    <span class="filters__group-title">Affiliation</span>
                    {this.state.selectedAffiliations.size > 0 ? (
                      <span class="filter-toggle__badge">
                        {this.state.selectedAffiliations.size}
                      </span>
                    ) : null}
                  </summary>
                  <div class="filters__checkboxes">
                    {this.availableAffiliations.map((affiliation) => (
                      <FilterCheckbox
                        label={affiliation}
                        checked={this.state.selectedAffiliations.has(affiliation)}
                        onChange={() => this.handleAffiliationToggle(affiliation)}
                      />
                    ))}
                  </div>
                </details>

                <details class="filters__group">
                  <summary class="filters__group-summary">
                    <span class="filters__group-title">Role</span>
                    {this.state.selectedRoles.size > 0 ? (
                      <span class="filter-toggle__badge">
                        {this.state.selectedRoles.size}
                      </span>
                    ) : null}
                  </summary>
                  <div class="filters__checkboxes">
                    {this.availableRoles.map((role) => (
                      <FilterCheckbox
                        label={role}
                        checked={this.state.selectedRoles.has(role)}
                        onChange={() => this.handleRoleToggle(role)}
                      />
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
              <div class="no-results">
                <p>No team members match the selected filters.</p>
                <button
                  type="button"
                  class="no-results__reset"
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
