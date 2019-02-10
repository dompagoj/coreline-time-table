export interface Hour {
  id: string | number
  amount: number
  description: string
  date: string
  projectId: string | number
  userId: string | number
}

export interface GetHoursOptions {
  userId?: string | number
  where?: {
    month: string | number
  }
}
