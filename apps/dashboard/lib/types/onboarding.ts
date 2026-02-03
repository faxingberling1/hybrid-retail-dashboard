export type OnboardingStep = {
  step_id: string
  title: string
  description?: string
  completed: boolean
  completed_at?: Date
  data: any
  required?: boolean
  order: number
}

export type OnboardingProgress = {
  steps: OnboardingStep[]
  completedCount: number
  totalSteps: number
  percentage: number
  currentStep?: string
  isComplete: boolean
}