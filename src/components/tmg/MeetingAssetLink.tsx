import type { MeetingAsset } from '../../lib/tmg'

/** Download row for a file listed in a meeting’s website.json. */
export default function MeetingAssetLink({ asset }: { asset: MeetingAsset }) {
  return (
    <li class="tmg-meeting-files__item">
      <a
        class="tmg-meeting-files__link"
        href={asset.downloadUrl}
        target="_blank"
        rel="noopener noreferrer"
      >
        <svg
          class="tmg-meeting-files__icon"
          viewBox="0 0 16 16"
          width="16"
          height="16"
          fill="none"
          aria-hidden="true"
          focusable="false"
        >
          <path
            d="M9.5 1.5H4.5A1.5 1.5 0 0 0 3 3v10A1.5 1.5 0 0 0 4.5 14.5h7A1.5 1.5 0 0 0 13 13V5z"
            stroke="currentColor"
            stroke-width="1.25"
            stroke-linejoin="round"
          />
          <path d="M9.5 1.5V5H13" stroke="currentColor" stroke-width="1.25" stroke-linejoin="round" />
          <path
            d="M5.5 8.5h5M5.5 11h3.5"
            stroke="currentColor"
            stroke-width="1.25"
            stroke-linecap="round"
          />
        </svg>
        <span>{asset.label}</span>
      </a>
    </li>
  )
}
