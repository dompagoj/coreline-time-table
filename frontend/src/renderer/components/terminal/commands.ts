import parseArgs from 'minimist'
import * as moment from 'moment'
import { hoursStore } from '../../stores/HoursStore'
import { terminalStore } from '../../stores/TerminalStore'
import { dateFromNums } from '../utils/hours'

interface Command {
  name: string
  action(value?: string, params?: {}): any
}

const commands: Command[] = [
  {
    name: 'clear',
    action: () => {
      return (terminalStore.executed = [])
    },
  },
  {
    name: 'add',
    action: async (value, params: Add) => {
      if (!value) {
        return terminalStore.addExecuted('Amount missing')
      }
      const { d, m, y } = params

      const currDate = moment()
      const month = m || currDate.month() + 1
      const day = (d && d + 1) || currDate.date() + 1
      const year = y || currDate.year()
      const date = dateFromNums(month, day, year)

      return hoursStore.createHour({
        date,
        hours: { amount: parseInt(value, 10) },
      })
    },
  },
]

export function findCommand(input: string) {
  return commands.find(command => command.name === input.split(' ')[0])
}

export function executeCommand(input: string) {
  const command = findCommand(input)
  if (!command) {
    return terminalStore.addExecuted(`Command not found: ${input}`)
  }
  terminalStore.addExecuted(input)

  const params = parseArgs(input.split(' '))

  return command.action(params._[1], params)
}

interface Add {
  d?: number
  m?: number
  y?: number
}
