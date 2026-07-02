import React from 'react'
import { TextareaField } from './Textarea.styles'

type TextareaProps = React.TextareaHTMLAttributes<HTMLTextAreaElement>

export const Textarea: React.FC<TextareaProps> = (props) => (
  <TextareaField {...props} />
)
