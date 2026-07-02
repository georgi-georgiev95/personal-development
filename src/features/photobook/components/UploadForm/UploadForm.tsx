import React, { useId, useState } from 'react'
import { Button, Textarea } from '@/shared/ui-kit'
import {
  CaptionField,
  ErrorText,
  FileInput,
  Form,
  FormColumn,
  PhotoTile,
  PhotoTileLabel,
  PhotoTilePlus,
  PhotoTilePreview,
  RemovePhotoButton,
  UploadRow,
} from './UploadForm.styles'

interface UploadFormProps {
  onUpload: (file: File, caption: string) => Promise<void>
}

export const UploadForm: React.FC<UploadFormProps> = ({ onUpload }) => {
  const fileInputId = useId()
  const [file, setFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [caption, setCaption] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0] ?? null
    setFile(selected)
    setPreviewUrl(selected ? URL.createObjectURL(selected) : null)
  }

  const handleRemove = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setFile(null)
    setPreviewUrl(null)
  }

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
      setPreviewUrl(null)
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
        id={fileInputId}
        type="file"
        accept="image/*"
        disabled={submitting}
        onChange={handleFileChange}
      />
      <PhotoTile htmlFor={fileInputId} $hasPreview={previewUrl !== null}>
        {previewUrl ? (
          <>
            <PhotoTilePreview src={previewUrl} alt="Selected photo preview" />
            <RemovePhotoButton
              type="button"
              aria-label="Remove selected photo"
              onClick={handleRemove}
            >
              ×
            </RemovePhotoButton>
          </>
        ) : (
          <>
            <PhotoTilePlus>+</PhotoTilePlus>
            <PhotoTileLabel>Add photo</PhotoTileLabel>
          </>
        )}
      </PhotoTile>
      <FormColumn>
        <CaptionField>
          <Textarea
            placeholder="Add a caption (optional)"
            value={caption}
            disabled={submitting}
            onChange={(e) => setCaption(e.target.value)}
          />
        </CaptionField>
        {error ? <ErrorText>{error}</ErrorText> : null}
        <UploadRow>
          <Button type="submit" disabled={submitting || !file}>
            {submitting ? 'Uploading…' : 'Upload photo'}
          </Button>
        </UploadRow>
      </FormColumn>
    </Form>
  )
}
