import type { ComponentProps } from 'react'
import { SelectField, SelectWrap } from './Select.styles'

type SelectProps = Omit<ComponentProps<'select'>, 'multiple' | 'size'>

export function Select(props: SelectProps) {
  return (
    <SelectWrap>
      <SelectField {...props} />
    </SelectWrap>
  )
}
