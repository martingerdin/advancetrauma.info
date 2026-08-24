import DOMPurify from 'dompurify'

/** Allowlist sanitizer for HTML rendered from external Markdown (TMG notes). */
export function sanitizeMeetingHtml(dirty: string): string {
  return DOMPurify.sanitize(dirty, {
    USE_PROFILES: { html: true },
    FORBID_TAGS: ['style', 'form', 'input', 'button', 'textarea', 'select'],
    FORBID_ATTR: ['style'],
    ALLOW_UNKNOWN_PROTOCOLS: false,
    SANITIZE_DOM: true,
  })
}
