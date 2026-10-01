import type { ChangeEventHandler, ReactNode } from 'react'
import { TextareaField } from './Textarea.styles'

interface TextareaProps {
  id?: string
  name?: string
  value?: string | number | readonly string[]
  defaultValue?: string | number | readonly string[]
  placeholder?: string
  disabled?: boolean
  required?: boolean
  rows?: number
  maxLength?: number
  className?: string
  onChange?: ChangeEventHandler<HTMLTextAreaElement>
  children?: ReactNode
  'aria-label'?: string
  'aria-invalid'?: boolean | 'true' | 'false'
  'aria-describedby'?: string
}

export function Textarea({
  id,
  name,
  value,
  defaultValue,
  placeholder,
  disabled,
  required,
  rows,
  maxLength,
  className,
  onChange,
  children,
  'aria-label': ariaLabel,
  'aria-invalid': ariaInvalid,
  'aria-describedby': ariaDescribedBy,
}: TextareaProps) {
  return (
    <TextareaField
      id={id}
      name={name}
      value={value}
      defaultValue={defaultValue}
      placeholder={placeholder}
      disabled={disabled}
      required={required}
      rows={rows}
      maxLength={maxLength}
      className={className}
      onChange={onChange}
      aria-label={ariaLabel}
      aria-invalid={ariaInvalid}
      aria-describedby={ariaDescribedBy}
    >
      {children}
    </TextareaField>
  )
}
