import { useState } from 'react'
import { theme } from '@/shared/styles/theme'
import {
  BackLink,
  DetailHeading,
  DetailList,
  DetailPage,
  DetailText,
  DemoLink,
  Eyebrow,
  Heading,
  Intro,
  Section,
  SectionHeading,
  StageButton,
  StageDetails,
  StageGrid,
  StageName,
  StageStatus,
} from './PortfolioPage.styles'

type StageStatusValue = 'complete' | 'active' | 'pending'
type ValidationStatus = 'passed' | 'pending'

interface DeliveryTask {
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

const mockTask: DeliveryTask = {
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
      { check: 'Typecheck', status: 'pending' },
      { check: 'Lint', status: 'pending' },
      { check: 'Coverage', status: 'pending' },
      { check: 'Build and performance', status: 'pending' },
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

export const AIDeliveryLabPage = () => {
  const [selectedStageId, setSelectedStageId] = useState('implementation')
  const selectedStage =
    workflowStages.find((stage) => stage.id === selectedStageId) ??
    workflowStages[0]

  return (
    <DetailPage>
      <BackLink to="/engineering">← back to engineering</BackLink>
      <Eyebrow>// ai delivery lab</Eyebrow>
      <Heading>Make the harness visible.</Heading>
      <Intro>
        A deterministic walkthrough of how repository-aware AI assistance can
        move a task from intent to a verified handoff.
      </Intro>

      <Section>
        <SectionHeading>Mock delivery run</SectionHeading>
        <DetailText>
          <strong>{mockTask.title}</strong> — {mockTask.goal}
        </DetailText>
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
                {result.check}: {result.status}
              </li>
            ))}
          </DetailList>
        </StageDetails>
      </Section>

      <Section>
        <SectionHeading>Harness controls</SectionHeading>
        <DetailList>
          {harnessControls.map((control) => (
            <li key={control}>{control}</li>
          ))}
        </DetailList>
        <DemoLink to="/engineering" $accent={theme.colors.primary}>
          Read the engineering notes →
        </DemoLink>
      </Section>
    </DetailPage>
  )
}

export default AIDeliveryLabPage
