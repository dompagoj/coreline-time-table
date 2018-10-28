import { Request } from 'express'

export interface UserRequest {
  companyId: number
}

export type GenericRequest<T> = T & Request
