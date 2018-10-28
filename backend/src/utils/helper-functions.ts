import { validate } from 'class-validator'
import { Router } from 'express'

export function strToBool(str: string): boolean {
  if (str === 'true') {
    return true
  }
  if (str === 'false') {
    return false
  }

  return null
}

export function registerRoutes(router: Router, Controller: any) {
  Controller.routes.forEach(route => {
    router[route.method](route.route, (req, res) => {
      const controller = new Controller(req, res)
      const result = controller[route.action]()
      if (result instanceof Promise) {
        result.then().catch(e => console.error(e))
      }
    })
  })
}

export async function validateInput(instance: any) {
  return validate(instance).then(errors => {
    return errors.length > 0 ? { errors } : { errors: null }
  })
}
