import navStore from '../stores/nav-store'

/** One link in the header portal group (TMG, future patient/investigator areas, etc.). */
export default function PortalNavLink({ href, label }: { href: string; label: string }) {
  return (
    <a class="site-header__portal" href={href} click={() => navStore.close()}>
      {label}
    </a>
  )
}
