import { validate } from 'class-validator'
import { Router } from 'express'

export function strToBool(str: string): boolean {
  if (str === 'true') {
    return true
  } else { return false }
}

export function registerRoutes(router: Router, Controller: any) {
  Controller.routes.forEach(route => {
    const { before, after } = route.middlewares
    if (before) {
      before instanceof Array
        ? before.forEach(middleware => {
            router[route.method](route.route, middleware)
          })
        : router[route.method](route.route, before)
    }
    router[route.method](route.route, (req, res, next) => {
      const controller = new Controller(req, res, next)
      const result = controller[route.action](req.body, req.ctx)
      if (result instanceof Promise) {
        // tslint:disable-next-line
        result.then().catch(e => console.error(e))
      }
    })
    if (after) {
      after instanceof Array
        ? route.middlewares.after.forEach(middleware => {
            router[route.method](route.route, middleware)
          })
        : router[route.method](route.route, after)
    }
  })
  Controller.routes = null
}

export function registerRoutesMultiple(router: Router, Controllers: any[]) {
  Controllers.forEach(Controller => {
    Controller.routes.forEach(route => {
    const { before, after } = route.middlewares
    if (before) {
      before instanceof Array
        ? before.forEach(middleware => {
            router[route.method](route.route, middleware)
          })
        : router[route.method](route.route, before)
    }
    router[route.method](route.route, (req, res, next) => {
      const controller = new Controller(req, res, next)
      const result = controller[route.action](req.body, req.ctx)
      if (result instanceof Promise) {
        // tslint:disable-next-line
        result.then().catch(e => console.error(e))
      }
    })
    if (after) {
      after instanceof Array
        ? route.middlewares.after.forEach(middleware => {
            router[route.method](route.route, middleware)
          })
        : router[route.method](route.route, after)
    }
  })
    Controller.routes = null
  })
}

export async function validateInput(instance: any) {
  return validate(instance).then(errors => {
    return errors.length > 0 ? { errors } : { errors: null }
  })
}
