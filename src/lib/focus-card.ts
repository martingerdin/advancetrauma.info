type OpenDetailsCardOptions = {
  selector: string
  fallbackId: string
}

/** Open a details card matching `selector` and scroll it into view. */
export function openDetailsCard({ selector, fallbackId }: OpenDetailsCardOptions) {
  const card = document.querySelector<HTMLDetailsElement>(selector)
  if (!card) {
    document.getElementById(fallbackId)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    return
  }
  card.open = true
  card.scrollIntoView({ behavior: 'smooth', block: 'center' })
}

/** Open a site card in the sites list and scroll it into view. */
export function openSiteCard(name: string) {
  openDetailsCard({
    selector: `details.site-card[data-site="${CSS.escape(name)}"]`,
    fallbackId: 'sites',
  })
}

/** Open a team member card and scroll it into view. */
export function openTeamMemberCard(name: string) {
  openDetailsCard({
    selector: `details.team-card[data-member="${CSS.escape(name)}"]`,
    fallbackId: 'team',
  })
}
