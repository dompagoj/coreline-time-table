import { Request } from 'express'

export interface UserRequest {
  companyId: string
}

export type GenericRequest<T> = T & Request
