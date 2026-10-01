import { describe, expect, it } from 'vitest'
import {
  createDeliveryTask,
  DeliveryTaskInputError,
  updateDeliveryTask,
} from './deliveryTask'

describe('createDeliveryTask', () => {
  it('trims and creates a distinct task at discovery', () => {
    const first = createDeliveryTask({ title: '  First  ', goal: '  Goal  ' })
    const second = createDeliveryTask({ title: 'Second', goal: 'Other goal' })

    expect(first).toMatchObject({
      title: 'First',
      goal: 'Goal',
      stage: 'discovery',
      createdAt: first.updatedAt,
    })
    expect(first.id).toBeTruthy()
    expect(second.id).not.toBe(first.id)
  })

  it.each([
    [{ title: '   ', goal: 'A goal' }, 'title', 'Enter a task title.'],
    [{ title: 'A title', goal: '  ' }, 'goal', 'Enter the task goal.'],
  ] as const)('rejects invalid input %#', (input, field, message) => {
    expect(() => createDeliveryTask(input)).toThrowError(
      new DeliveryTaskInputError(field, message)
    )
  })
})

describe('updateDeliveryTask', () => {
  it('returns an updated task without mutating the original', () => {
    const original = createDeliveryTask({ title: 'First', goal: 'Initial' })
    const unchanged = createDeliveryTask({ title: 'Second', goal: 'Other' })
    const updated = updateDeliveryTask(original, {
      title: ' Revised ',
      goal: ' New goal ',
    })

    expect(updated).toMatchObject({
      id: original.id,
      title: 'Revised',
      goal: 'New goal',
      stage: original.stage,
      createdAt: original.createdAt,
    })
    expect(updated.updatedAt).toBeTruthy()
    expect(original.title).toBe('First')
    expect(unchanged).toMatchObject({ title: 'Second', goal: 'Other' })
  })
})
