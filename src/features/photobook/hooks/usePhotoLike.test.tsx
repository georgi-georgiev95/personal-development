import { describe, it, expect, vi, beforeEach } from 'vitest'
import { act, renderHook, waitFor } from '@testing-library/react'
import {
  SubscribePhotoReactionToken,
  TogglePhotoReactionToken,
} from '@/entities/photobook'
import { DIProvider, type Binding } from '@/shared/di'
import { usePhotoLike } from './usePhotoLike'

describe('usePhotoLike', () => {
  const subscribePhotoReaction = vi.fn()
  const togglePhotoReaction = vi.fn()
  let onChange: ((liked: boolean) => void) | undefined

  const wrapper = ({ children }: { children: React.ReactNode }) => {
    const bindings: Binding<unknown>[] = [
      [SubscribePhotoReactionToken, subscribePhotoReaction],
      [TogglePhotoReactionToken, togglePhotoReaction],
    ]
    return <DIProvider bindings={bindings}>{children}</DIProvider>
  }

  beforeEach(() => {
    vi.clearAllMocks()
    onChange = undefined
    subscribePhotoReaction.mockImplementation(
      (_photoId: string, _uid: string, cb: (liked: boolean) => void) => {
        onChange = cb
        return vi.fn()
      }
    )
    togglePhotoReaction.mockResolvedValue(undefined)
  })

  it('reflects the reaction state from the subscription', () => {
    const { result } = renderHook(() => usePhotoLike('photo-1', 'uid-1'), {
      wrapper,
    })

    expect(result.current.liked).toBe(false)

    act(() => onChange?.(true))

    expect(result.current.liked).toBe(true)
  })

  it('does not subscribe when there is no signed-in user', () => {
    renderHook(() => usePhotoLike('photo-1', undefined), { wrapper })

    expect(subscribePhotoReaction).not.toHaveBeenCalled()
  })

  it('optimistically likes on toggle and calls toggle with the previous state', async () => {
    const { result } = renderHook(() => usePhotoLike('photo-1', 'uid-1'), {
      wrapper,
    })

    act(() => result.current.toggleLike())

    expect(result.current.liked).toBe(true)
    expect(togglePhotoReaction).toHaveBeenCalledTimes(1)
    expect(togglePhotoReaction).toHaveBeenCalledWith('photo-1', 'uid-1', false)

    await waitFor(() => expect(result.current.pending).toBe(false))
  })

  it('optimistically unlikes on a second toggle', async () => {
    const { result } = renderHook(() => usePhotoLike('photo-1', 'uid-1'), {
      wrapper,
    })

    act(() => onChange?.(true))
    act(() => result.current.toggleLike())

    expect(result.current.liked).toBe(false)
    expect(togglePhotoReaction).toHaveBeenCalledWith('photo-1', 'uid-1', true)

    await waitFor(() => expect(result.current.pending).toBe(false))
  })

  it('ignores clicks while a toggle is still pending, preventing a double toggle', async () => {
    let resolveToggle: (() => void) | undefined
    togglePhotoReaction.mockReturnValue(
      new Promise<void>((resolve) => {
        resolveToggle = resolve
      })
    )

    const { result } = renderHook(() => usePhotoLike('photo-1', 'uid-1'), {
      wrapper,
    })

    act(() => result.current.toggleLike())
    act(() => result.current.toggleLike())
    act(() => result.current.toggleLike())

    expect(togglePhotoReaction).toHaveBeenCalledTimes(1)
    expect(result.current.liked).toBe(true)

    resolveToggle?.()
    await waitFor(() => expect(result.current.pending).toBe(false))
  })

  it('reverts the optimistic update if the toggle fails', async () => {
    togglePhotoReaction.mockRejectedValue(new Error('network error'))

    const { result } = renderHook(() => usePhotoLike('photo-1', 'uid-1'), {
      wrapper,
    })

    act(() => result.current.toggleLike())

    expect(result.current.liked).toBe(true)

    await waitFor(() => expect(result.current.liked).toBe(false))
    expect(result.current.pending).toBe(false)
  })

  it('does nothing when there is no signed-in user', () => {
    const { result } = renderHook(() => usePhotoLike('photo-1', undefined), {
      wrapper,
    })

    act(() => result.current.toggleLike())

    expect(togglePhotoReaction).not.toHaveBeenCalled()
    expect(result.current.liked).toBe(false)
  })
})
