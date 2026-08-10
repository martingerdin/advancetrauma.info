import { toggleInArray } from '../lib/filter-set'

type FilterCheckboxProps = {
  label: string
  /** Value stored in `selected`; defaults to `label`. */
  value?: string
  /** Parent's reactive selection array — mutated in place (Gea shared-proxy props). */
  selected: string[]
}

/** Presentational checkbox that mutates the parent's selection array. */
export default function FilterCheckbox({ label, value, selected }: FilterCheckboxProps) {
  const option = value ?? label
  return (
    <label class="filters__checkbox-label">
      <input
        type="checkbox"
        class="filters__checkbox"
        checked={selected.includes(option)}
        change={() => toggleInArray(selected, option)}
      />
      <span class="filters__checkbox-text">{label}</span>
    </label>
  )
}
