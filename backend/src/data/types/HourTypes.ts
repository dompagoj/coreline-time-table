interface Hours {
  amount: number
  projectId?: number
  description?: string
}

export interface CreateHourInput {
  hours: Hours,
  date: Date
}

export type UpdateHourInput = Hours
