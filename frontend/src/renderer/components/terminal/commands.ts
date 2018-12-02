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
      terminalStore.executed = []
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

      hoursStore.createHour({
        date,
        hours: { amount: parseInt(value, 10) },
      })
    },
  },
  {
    name: 'hours',
    action: async () => {
      if (!hoursStore.hours) {
        await hoursStore.getHours()
      }

      const sum = hoursStore.getMonthHours(moment())

      return `Total hours this month: ${sum}`
    },
  },
]

export function findCommand(input: string) {
  return commands.find(command => command.name === input.split(' ')[0])
}

export async function executeCommand(input: string) {
  const command = findCommand(input)
  if (!command) {
    return terminalStore.addExecuted(input !== '' ? `Command not found: ${input}` : '')
  }
  terminalStore.addExecuted(input)
  const params = parseArgs(input.split(' '))
  const result = await command.action(params._[1], params)

  if (result && !Array.isArray(result)) {
    return terminalStore.addExecuted(result)
  }
}

interface Add {
  d?: number
  m?: number
  y?: number
}
