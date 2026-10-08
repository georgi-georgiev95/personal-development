import { useState } from 'react'
import {
  createDemoJourney,
  type DemoJourney,
} from '@/features/ai-delivery-lab/demoJourneys'
import { Route, Routes, useNavigate } from 'react-router-dom'
import {
  completeDeliveryTaskStage,
  reopenDeliveryTaskStage,
  recordDeliveryValidationResult,
  recordDeliveryReviewDecision,
  type DeliveryReviewInput,
  saveDeliveryArtifact,
  updateDeliveryTask,
  type DeliveryTask,
  type DeliveryStage,
  type DeliveryArtifactStage,
  type DeliveryValidationCheckId,
  type DeliveryValidationSource,
  type DeliveryValidationStatus,
  type DeliveryTaskInput,
} from '@/entities/delivery-task'
import {
  TaskCreatePage,
  TaskDetailRoute,
  TaskListPage,
  UnknownTaskPage,
} from './TaskWorkspace'
import {
  BackLink,
  DetailHeading,
  DetailList,
  DetailPage,
  DetailText,
  Eyebrow,
  Heading,
  Intro,
  ResetButton,
  SimulatedNote,
  Section,
  SectionHeading,
  StageButton,
  StageDetails,
  StageGrid,
  StageName,
  StageStatus,
} from './AIDeliveryLabPage.styles'

type StageStatusValue = 'complete' | 'active' | 'pending'
type ValidationStatus = 'passed' | 'pending'

interface MockDeliveryTask {
  title: string
  goal: string
}

interface DeliveryAgent {
  name: string
  role: string
}

interface DeliveryArtifact {
  kind: string
  title: string
}

interface ApprovalGate {
  required: boolean
  description: string
}

interface ValidationResult {
  check: string
  status: ValidationStatus
  source: 'demo'
}

interface WorkflowStage {
  id: string
  name: string
  status: StageStatusValue
  summary: string
  agent: DeliveryAgent
  artifacts: DeliveryArtifact[]
  approval?: ApprovalGate
  validationResults: ValidationResult[]
}

const mockTask: MockDeliveryTask = {
  title: 'Present the AI engineering harness with an AI Delivery Lab',
  goal: 'Make the repository workflow and its quality controls inspectable.',
}

const workflowStages: WorkflowStage[] = [
  {
    id: 'discovery',
    name: 'Discovery',
    status: 'complete',
    summary: 'Clarify the outcome, constraints, and repository context.',
    agent: { name: 'Discovery agent', role: 'Requirements' },
    artifacts: [{ kind: 'context', title: 'Goal and repository context' }],
    validationResults: [],
  },
  {
    id: 'planning',
    name: 'Planning',
    status: 'complete',
    summary:
      'Turn the goal into a small, dependency-aware implementation plan.',
    agent: { name: 'Planning agent', role: 'Task planning' },
    artifacts: [{ kind: 'plan', title: 'Plan and acceptance criteria' }],
    validationResults: [],
  },
  {
    id: 'implementation',
    name: 'Implementation',
    status: 'active',
    summary: 'Apply the smallest change that satisfies the approved scope.',
    agent: { name: 'Implementation agent', role: 'Repository changes' },
    artifacts: [{ kind: 'diff', title: 'Changed-file summary' }],
    approval: {
      required: true,
      description: 'Human approval before consequential external changes.',
    },
    validationResults: [],
  },
  {
    id: 'validation',
    name: 'Validation',
    status: 'pending',
    summary: 'Run typecheck, lint, tests, build, and performance checks.',
    agent: { name: 'Validation agent', role: 'Quality checks' },
    artifacts: [{ kind: 'checks', title: 'Quality-gate results' }],
    validationResults: [
      { check: 'Typecheck', status: 'pending', source: 'demo' },
      { check: 'Lint', status: 'pending', source: 'demo' },
      { check: 'Coverage', status: 'pending', source: 'demo' },
      { check: 'Build and performance', status: 'pending', source: 'demo' },
    ],
  },
  {
    id: 'review',
    name: 'Review',
    status: 'pending',
    summary:
      'Inspect behavior, accessibility, scope, and unnecessary complexity.',
    agent: { name: 'Review agent', role: 'Quality review' },
    artifacts: [{ kind: 'review', title: 'Review findings and decision' }],
    approval: {
      required: true,
      description: 'Human review confirms the outcome is ready to hand off.',
    },
    validationResults: [],
  },
  {
    id: 'handoff',
    name: 'Handoff',
    status: 'pending',
    summary: 'Record decisions, validation, blockers, and the next safe step.',
    agent: { name: 'Handoff agent', role: 'Delivery summary' },
    artifacts: [{ kind: 'handoff', title: 'Handoff summary' }],
    validationResults: [],
  },
]

const harnessControls = [
  'Repository instructions establish boundaries and conventions.',
  'Skills package repeatable workflows such as TDD, review, and handoff.',
  'Human approval remains required for consequential external changes.',
  'Quality gates make the final result measurable.',
]

const DemoWalkthrough = () => {
  const navigate = useNavigate()
  const [selectedStageId, setSelectedStageId] = useState('implementation')
  const selectedStage =
    workflowStages.find((stage) => stage.id === selectedStageId) ??
    workflowStages[0]

  return (
    <DetailPage>
      <BackLink to="/">← AI Delivery Lab</BackLink>
      <Eyebrow>// ai delivery lab</Eyebrow>
      <Heading>Make the harness visible.</Heading>
      <SimulatedNote>
        Simulated demo · no automated work is performed
      </SimulatedNote>
      <Intro>
        A deterministic walkthrough of how repository-aware AI assistance can
        move a task from intent to a verified handoff.
      </Intro>

      <Section>
        <SectionHeading>Mock delivery run</SectionHeading>
        <DetailText>
          <strong>{mockTask.title}</strong> — {mockTask.goal}
        </DetailText>
        <ResetButton
          type="button"
          onClick={() => setSelectedStageId('implementation')}
        >
          Reset example
        </ResetButton>
        <StageGrid aria-label="AI delivery workflow">
          {workflowStages.map((stage) => (
            <StageButton
              key={stage.id}
              type="button"
              $active={stage.id === selectedStage.id}
              aria-pressed={stage.id === selectedStage.id}
              onClick={() => setSelectedStageId(stage.id)}
            >
              <StageName>{stage.name}</StageName>
              <StageStatus $status={stage.status}>{stage.status}</StageStatus>
            </StageButton>
          ))}
        </StageGrid>
        <StageDetails>
          <DetailHeading>
            {selectedStage.name}
            <StageStatus $status={selectedStage.status}>
              {selectedStage.status}
            </StageStatus>
          </DetailHeading>
          <DetailText>{selectedStage.summary}</DetailText>
          <DetailList>
            <li>
              Agent: {selectedStage.agent.name} ({selectedStage.agent.role})
            </li>
            {selectedStage.artifacts.map((artifact) => (
              <li key={artifact.kind}>Artifact: {artifact.title}</li>
            ))}
            {selectedStage.approval?.required && (
              <li>Approval gate: {selectedStage.approval.description}</li>
            )}
            {selectedStage.validationResults.map((result) => (
              <li key={result.check}>
                {result.check}: {result.status} · Simulated demo
              </li>
            ))}
          </DetailList>
        </StageDetails>
      </Section>

      <Section>
        <SectionHeading>Demo tasks</SectionHeading>
        <DetailText>
          Create tasks, browse their details, and record a simple goal in this
          temporary demo workspace.
        </DetailText>
        <ResetButton type="button" onClick={() => navigate('/demo/tasks')}>
          Browse demo tasks
        </ResetButton>
      </Section>

      <Section>
        <SectionHeading>Harness controls</SectionHeading>
        <DetailList>
          {harnessControls.map((control) => (
            <li key={control}>{control}</li>
          ))}
        </DetailList>
      </Section>
    </DetailPage>
  )
}

export const AIDeliveryLabPage = () => {
  const [tasks, setTasks] = useState<DeliveryTask[]>([])
  const createTask = (task: DeliveryTask): DeliveryTask => {
    setTasks((current) => [task].concat(current))
    return task
  }
  const createSample = (journey: DemoJourney): DeliveryTask => {
    const task = createDemoJourney(journey)
    setTasks((current) => [task, ...current])
    return task
  }
  const saveTask = (
    id: string,
    input: DeliveryTaskInput
  ): DeliveryTask | null => {
    const task = tasks.find((item) => item.id === id)
    if (!task) return null
    const updated = updateDeliveryTask(task, input)
    setTasks((current) =>
      current.map((item) => (item.id === id ? updated : item))
    )
    return updated
  }
  const saveArtifact = (
    id: string,
    stage: DeliveryArtifactStage,
    content: string
  ): DeliveryTask | null => {
    const task = tasks.find((item) => item.id === id)
    if (!task) return null
    const updated = saveDeliveryArtifact(task, stage, content)
    setTasks((current) =>
      current.map((item) => (item.id === id ? updated : item))
    )
    return updated
  }
  const saveValidationResult = (
    id: string,
    checkId: DeliveryValidationCheckId,
    status: DeliveryValidationStatus,
    note: string,
    source: Exclude<DeliveryValidationSource, 'demo'> | null
  ): DeliveryTask | null => {
    const task = tasks.find((item) => item.id === id)
    if (!task) return null
    const updated = recordDeliveryValidationResult(
      task,
      checkId,
      status,
      note,
      source
    )
    setTasks((current) =>
      current.map((item) => (item.id === id ? updated : item))
    )
    return updated
  }
  const completeStage = (
    id: string,
    stage: DeliveryStage
  ): DeliveryTask | null => {
    const task = tasks.find((item) => item.id === id)
    if (!task) return null
    const updated = completeDeliveryTaskStage(task, stage)
    setTasks((current) =>
      current.map((item) => (item.id === id ? updated : item))
    )
    return updated
  }
  const reviewTask = (
    id: string,
    input: DeliveryReviewInput
  ): DeliveryTask | null => {
    const task = tasks.find((item) => item.id === id)
    if (!task) return null
    const updated = recordDeliveryReviewDecision(task, input)
    setTasks((current) =>
      current.map((item) => (item.id === id ? updated : item))
    )
    return updated
  }
  const reopenStage = (
    id: string,
    stage: DeliveryStage
  ): DeliveryTask | null => {
    const task = tasks.find((item) => item.id === id)
    if (!task) return null
    const updated = reopenDeliveryTaskStage(task, stage)
    setTasks((current) =>
      current.map((item) => (item.id === id ? updated : item))
    )
    return updated
  }

  return (
    <Routes>
      <Route index element={<DemoWalkthrough />} />
      <Route
        path="tasks"
        element={
          <TaskListPage
            tasks={tasks}
            onCreateSample={createSample}
            basePath="/demo"
          />
        }
      />
      <Route
        path="tasks/new"
        element={<TaskCreatePage onCreate={createTask} basePath="/demo" />}
      />
      <Route
        path="tasks/:taskId"
        element={
          <TaskDetailRoute
            tasks={tasks}
            basePath="/demo"
            onSave={saveTask}
            onSaveArtifact={saveArtifact}
            onSaveValidationResult={saveValidationResult}
            onReview={reviewTask}
            onCompleteStage={completeStage}
            onReopenStage={reopenStage}
          />
        }
      />
      <Route path="*" element={<UnknownTaskPage />} />
    </Routes>
  )
}

export default AIDeliveryLabPage
