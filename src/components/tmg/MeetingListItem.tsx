import { Component } from '@geajs/core'
import type { MeetingSummary } from '../../lib/tmg'

export default class MeetingListItem extends Component {
  declare props: {
    meeting: MeetingSummary
    selected: boolean
    onSelect: () => void
  }

  template({ meeting, selected, onSelect }: this['props']) {
    return (
      <li>
        <button
          type="button"
          class={selected ? 'tmg-meeting-list__item tmg-meeting-list__item--active' : 'tmg-meeting-list__item'}
          click={onSelect}
        >
          {meeting.dateLabel}
        </button>
      </li>
    )
  }
}
