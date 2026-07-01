import React, { useState } from 'react'
import { Button, Textarea } from '@/shared/ui-kit'
import { CaptionField, ErrorText, FileInput, Form } from './UploadForm.styles'

interface UploadFormProps {
  onUpload: (file: File, caption: string) => Promise<void>
}

export const UploadForm: React.FC<UploadFormProps> = ({ onUpload }) => {
  const [file, setFile] = useState<File | null>(null)
  const [caption, setCaption] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!file) {
      setError('Choose a photo to upload')
      return
    }

    setSubmitting(true)
    setError('')
    try {
      await onUpload(file, caption.trim())
      setFile(null)
      setCaption('')
    } catch {
      setError('Could not upload your photo. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <Form onSubmit={handleSubmit}>
      <FileInput
        type="file"
        accept="image/*"
        aria-label="Choose a photo"
        disabled={submitting}
        onChange={(e) => setFile(e.target.files?.[0] ?? null)}
      />
      <CaptionField>
        <Textarea
          placeholder="Add a caption (optional)"
          value={caption}
          disabled={submitting}
          onChange={(e) => setCaption(e.target.value)}
        />
        {error ? <ErrorText>{error}</ErrorText> : null}
      </CaptionField>
      <Button type="submit" disabled={submitting}>
        {submitting ? 'Uploading…' : 'Upload photo'}
      </Button>
    </Form>
  )
}
