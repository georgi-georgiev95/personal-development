import { useRef, useState, type FormEvent } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import {
  DeliveryTaskInputError,
  type DeliveryTask,
  type DeliveryTaskInput,
} from '@/entities/delivery-task'
import { Button, Textarea } from '@/shared/ui-kit'
import {
  Actions,
  Breadcrumb,
  Content,
  Eyebrow,
  Field,
  FieldError,
  Heading,
  Notice,
  Stage,
  TaskCard,
  TaskForm,
  TaskLink,
  TaskList,
  TaskMeta,
  TaskPage,
  TextInput,
} from './TaskWorkspace.styles'

interface TaskListPageProps {
  tasks: DeliveryTask[]
}

interface TaskCreatePageProps {
  onCreate: (input: DeliveryTaskInput) => DeliveryTask
}

interface TaskDetailPageProps {
  task: DeliveryTask | undefined
  onSave: (id: string, input: DeliveryTaskInput) => DeliveryTask | null
}

interface TaskDetailRouteProps extends Omit<TaskDetailPageProps, 'task'> {
  tasks: DeliveryTask[]
}

const PageHeading = ({ title }: { title: string }) => (
  <>
    <Eyebrow>// demo workspace</Eyebrow>
    <Heading>{title}</Heading>
    <Notice role="status">
      Demo only: tasks are held in memory and will reset when you reload this
      page.
    </Notice>
  </>
)

export const TaskListPage = ({ tasks }: TaskListPageProps) => (
  <TaskListContent tasks={tasks} />
)

const TaskListContent = ({ tasks }: TaskListPageProps) => {
  const navigate = useNavigate()
  return (
    <TaskPage>
      <Breadcrumb to="/demo">← Back to walkthrough</Breadcrumb>
      <PageHeading title="Delivery tasks" />
      <Content aria-label="Delivery tasks">
        <Actions>
          <Button onClick={() => navigate('/demo/tasks/new')}>
            Create task
          </Button>
        </Actions>
        {tasks.length === 0 ? (
          <TaskMeta>
            No tasks yet. Create one to start the demo journey.
          </TaskMeta>
        ) : (
          <TaskList>
            {tasks.map((task) => (
              <TaskCard key={task.id}>
                <TaskLink to={`/demo/tasks/${task.id}`}>{task.title}</TaskLink>
                <TaskMeta>{task.goal}</TaskMeta>
                <Stage>Current stage: {task.stage}</Stage>
              </TaskCard>
            ))}
          </TaskList>
        )}
      </Content>
    </TaskPage>
  )
}

export const TaskCreatePage = ({ onCreate }: TaskCreatePageProps) => {
  const navigate = useNavigate()
  const submitting = useRef(false)
  const [title, setTitle] = useState('')
  const [goal, setGoal] = useState('')
  const [error, setError] = useState<DeliveryTaskInputError | null>(null)

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (submitting.current) return
    submitting.current = true
    try {
      const task = onCreate({ title, goal })
      navigate(`/demo/tasks/${task.id}`)
    } catch (caught) {
      submitting.current = false
      if (caught instanceof DeliveryTaskInputError) setError(caught)
      else throw caught
    }
  }

  return (
    <TaskPage>
      <Breadcrumb to="/demo/tasks">← All tasks</Breadcrumb>
      <PageHeading title="Create a delivery task" />
      <Content>
        <TaskForm onSubmit={handleSubmit}>
          <Field>
            <label htmlFor="task-title">Title</label>
            <TextInput
              id="task-title"
              value={title}
              onChange={(event) => {
                setTitle(event.target.value)
                setError(null)
              }}
              aria-invalid={error?.field === 'title'}
              aria-describedby={
                error?.field === 'title' ? 'title-error' : undefined
              }
            />
            {error?.field === 'title' && (
              <FieldError id="title-error" role="alert">
                {error.message}
              </FieldError>
            )}
          </Field>
          <Field>
            <label htmlFor="task-goal">Goal</label>
            <Textarea
              id="task-goal"
              value={goal}
              onChange={(event) => {
                setGoal(event.target.value)
                setError(null)
              }}
              aria-invalid={error?.field === 'goal'}
              aria-describedby={
                error?.field === 'goal' ? 'goal-error' : undefined
              }
            />
            {error?.field === 'goal' && (
              <FieldError id="goal-error" role="alert">
                {error.message}
              </FieldError>
            )}
          </Field>
          <Actions>
            <Button type="submit">Create task</Button>
            <Button
              type="button"
              variant="secondary"
              onClick={() => navigate('/demo/tasks')}
            >
              Cancel
            </Button>
          </Actions>
        </TaskForm>
      </Content>
    </TaskPage>
  )
}

export const TaskDetailRoute = ({ tasks, onSave }: TaskDetailRouteProps) => {
  const { taskId = '' } = useParams()
  return (
    <TaskDetailPage
      key={taskId}
      task={tasks.find((item) => item.id === taskId)}
      onSave={onSave}
    />
  )
}

const TaskDetailPage = ({ task, onSave }: TaskDetailPageProps) => {
  const navigate = useNavigate()
  const submitting = useRef(false)
  const [title, setTitle] = useState(task?.title ?? '')
  const [goal, setGoal] = useState(task?.goal ?? '')
  const [error, setError] = useState<DeliveryTaskInputError | null>(null)
  const [saved, setSaved] = useState(false)

  if (!task) return <UnknownTaskPage />

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (submitting.current) return
    submitting.current = true
    try {
      if (!onSave(task.id, { title, goal })) {
        navigate('/demo/tasks')
        return
      }
      submitting.current = false
      setSaved(true)
      setError(null)
    } catch (caught) {
      submitting.current = false
      if (caught instanceof DeliveryTaskInputError) setError(caught)
      else throw caught
    }
  }

  return (
    <TaskPage>
      <Breadcrumb to="/demo/tasks">← All tasks</Breadcrumb>
      <PageHeading title={task.title} />
      <Content>
        <Stage>Current stage: {task.stage}</Stage>
        <TaskMeta>Created {new Date(task.createdAt).toLocaleString()}</TaskMeta>
        <TaskForm onSubmit={handleSubmit}>
          <Field>
            <label htmlFor="task-title">Title</label>
            <TextInput
              id="task-title"
              value={title}
              onChange={(event) => {
                setTitle(event.target.value)
                setError(null)
                setSaved(false)
              }}
              aria-invalid={error?.field === 'title'}
              aria-describedby={
                error?.field === 'title' ? 'title-error' : undefined
              }
            />
            {error?.field === 'title' && (
              <FieldError id="title-error" role="alert">
                {error.message}
              </FieldError>
            )}
          </Field>
          <Field>
            <label htmlFor="task-goal">Goal</label>
            <Textarea
              id="task-goal"
              value={goal}
              onChange={(event) => {
                setGoal(event.target.value)
                setError(null)
                setSaved(false)
              }}
              aria-invalid={error?.field === 'goal'}
              aria-describedby={
                error?.field === 'goal' ? 'goal-error' : undefined
              }
            />
            {error?.field === 'goal' && (
              <FieldError id="goal-error" role="alert">
                {error.message}
              </FieldError>
            )}
          </Field>
          <Actions>
            <Button type="submit">Save changes</Button>
            {saved && <TaskMeta role="status">Task updated.</TaskMeta>}
          </Actions>
        </TaskForm>
      </Content>
    </TaskPage>
  )
}

export const UnknownTaskPage = () => (
  <TaskPage>
    <Breadcrumb to="/demo/tasks">← All tasks</Breadcrumb>
    <PageHeading title="Task not found" />
    <Content>
      <TaskMeta role="status">
        This task is unavailable in the current demo session. It may have been
        cleared when the page reloaded.
      </TaskMeta>
    </Content>
  </TaskPage>
)
