export function strToBool(str: string): boolean {
  if (str === 'true') {
    return true
  }
  if (str === 'false') {
    return false
  }

  return null
}
