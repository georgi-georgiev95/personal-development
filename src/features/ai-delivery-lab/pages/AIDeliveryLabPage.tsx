import { useState } from 'react'
import { Route, Routes } from 'react-router-dom'
import {
  completeDeliveryTaskStage,
  acceptDeliveryPlan,
  type DeliveryPlanProposal,
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
  TaskPlanPage,
  TaskDetailRoute,
  TaskListPage,
  UnknownTaskPage,
} from './TaskWorkspace'
export const AIDeliveryLabPage = () => {
  const [tasks, setTasks] = useState<DeliveryTask[]>([])
  const createTask = (task: DeliveryTask): DeliveryTask => {
    setTasks((current) => [task].concat(current))
    return task
  }
  const updateTask = (task: DeliveryTask): DeliveryTask => {
    setTasks((current) =>
      current.map((item) => (item.id === task.id ? task : item))
    )
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
  const acceptPlan = (
    id: string,
    draft: DeliveryPlanProposal
  ): DeliveryTask | null => {
    const task = tasks.find((item) => item.id === id)
    if (!task) return null
    const updated = acceptDeliveryPlan(task, draft)
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

  const composer = (
    <TaskPlanPage
      onCreate={createTask}
      onUpdate={updateTask}
      basePath="/demo"
    />
  )

  return (
    <Routes>
      <Route index element={composer} />
      <Route
        path="tasks"
        element={<TaskListPage tasks={tasks} basePath="/demo" />}
      />
      <Route path="tasks/new" element={composer} />
      <Route
        path="legacy/new"
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
            onAcceptPlan={acceptPlan}
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
