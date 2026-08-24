import type { footer } from '../data/content'

type FooterResource = (typeof footer.resources)[number]

/** Footer resources list item. */
export default function FooterResourceLink({ item }: { item: FooterResource }) {
  return item.download ? (
    <li>
      <a href={item.href} download>
        {item.label}
      </a>
    </li>
  ) : (
    <li>
      <a href={item.href} target="_blank" rel="noopener noreferrer">
        {item.label}
      </a>
    </li>
  )
}
