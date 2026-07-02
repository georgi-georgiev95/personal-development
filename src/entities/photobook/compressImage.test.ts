import { describe, it, expect, vi, afterEach } from 'vitest'
import { compressImage } from './compressImage'

class MockImage {
  width = 2000
  height = 1000
  onload: (() => void) | null = null
  onerror: (() => void) | null = null
  private _src = ''

  set src(value: string) {
    this._src = value
    if (value === 'bad-url') {
      queueMicrotask(() => this.onerror?.())
    } else {
      queueMicrotask(() => this.onload?.())
    }
  }

  get src() {
    return this._src
  }
}

afterEach(() => {
  vi.restoreAllMocks()
  vi.unstubAllGlobals()
})

describe('compressImage', () => {
  it('draws the image scaled to fit within the max dimension and returns a JPEG data URL', async () => {
    vi.stubGlobal('Image', MockImage)
    vi.stubGlobal('URL', {
      createObjectURL: vi.fn(() => 'blob:mock'),
      revokeObjectURL: vi.fn(),
    })
    const drawImage = vi.fn()
    const toDataURL = vi.fn(() => 'data:image/jpeg;base64,compressed')
    vi.spyOn(HTMLCanvasElement.prototype, 'getContext').mockImplementation(
      (() =>
        ({
          drawImage,
        }) as unknown) as typeof HTMLCanvasElement.prototype.getContext
    )
    vi.spyOn(HTMLCanvasElement.prototype, 'toDataURL').mockImplementation(
      toDataURL
    )

    const file = new File(['content'], 'photo.jpg', { type: 'image/jpeg' })
    const result = await compressImage(file)

    expect(result).toBe('data:image/jpeg;base64,compressed')
    expect(drawImage).toHaveBeenCalledWith(
      expect.any(MockImage),
      0,
      0,
      1000,
      500
    )
    expect(toDataURL).toHaveBeenCalledWith('image/jpeg', 0.7)
  })

  it('rejects when the canvas 2D context is unavailable', async () => {
    vi.stubGlobal('Image', MockImage)
    vi.stubGlobal('URL', {
      createObjectURL: vi.fn(() => 'blob:mock'),
      revokeObjectURL: vi.fn(),
    })
    vi.spyOn(HTMLCanvasElement.prototype, 'getContext').mockReturnValue(null)

    const file = new File(['content'], 'photo.jpg', { type: 'image/jpeg' })

    await expect(compressImage(file)).rejects.toThrow(
      'Canvas 2D context unavailable'
    )
  })

  it('rejects when the image fails to load', async () => {
    vi.stubGlobal('Image', MockImage)
    vi.stubGlobal('URL', {
      createObjectURL: vi.fn(() => 'bad-url'),
      revokeObjectURL: vi.fn(),
    })

    const file = new File(['content'], 'photo.jpg', { type: 'image/jpeg' })

    await expect(compressImage(file)).rejects.toThrow('Failed to load image')
  })
})
