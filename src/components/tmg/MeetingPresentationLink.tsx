import { openWebPresentation, type MeetingAsset } from '../../lib/tmg'

/** Opens a self-contained HTML presentation in a new tab. */
export default function MeetingPresentationLink({ presentation }: { presentation: MeetingAsset }) {
  return (
    <button
      class="cta tmg-meeting-presentations__button"
      type="button"
      click={() => {
        void openWebPresentation(presentation).catch((error: unknown) => {
          window.alert(error instanceof Error ? error.message : 'Unable to open the presentation.')
        })
      }}
    >
      View presentation
    </button>
  )
}
