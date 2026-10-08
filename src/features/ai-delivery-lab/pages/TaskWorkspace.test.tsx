import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { describe, expect, it } from 'vitest'
import {
  createDeliveryTask,
  removeDeliveryContextEntry,
  saveDeliveryArtifact,
  saveDeliveryContextEntry,
  type DeliveryTask,
} from '@/entities/delivery-task'
import { AIDeliveryLabPage } from './AIDeliveryLabPage'
import { TaskCreatePage, TaskDetailRoute } from './TaskWorkspace'

describe('private task creation retry', () => {
  it('keeps a stable task ID and waits for the save before navigating', async () => {
    const user = userEvent.setup()
    const attemptedIds: string[] = []
    let attempts = 0
    const onCreate = async (task: DeliveryTask) => {
      attemptedIds.push(task.id)
      attempts += 1
      if (attempts === 1) throw new Error('offline')
      return task
    }

    render(
      <MemoryRouter initialEntries={['/workspace/tasks/new']}>
        <Routes>
          <Route
            path="/workspace/tasks/new"
            element={
              <TaskCreatePage onCreate={onCreate} basePath="/workspace" />
            }
          />
          <Route
            path="/workspace/tasks/:taskId"
            element={<p>Saved task details</p>}
          />
        </Routes>
      </MemoryRouter>
    )

    await user.type(screen.getByLabelText('Title'), 'Personal task')
    await user.type(screen.getByLabelText('Goal'), 'Persist after reload')
    await user.click(screen.getByRole('button', { name: 'Create task' }))

    expect(await screen.findByRole('alert')).toHaveTextContent(
      'Could not save this task. Try again.'
    )
    expect(screen.queryByText('Saved task details')).not.toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: 'Create task' }))
    expect(await screen.findByText('Saved task details')).toBeInTheDocument()
    expect(attemptedIds).toHaveLength(2)
    expect(attemptedIds[0]).toBe(attemptedIds[1])
  })
})

describe('private project context', () => {
  it('warns when a legacy plan predates saved project context', () => {
    const base = saveDeliveryArtifact(
      createDeliveryTask({ title: 'Private task', goal: 'Use context' }),
      'planning',
      'Earlier plan'
    )
    const task: DeliveryTask = {
      ...base,
      stage: 'planning',
      contextEntries: [
        {
          id: 'readme',
          name: 'README excerpt',
          content: 'Project facts',
          revision: 1,
          createdAt: base.createdAt,
          updatedAt: base.updatedAt,
        },
      ],
      contextRevision: 1,
      artifacts: {
        ...base.artifacts,
        planning: { ...base.artifacts.planning!, contextRevision: undefined },
      },
    }

    render(
      <MemoryRouter initialEntries={[`/workspace/tasks/${task.id}`]}>
        <Routes>
          <Route
            path="/workspace/tasks/:taskId"
            element={
              <TaskDetailRoute
                tasks={[task]}
                basePath="/workspace"
                onSave={() => task}
                onSaveArtifact={() => task}
                onSaveValidationResult={() => task}
                onCompleteStage={() => task}
                onReview={() => task}
                onReopenStage={() => task}
                onSaveContext={() => task}
                onRemoveContext={() => task}
              />
            }
          />
        </Routes>
      </MemoryRouter>
    )

    expect(
      screen.getByText(/Project context changed after this plan was saved/)
    ).toBeInTheDocument()
    expect(
      screen.getByText(/against context revision 1 and save it again/)
    ).toBeInTheDocument()
  })

  it('saves, reloads, edits, and removes context without adding it to the demo', async () => {
    const user = userEvent.setup()
    let task = createDeliveryTask({
      title: 'Private task',
      goal: 'Use context',
    })
    const route = () => (
      <MemoryRouter initialEntries={[`/workspace/tasks/${task.id}`]}>
        <Routes>
          <Route
            path="/workspace/tasks/:taskId"
            element={
              <TaskDetailRoute
                tasks={[task]}
                basePath="/workspace"
                onSave={() => task}
                onSaveArtifact={() => task}
                onSaveValidationResult={() => task}
                onCompleteStage={() => task}
                onReview={() => task}
                onReopenStage={() => task}
                onSaveContext={(_id, input) => {
                  task = saveDeliveryContextEntry(task, input)
                  return task
                }}
                onRemoveContext={(_id, contextId) => {
                  task = removeDeliveryContextEntry(task, contextId)
                  return task
                }}
              />
            }
          />
        </Routes>
      </MemoryRouter>
    )
    const view = render(route())

    expect(
      screen.getByText(/sent to AI only when you explicitly generate a plan/)
    ).toBeInTheDocument()
    expect(
      screen.getByText(/Do not include passwords, tokens/)
    ).toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: 'Add context' }))
    await user.type(screen.getByLabelText('Context name'), 'README excerpt')
    await user.type(
      screen.getByLabelText('Plain-text context'),
      'Use the existing routing pattern.'
    )
    await user.click(screen.getByRole('button', { name: 'Save context' }))
    view.rerender(route())
    expect(screen.getByText('README excerpt')).toBeInTheDocument()
    expect(
      screen.getByText('Entry revision 1 · Task context revision 1')
    ).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: 'Edit' }))
    await user.clear(screen.getByLabelText('Plain-text context'))
    await user.type(
      screen.getByLabelText('Plain-text context'),
      'Updated project facts.'
    )
    await user.click(screen.getByRole('button', { name: 'Save context' }))
    view.rerender(route())
    expect(screen.getByText('Updated project facts.')).toBeInTheDocument()
    expect(
      screen.getByText('Entry revision 2 · Task context revision 2')
    ).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: 'Remove' }))
    view.rerender(route())
    expect(
      screen.getByText('No project context saved yet.')
    ).toBeInTheDocument()
    expect(task.contextRevision).toBe(3)
  })
})

describe('stage artifact editor', () => {
  it('saves literal text, rejects blank input, cancels edits, and keeps notes during navigation', async () => {
    const user = userEvent.setup()
    render(
      <MemoryRouter initialEntries={['/demo/tasks/new']}>
        <Routes>
          <Route path="/demo/*" element={<AIDeliveryLabPage />} />
        </Routes>
      </MemoryRouter>
    )

    await user.type(screen.getByLabelText('Title'), 'Example task')
    await user.type(screen.getByLabelText('Goal'), 'Record a delivery outcome')
    await user.click(screen.getByRole('button', { name: 'Create task' }))
    await screen.findByRole('button', { name: 'Save discovery notes' })

    await user.click(
      screen.getByRole('button', { name: 'Save discovery notes' })
    )
    expect(screen.getByRole('alert')).toHaveTextContent(
      'Enter some notes before saving.'
    )

    const literalText = '<script>alert("hello")</script>'
    const editor = screen.getByRole('textbox', { name: 'Discovery notes' })
    await user.type(editor, literalText)
    await user.click(
      screen.getByRole('button', { name: 'Save discovery notes' })
    )
    expect(screen.getByText(literalText)).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: 'Edit' }))
    await user.clear(screen.getByRole('textbox', { name: 'Discovery notes' }))
    await user.type(
      screen.getByRole('textbox', { name: 'Discovery notes' }),
      'Unsaved edit'
    )
    await user.click(screen.getByRole('button', { name: 'Cancel' }))
    expect(screen.getByText(literalText)).toBeInTheDocument()

    await user.click(screen.getByRole('link', { name: '← All tasks' }))
    await user.click(screen.getByRole('link', { name: 'Example task' }))
    expect(screen.getByText(literalText)).toBeInTheDocument()
  })
})

describe('validation results', () => {
  it('labels manual evidence, explains blockers, and marks results stale after work changes', async () => {
    const user = userEvent.setup()
    render(
      <MemoryRouter initialEntries={['/demo/tasks/new']}>
        <Routes>
          <Route path="/demo/*" element={<AIDeliveryLabPage />} />
        </Routes>
      </MemoryRouter>
    )

    await user.type(screen.getByLabelText('Title'), 'Validation task')
    await user.type(screen.getByLabelText('Goal'), 'Record actual checks')
    await user.click(screen.getByRole('button', { name: 'Create task' }))
    await screen.findByRole('button', { name: 'Complete stage' })
    await user.click(screen.getByRole('button', { name: 'Complete stage' }))
    await user.click(screen.getByRole('button', { name: 'Complete stage' }))
    await user.click(screen.getByRole('button', { name: 'Complete stage' }))

    expect(screen.getByText(/Typecheck has not been run/)).toBeInTheDocument()
    expect(
      screen.getByRole('button', { name: 'Complete stage' })
    ).toBeDisabled()

    await user.selectOptions(
      screen.getByLabelText('Result for Typecheck'),
      'passed'
    )
    await user.click(
      screen.getByRole('button', { name: 'Save Typecheck result' })
    )
    expect(screen.getByRole('alert')).toHaveTextContent(
      'Add an evidence note or URL before marking a check passed.'
    )

    await user.type(
      screen.getByLabelText(/Evidence note or URL for Typecheck/),
      'pnpm typecheck succeeded'
    )
    await user.click(
      screen.getByRole('button', { name: 'Save Typecheck result' })
    )
    expect(screen.getByText('Passed · manually reported')).toBeInTheDocument()
    expect(screen.getByText(/Lint has not been run/)).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: /Implementation/ }))
    await user.type(
      screen.getByRole('textbox', { name: 'Implementation notes' }),
      'Implementation changed after checks.'
    )
    await user.click(
      screen.getByRole('button', { name: 'Save implementation notes' })
    )
    await user.click(screen.getByRole('button', { name: /Validation/ }))

    expect(
      screen.getByText(/Stale: evidence is for work revision/)
    ).toBeInTheDocument()
    expect(screen.getByText(/current work revision is 2/)).toBeInTheDocument()
  })
})
