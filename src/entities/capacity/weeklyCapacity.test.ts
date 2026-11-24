import { describe, expect, it } from 'vitest'
import {
  getDayCapacity,
  isPastDeadline,
  moveTask,
} from '@/entities/capacity/weeklyCapacity'

describe('getDayCapacity', () => {
  it('counts only work scheduled for the selected day', () => {
    const tasks = [
      { day: 'Monday', hours: 3.25 },
      { day: 'Monday', hours: 2.75 },
      { day: 'Tuesday', hours: 4 },
      { day: null, hours: 5 },
    ] as const

    expect(getDayCapacity(tasks, 'Monday', 4)).toEqual({
      scheduledHours: 6,
      remainingHours: -2,
    })
  })
})

describe('isPastDeadline', () => {
  it.each([
    ['Tuesday', 'Monday', true],
    ['Monday', 'Monday', false],
    ['Monday', 'Tuesday', false],
    [null, 'Monday', false],
    ['Tuesday', null, false],
  ] as const)(
    'evaluates a task scheduled for %s and due %s',
    (day, due, late) => {
      expect(isPastDeadline(day, due)).toBe(late)
    }
  )
})

describe('moveTask', () => {
  const tasks = [
    {
      id: 'review',
      title: 'Review proposal',
      day: 'Monday',
      hours: 2,
      due: 'Monday',
      mustDo: true,
    },
    {
      id: 'write',
      title: 'Write proposal',
      day: 'Monday',
      hours: 4,
      due: null,
      mustDo: false,
    },
  ] as const

  it('transfers a task’s hours to its new day', () => {
    const moved = moveTask(tasks, 'review', 'Tuesday')
    expect([
      getDayCapacity(moved, 'Monday', 4).remainingHours,
      getDayCapacity(moved, 'Tuesday', 4).remainingHours,
    ]).toEqual([0, 2])
  })

  it('can return a task to the unscheduled column', () => {
    expect(moveTask(tasks, 'review', null)[0].day).toBeNull()
  })
})
