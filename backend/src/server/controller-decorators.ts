export function GET(route: string) {
  return (target: any, methodName: string) => {
    target.constructor.routes.push({
      route,
      method: 'get',
      action: methodName,
    })
  }
}

export function POST(route: string) {
  return (target: any, methodName: string) => {
    target.constructor.routes.push({
      route,
      method: 'post',
      action: methodName,
    })
  }
}

export function PUT(route: string) {
  return (target: any, methodName: string) => {
    target.constructor.routes.push({
      route,
      method: 'put',
      action: methodName,
    })
  }
}

export function DELETE(route: string) {
  return (target: any, methodName: string) => {
    target.constructor.routes.push({
      route,
      method: 'delete',
      action: methodName,
    })
  }
}
