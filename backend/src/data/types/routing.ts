export interface Route {
  method: 'get' | 'post' | 'put' | 'delete'
  route: string
  action: string
}
