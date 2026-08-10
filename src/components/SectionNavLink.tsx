import { scrollToSection } from '../lib/scroll-to-section'
import navStore from '../stores/nav-store'

type SectionNavLinkProps = {
  href: string
  id: string
  label: string
}

/** In-page section link for header and footer navigation. */
export default function SectionNavLink({ href, id, label }: SectionNavLinkProps) {
  return (
    <li>
      <a
        href={href}
        click={(event: Event) => {
          navStore.close()
          scrollToSection(event, id)
        }}
      >
        {label}
      </a>
    </li>
  )
}
