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
    if (route.middlewares.before) {
    route.middlewares.before.forEach(middleware => {
      router[route.method](route.route, middleware)
    })
  }
    router[route.method](route.route, (req, res) => {
      const controller = new Controller(req, res)
      const result = controller[route.action]()
      if (result instanceof Promise) {
        result.then().catch(e => console.error(e))
      }
    })
    if (route.middlewares.after) {
    route.middlewares.after.forEach(middleware => {
      router[route.method](route.route, middleware)
    })
  }
  })
}

export async function validateInput(instance: any) {
  return validate(instance).then(errors => {
    return errors.length > 0 ? { errors } : { errors: null }
  })
}
