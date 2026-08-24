/** Smooth-scroll to an on-page section; keeps Gea's router from hijacking the click. */
export function scrollToSection(event: Event, id: string) {
  event.preventDefault()
  if (window.location.pathname !== '/') {
    window.location.href = `/#${id}`
    return
  }
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  history.replaceState(null, '', `#${id}`)
}
