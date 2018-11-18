export function inRange(value: number): number[] {
  return new Array(value).fill(undefined).map((_, i) => i + 1)
}

export function successCode(status: number) {
  return status < 300 && status >= 200
}

export function sum(array: number[]) {
  const reducer = (accumulator, currentValue) => accumulator + currentValue

  return array.reduce(reducer, 0)
}
