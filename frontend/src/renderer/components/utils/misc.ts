import { readFileSync } from 'fs'
import { join } from 'path'

export enum COLORS {
  LIGHT_YELLOW = '#fdfff7',
}

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

export function getLogoSrc() {
  return 'data:image/jpeg;base64,' + readFileSync(join(__static, '/logo.png')).toString('base64')
}

export function getHoursTableDataSource(hours: number, currMonth) {
  return [
    {
      key: `${hours}-${currMonth}`,
      hours,
    },
  ]
}
