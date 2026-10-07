import { Component } from '@geajs/core'
import type { resources } from '../data/content'

type ResourceItem = (typeof resources.items)[number]

interface ResourceCardProps {
  item: ResourceItem
}

/** Resource link card (protocol / publication / registry). */
export default class ResourceCard extends Component<ResourceCardProps> {
  template() {
    const { item } = this.props

    // Do not use JSX spreads for link attrs — Gea drops them, so same-origin
    // protocol links lose `download` and the router shows NotFound instead.
    if (item.download) {
      return (
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
      )
    }

    return (
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
}
