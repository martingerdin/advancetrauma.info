import type { resources } from '../data/content'

type ResourceItem = (typeof resources.items)[number]

/** Resource link card (protocol / publication / registry). */
export default function ResourceCard({ item }: { item: ResourceItem }) {
  return item.download ? (
    <a class="resource-card" href={item.href} download>
      <div class="resource-card__media">
        <img
          src={item.image}
          alt={item.imageAlt}
          width="1200"
          height="900"
          loading="lazy"
          decoding="async"
        />
      </div>
      <div class="resource-card__body">
        <h3 class="resource-card__title">{item.label}</h3>
        <p class="resource-card__description">{item.description}</p>
      </div>
    </a>
  ) : (
    <a
      class="resource-card"
      href={item.href}
      target="_blank"
      rel="noopener noreferrer"
    >
      <div class="resource-card__media">
        <img
          src={item.image}
          alt={item.imageAlt}
          width="1200"
          height="900"
          loading="lazy"
          decoding="async"
        />
      </div>
      <div class="resource-card__body">
        <h3 class="resource-card__title">{item.label}</h3>
        <p class="resource-card__description">{item.description}</p>
      </div>
    </a>
  )
}
