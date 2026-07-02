import React, { useState } from 'react'
import { Button, Textarea } from '@/shared/ui-kit'
import { Actions, Form } from './CommentForm.styles'

interface CommentFormProps {
  onSubmit: (text: string) => Promise<void>
}

export const CommentForm: React.FC<CommentFormProps> = ({ onSubmit }) => {
  const [text, setText] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!text.trim()) return

    setSubmitting(true)
    try {
      await onSubmit(text.trim())
      setText('')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <Form onSubmit={handleSubmit}>
      <Textarea
        placeholder="Write a comment…"
        value={text}
        disabled={submitting}
        onChange={(e) => setText(e.target.value)}
      />
      <Actions>
        <Button type="submit" disabled={submitting || !text.trim()}>
          {submitting ? 'Posting…' : 'Post comment'}
        </Button>
      </Actions>
    </Form>
  )
}
