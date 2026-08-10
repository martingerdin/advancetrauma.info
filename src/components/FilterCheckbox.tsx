import { Component } from '@geajs/core'

/** Single checkbox option inside a shared filter panel. */
export default class FilterCheckbox extends Component {
  declare props: {
    label: string
    checked: boolean
    onChange: () => void
  }

  template({ label, checked, onChange }: this['props']) {
    return (
      <label class="filters__checkbox-label">
        <input
          type="checkbox"
          class="filters__checkbox"
          checked={checked}
          change={onChange}
        />
        <span class="filters__checkbox-text">{label}</span>
      </label>
    )
  }
}
