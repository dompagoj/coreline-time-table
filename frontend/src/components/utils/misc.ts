export function inRange(value: number): number[] {
  return new Array(value).fill(undefined).map((_, i) => i)
}
