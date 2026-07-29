import { Component } from '@geajs/core'

type CtaButtonProps = {
  href: string
  children?: any
  variant?: 'solid' | 'ghost'
  download?: boolean
  external?: boolean
}

export default class CtaButton extends Component {
  declare props: CtaButtonProps

  template({ href, children, variant = 'solid', download, external }: CtaButtonProps) {
    const className = variant === 'ghost' ? 'cta cta--ghost' : 'cta'
    return (
      <a
        class={className}
        href={href}
        download={download ? true : undefined}
        target={external ? '_blank' : undefined}
        rel={external ? 'noopener noreferrer' : undefined}
      >
        {children}
      </a>
    )
  }
}
