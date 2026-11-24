import { useLayoutEffect, useRef, useState } from 'react'
import type { DragEvent, FormEvent } from 'react'
import {
  getDayCapacity,
  isPastDeadline,
  moveTask,
  WEEKDAYS,
} from '@/entities/capacity/weeklyCapacity'
import type { CapacityTask, Weekday } from '@/entities/capacity/weeklyCapacity'
import { Button, Select } from '@/shared/ui-kit'
import {
  Board,
  Card,
  Column,
  DropPlaceholder,
  Editor,
  Header,
  Planner,
  ScreenReaderText,
} from '@/features/capacity/pages/CapacityPage.styles'

const SAMPLE_CAPACITY: Record<Weekday, number> = {
  Monday: 4,
  Tuesday: 4,
  Wednesday: 3,
  Thursday: 4,
  Friday: 3,
}

const SAMPLE_TASKS: CapacityTask[] = [
  {
    id: 'proposal',
    title: 'Draft project proposal',
    day: 'Monday',
    hours: 4,
    due: 'Monday',
    mustDo: true,
  },
  {
    id: 'review',
    title: 'Review client feedback',
    day: 'Monday',
    hours: 2,
    due: 'Monday',
    mustDo: true,
  },
  {
    id: 'scope',
    title: 'Confirm project scope',
    day: 'Tuesday',
    hours: 2,
    due: 'Wednesday',
    mustDo: true,
  },
  {
    id: 'handoff',
    title: 'Prepare handoff notes',
    day: 'Thursday',
    hours: 1.5,
    due: 'Friday',
    mustDo: true,
  },
  {
    id: 'templates',
    title: 'Organize project templates',
    day: null,
    hours: 1,
    due: null,
    mustDo: false,
  },
]

const COLUMNS = [...WEEKDAYS, null]
const TASK_DRAG_TYPE = 'application/x-daywise-capacity-task'

function focusTaskTitle(input: HTMLInputElement | null) {
  input?.focus()
}

function CapacityPage() {
  const [tasks, setTasks] = useState(SAMPLE_TASKS)
  const [capacity, setCapacity] = useState(SAMPLE_CAPACITY)
  const [editor, setEditor] = useState<CapacityTask | 'new' | null>(null)
  const [draggedTask, setDraggedTask] = useState<CapacityTask | null>(null)
  const [dropTarget, setDropTarget] = useState<string | null>(null)
  const [announcement, setAnnouncement] = useState('')
  const movedSelectId = useRef<string | null>(null)
  const addButtonContainer = useRef<HTMLDivElement>(null)
  const editingTask = editor === 'new' ? null : editor

  useLayoutEffect(() => {
    if (movedSelectId.current) {
      document.getElementById(movedSelectId.current)?.focus()
      movedSelectId.current = null
    }
  }, [tasks])

  function closeEditor() {
    setEditor(null)
    addButtonContainer.current?.querySelector('button')?.focus()
  }

  function saveTask(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const form = new FormData(event.currentTarget)
    const task: CapacityTask = {
      id: editingTask?.id ?? crypto.randomUUID(),
      title: String(form.get('title')).trim(),
      day: editingTask?.day ?? null,
      hours: Number(form.get('hours')),
      due: WEEKDAYS.find((day) => day === form.get('due')) ?? null,
      mustDo: form.get('priority') === 'must-do',
    }

    setTasks((current) =>
      editingTask
        ? current.map((item) =>
            item.id === task.id ? { ...task, day: item.day } : item
          )
        : [...current, task]
    )
    closeEditor()
  }

  function changeDay(task: CapacityTask, day: Weekday | null) {
    if (task.day === day) return
    setTasks((current) => moveTask(current, task.id, day))
    setAnnouncement(
      day
        ? `${task.title} moved to ${day}.`
        : `${task.title} is now unscheduled.`
    )
  }

  function startDrag(event: DragEvent<HTMLDivElement>, task: CapacityTask) {
    const card = event.currentTarget.closest('li')
    if (card) {
      const { left, top } = card.getBoundingClientRect()
      event.dataTransfer.setDragImage(
        card,
        event.clientX - left,
        event.clientY - top
      )
    }
    event.dataTransfer.setData(TASK_DRAG_TYPE, task.id)
    event.dataTransfer.effectAllowed = 'move'
    setDraggedTask(task)
  }

  function endDrag() {
    setDraggedTask(null)
    setDropTarget(null)
  }

  return (
    <Planner>
      <Header>
        <div>
          <h1>Capacity planner</h1>
          <p>
            Plan your week around the hours you have and see where work won’t
            fit.
          </p>
          <p className="sample-note">
            Sample week. Changes reset when you leave the planner.
          </p>
        </div>
        <div ref={addButtonContainer}>
          <Button type="button" onClick={() => setEditor('new')}>
            Add task
          </Button>
        </div>
      </Header>

      {editor && (
        <Editor key={editor === 'new' ? 'new' : editor.id} onSubmit={saveTask}>
          <label>
            Task name
            <input
              name="title"
              defaultValue={editingTask?.title}
              placeholder="e.g. Review a proposal"
              required
              maxLength={100}
              pattern={'.*\\S.*'}
              ref={focusTaskTitle}
            />
          </label>
          <label>
            Estimate (hours)
            <input
              name="hours"
              type="number"
              min="0.25"
              max="24"
              step="0.25"
              defaultValue={editingTask?.hours ?? 1}
              required
            />
          </label>
          <label>
            Due day
            <Select name="due" defaultValue={editingTask?.due ?? ''}>
              <option value="">No due day</option>
              {WEEKDAYS.map((day) => (
                <option key={day}>{day}</option>
              ))}
            </Select>
          </label>
          <label>
            Priority
            <Select
              name="priority"
              defaultValue={editingTask?.mustDo ? 'must-do' : 'optional'}
            >
              <option value="must-do">Must do</option>
              <option value="optional">Optional</option>
            </Select>
          </label>
          <div className="actions">
            <Button type="submit">
              {editingTask ? 'Save task' : 'Create task'}
            </Button>
            <Button type="button" variant="secondary" onClick={closeEditor}>
              Cancel
            </Button>
          </div>
        </Editor>
      )}

      <ScreenReaderText role="status">{announcement}</ScreenReaderText>
      <Board aria-label="Weekly task board">
        {COLUMNS.map((day) => {
          const name = day ?? 'Unscheduled'
          const available = day === null ? 0 : capacity[day]
          const { scheduledHours, remainingHours } =
            day === null
              ? { scheduledHours: 0, remainingHours: 0 }
              : getDayCapacity(tasks, day, available)
          const columnTasks = tasks.filter((task) => task.day === day)
          const isDropTarget = dropTarget === name

          return (
            <Column
              key={name}
              aria-label={name}
              data-over={remainingHours < 0}
              data-drop-target={isDropTarget}
              onDragOver={(event) => {
                if (
                  !draggedTask ||
                  draggedTask.day === day ||
                  !event.dataTransfer.types.includes(TASK_DRAG_TYPE)
                )
                  return
                event.preventDefault()
                event.dataTransfer.dropEffect = 'move'
                setDropTarget(name)
              }}
              onDragLeave={({ currentTarget, relatedTarget }) => {
                if (
                  relatedTarget instanceof Node &&
                  currentTarget.contains(relatedTarget)
                )
                  return
                setDropTarget((current) => (current === name ? null : current))
              }}
              onDrop={(event) => {
                const id = event.dataTransfer.getData(TASK_DRAG_TYPE)
                const task = tasks.find((item) => item.id === id)
                if (task) {
                  event.preventDefault()
                  changeDay(task, day)
                }
                endDrag()
              }}
            >
              <header>
                <h2>{name}</h2>
                {day === null ? (
                  <p>{columnTasks.length} to schedule</p>
                ) : (
                  <>
                    <label className="hours">
                      <span>Available hours</span>
                      <input
                        aria-label={`Available hours for ${day}`}
                        type="number"
                        min="0"
                        max="24"
                        step="0.25"
                        defaultValue={available}
                        required
                        onChange={({ currentTarget }) => {
                          if (!currentTarget.validity.valid) return
                          const hours = currentTarget.valueAsNumber
                          setCapacity((current) => ({
                            ...current,
                            [day]: hours,
                          }))
                        }}
                        onBlur={({ currentTarget }) => {
                          if (!currentTarget.validity.valid)
                            currentTarget.value = String(available)
                        }}
                      />
                    </label>
                    <meter
                      aria-label={`Hours scheduled for ${day}`}
                      max={Math.max(0.25, available, scheduledHours)}
                      value={scheduledHours}
                    />
                    <p className="load">
                      <span>{scheduledHours} h planned</span>
                      <strong>
                        {remainingHours < 0
                          ? `${-remainingHours} h over`
                          : `${remainingHours} h free`}
                      </strong>
                    </p>
                  </>
                )}
              </header>

              <ul>
                {columnTasks.map((task) => (
                  <Card key={task.id}>
                    <div
                      className="card-top"
                      draggable
                      onDragStart={(event) => startDrag(event, task)}
                      onDragEnd={endDrag}
                    >
                      <span className="grip" aria-hidden="true">
                        ⠿
                      </span>
                      <h3>{task.title}</h3>
                    </div>
                    <div className="details">
                      <span>{task.hours} h</span>
                      <span data-required={task.mustDo}>
                        {task.mustDo ? 'Must do' : 'Optional'}
                      </span>
                    </div>
                    {task.due && (
                      <p
                        className="deadline"
                        data-late={isPastDeadline(task.day, task.due)}
                      >
                        {isPastDeadline(task.day, task.due)
                          ? 'After deadline · '
                          : 'Due '}
                        {task.due}
                      </p>
                    )}
                    <label className="move">
                      Move to
                      <Select
                        id={`capacity-move-${task.id}`}
                        aria-label={`Move ${task.title} to a day`}
                        value={task.day ?? ''}
                        onChange={({ currentTarget }) => {
                          const target =
                            WEEKDAYS.find(
                              (item) => item === currentTarget.value
                            ) ?? null
                          movedSelectId.current = currentTarget.id
                          changeDay(task, target)
                        }}
                      >
                        {COLUMNS.map((target) => (
                          <option
                            value={target ?? ''}
                            key={target ?? 'unscheduled'}
                          >
                            {target ?? 'Unscheduled'}
                          </option>
                        ))}
                      </Select>
                    </label>
                    <div className="card-actions">
                      <Button
                        variant="quiet"
                        type="button"
                        aria-label={`Edit ${task.title}`}
                        onClick={() => setEditor(task)}
                      >
                        Edit
                      </Button>
                      <Button
                        variant="quiet"
                        type="button"
                        aria-label={`Remove ${task.title}`}
                        onClick={() => {
                          setTasks((current) =>
                            current.filter((item) => item.id !== task.id)
                          )
                          if (editingTask?.id === task.id) closeEditor()
                          setAnnouncement(`${task.title} removed.`)
                          addButtonContainer.current
                            ?.querySelector('button')
                            ?.focus()
                        }}
                      >
                        Remove
                      </Button>
                    </div>
                  </Card>
                ))}
                {isDropTarget && (
                  <DropPlaceholder aria-hidden="true">
                    <span />
                    <span />
                  </DropPlaceholder>
                )}
              </ul>
              {columnTasks.length === 0 && !isDropTarget && (
                <p className="empty">No tasks</p>
              )}
            </Column>
          )
        })}
      </Board>
    </Planner>
  )
}

export default CapacityPage
