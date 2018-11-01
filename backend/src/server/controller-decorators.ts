import { DecoratorOptions } from '../data/types/decorator-types'

export function GET(route: string, options?: DecoratorOptions) {
  return (target: any, methodName: string) => {
    target.constructor.routes.push({
      route,
      method: 'get',
      action: methodName,
      middlewares: {
        before: options && options.before || null,
        after: options && options.after || null,
      },
    })
  }
}

export function POST(route: string, options?: DecoratorOptions) {
  return (target: any, methodName: string) => {
    target.constructor.routes.push({
      route,
      method: 'post',
      action: methodName,
      middlewares: {
        before: options && options.before || null,
        after: options && options.after || null,
      },

    })
  }
}

export function PUT(route: string, options?: DecoratorOptions) {
  return (target: any, methodName: string) => {
    target.constructor.routes.push({
      route,
      method: 'put',
      action: methodName,
      middlewares: {
        before: options && options.before || null,
        after: options && options.after || null,
      },

    })
  }
}

export function DELETE(route: string, options?: DecoratorOptions) {
  return (target: any, methodName: string) => {
    target.constructor.routes.push({
      route,
      method: 'delete',
      action: methodName,
      middlewares: {
        before: options && options.before || null,
        after: options && options.after || null,
      },

    })
  }
}
