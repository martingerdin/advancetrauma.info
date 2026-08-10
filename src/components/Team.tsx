import { Component } from '@geajs/core'
import { team } from '../data/content'
import { teamGroupViews } from '../data/team'
import type { TeamMember } from '../data/team'
import { countActiveFilters } from '../lib/filter-set'
import FilterCheckbox from './FilterCheckbox'
import TeamGroupSection from './TeamGroupSection'

export default class Team extends Component {
  searchQuery = ''
  selectedRoles: string[] = []
  selectedAffiliations: string[] = []
  filtersExpanded = false

  get allMembers(): TeamMember[] {
    return teamGroupViews.flatMap((group) => group.members)
  }

  get availableRoles(): string[] {
    const roles = new Set<string>()
    this.allMembers.forEach((member) => {
      member.roles?.forEach((role) => {
        if (role) roles.add(role)
      })
    })
    return Array.from(roles).sort()
  }

  get availableAffiliations(): string[] {
    const affiliations = new Set<string>()
    this.allMembers.forEach((member) => {
      if (member.affiliation) affiliations.add(member.affiliation)
    })
    return Array.from(affiliations).sort()
  }

  get activeFilterCount(): number {
    return countActiveFilters(
      [this.selectedRoles.length, this.selectedAffiliations.length],
      this.searchQuery,
    )
  }

  get filteredGroups() {
    return teamGroupViews
      .map((group) => ({
        id: group.id,
        title: group.title,
        members: this.filterMembers(group.members),
      }))
      .filter((group) => group.members.length > 0)
  }

  filterMembers(members: TeamMember[]): TeamMember[] {
    const search = this.searchQuery.toLowerCase()
    return members.filter((member) => {
      const matchesSearch = !search || member.name.toLowerCase().includes(search)
      const matchesRole =
        this.selectedRoles.length === 0 ||
        (!!member.roles &&
          member.roles.some((role) => role && this.selectedRoles.includes(role)))
      const matchesAffiliation =
        this.selectedAffiliations.length === 0 ||
        (!!member.affiliation && this.selectedAffiliations.includes(member.affiliation))
      return matchesSearch && matchesRole && matchesAffiliation
    })
  }

  clearFilters() {
    this.searchQuery = ''
    this.selectedRoles.splice(0)
    this.selectedAffiliations.splice(0)
  }

  template() {
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
                click={() => {
                  this.filtersExpanded = !this.filtersExpanded
                }}
                aria-expanded={this.filtersExpanded}
              >
                <span>Filter</span>
                {this.activeFilterCount > 0 ? (
                  <span class="filter-toggle__badge">{this.activeFilterCount}</span>
                ) : null}
                <span class="filter-toggle__chevron" aria-hidden="true"></span>
              </button>
              {this.activeFilterCount > 0 ? (
                <button type="button" class="filter-toggle__clear" click={this.clearFilters}>
                  Clear
                </button>
              ) : null}
            </div>

            {this.filtersExpanded ? (
              <div class="filters">
                <label class="filters__label">
                  <span class="filters__label-text">Search by name</span>
                  <input
                    type="text"
                    class="filters__search"
                    placeholder="Enter a name…"
                    value={this.searchQuery}
                    input={(event: Event) => {
                      this.searchQuery = (event.target as HTMLInputElement).value
                    }}
                  />
                </label>

                <details class="filters__group">
                  <summary class="filters__group-summary">
                    <span class="filters__group-title">Affiliation</span>
                    {this.selectedAffiliations.length > 0 ? (
                      <span class="filter-toggle__badge">{this.selectedAffiliations.length}</span>
                    ) : null}
                  </summary>
                  <div class="filters__checkboxes">
                    {this.availableAffiliations.map((affiliation) => (
                      <FilterCheckbox
                        key={affiliation}
                        label={affiliation}
                        selected={this.selectedAffiliations}
                      />
                    ))}
                  </div>
                </details>

                <details class="filters__group">
                  <summary class="filters__group-summary">
                    <span class="filters__group-title">Role</span>
                    {this.selectedRoles.length > 0 ? (
                      <span class="filter-toggle__badge">{this.selectedRoles.length}</span>
                    ) : null}
                  </summary>
                  <div class="filters__checkboxes">
                    {this.availableRoles.map((role) => (
                      <FilterCheckbox key={role} label={role} selected={this.selectedRoles} />
                    ))}
                  </div>
                </details>
              </div>
            ) : null}

            {this.filteredGroups.length > 0 ? (
              <div class="team-groups">
                {this.filteredGroups.map((group) => (
                  <TeamGroupSection key={group.id} title={group.title} members={group.members} />
                ))}
              </div>
            ) : (
              <div class="no-results">
                <p>No team members match the selected filters.</p>
                <button type="button" class="no-results__reset" click={this.clearFilters}>
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
