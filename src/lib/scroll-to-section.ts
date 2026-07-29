/** Smooth-scroll to an on-page section; keeps Gea's router from hijacking the click. */
export function scrollToSection(event: Event, id: string) {
  event.preventDefault()
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  history.replaceState(null, '', `#${id}`)
}
