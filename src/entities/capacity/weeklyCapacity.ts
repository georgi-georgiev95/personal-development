export const WEEKDAYS = [
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
] as const

export type Weekday = (typeof WEEKDAYS)[number]

interface ScheduledWork {
  day: Weekday | null
  hours: number
}

export function getDayCapacity(
  tasks: readonly ScheduledWork[],
  day: Weekday,
  availableHours: number
): { scheduledHours: number; remainingHours: number } {
  const scheduledHours = tasks
    .filter((task) => task.day === day)
    .reduce((total, task) => total + task.hours, 0)

  return { scheduledHours, remainingHours: availableHours - scheduledHours }
}

export function isPastDeadline(
  day: Weekday | null,
  due: Weekday | null
): boolean {
  return (
    day !== null &&
    due !== null &&
    WEEKDAYS.indexOf(day) > WEEKDAYS.indexOf(due)
  )
}

export interface CapacityTask extends ScheduledWork {
  id: string
  title: string
  due: Weekday | null
  mustDo: boolean
}

export function moveTask(
  tasks: readonly CapacityTask[],
  id: string,
  day: Weekday | null
): CapacityTask[] {
  return tasks.map((task) => (task.id === id ? { ...task, day } : task))
}
