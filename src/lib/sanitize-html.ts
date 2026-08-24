import DOMPurify from 'dompurify'

const sharedOptions: Parameters<typeof DOMPurify.sanitize>[1] = {
  USE_PROFILES: { html: true },
  FORBID_ATTR: ['style'],
  ALLOW_UNKNOWN_PROTOCOLS: false,
  SANITIZE_DOM: true,
}

/** Allowlist sanitizer for HTML rendered from external Markdown (TMG notes). */
export function sanitizeMeetingHtml(dirty: string): string {
  return DOMPurify.sanitize(dirty, {
    ...sharedOptions,
    FORBID_TAGS: ['style', 'form', 'input', 'button', 'textarea', 'select'],
  })
}

/** Sanitize map popup markup while keeping interactive person/close buttons. */
export function sanitizePopupHtml(dirty: string): string {
  return DOMPurify.sanitize(dirty, {
    ...sharedOptions,
    ADD_ATTR: ['target'],
    FORBID_TAGS: ['style', 'form', 'input', 'textarea', 'select', 'script'],
  })
}
