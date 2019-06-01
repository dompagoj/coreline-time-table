import { readFileSync } from 'fs'
import { join } from 'path'
import { Project } from '../../types/project-types'
import { Hour } from '../../types/hours-types'

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
  const reducer = (accumulator: number, currentValue: number) => accumulator + currentValue

  return array.reduce(reducer, 0)
}

export function getProjectsTotalHours(projects: Project[]) {
  return sum(flatten(projects.map(p => p.hours.map(h => h.amount))))
}

export function flattenDeep(arr: any[]) {
  return arr.reduce((flat: any[], toFlatten) => {
    return flat.concat(Array.isArray(toFlatten) ? flatten(toFlatten) : toFlatten)
  }, [])
}

export function flatten(arr: any[]) {
  return arr.reduce((flat: any[], a) => {
    return flat.concat(a)
  }, [])
}

export function getLogoSrc() {
  return 'data:image/jpeg;base64,' + readFileSync(join(__static, '/logo.png')).toString('base64')
}

export function getHoursTableDataSource(projects: Project[], currMonth: number) {
  return projects.map(project => {
    return {
      key: `${project.id}-${currMonth}`,
      hours: sum(project.hours.map(h => h.amount)),
      project: project.name,
    }
  })
}

export function groupNoProjectHours(hours: Hour[]) {
  return {
    key: 'noProject',
    hours: sum(hours.map(h => h.amount)),
    project: 'Not specified',
  }
}

export function dummyRequest({ onSuccess }) {
  onSuccess('Ok')
}

export function getBase64(file: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = () => {
      if (reader.result)
        return resolve(reader.result.toString())

      return reject(null)
    }
    reader.onerror = () => reject(null)
  })
}

export function validateFieldsPromise(validateFields) {
  return new Promise(resolve => {
    validateFields((err, values) => {
      if (err) {
        return resolve({ errors: true })
      }

      return resolve({ values })
    })
  })
}

// export async function getBase64 (img) {
//   return new Promise<ArrayBuffer | null | string>(resolve => {
//     const reader = new FileReader()
//     reader.addEventListener('load', () => resolve(reader.result))
//     try {
//       reader.readAsDataURL(img)
//     } catch(e) {
//       resolve(null)
//     }
//   })
// }