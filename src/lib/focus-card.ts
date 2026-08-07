/** Open a site card in the sites list and scroll it into view. */
export function openSiteCard(name: string) {
  const card = document.querySelector<HTMLDetailsElement>(
    `details.site-card[data-site="${CSS.escape(name)}"]`,
  )
  if (!card) {
    document.getElementById('sites')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    return
  }
  card.open = true
  card.scrollIntoView({ behavior: 'smooth', block: 'center' })
}

/** Open a team member card and scroll it into view. */
export function openTeamMemberCard(name: string) {
  const card = document.querySelector<HTMLDetailsElement>(
    `details.team-card[data-member="${CSS.escape(name)}"]`,
  )
  if (!card) {
    document.getElementById('team')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    return
  }
  card.open = true
  card.scrollIntoView({ behavior: 'smooth', block: 'center' })
}
