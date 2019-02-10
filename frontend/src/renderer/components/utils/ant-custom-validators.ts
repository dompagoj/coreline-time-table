export function positiveNumber(rule, value, callback) {
  if (value < 0) {
    return callback('Must be a positive number')
  }

  return callback()
}

export function isNumber(rule, value, callback) {
  if (value && typeof value !== 'number') {
    return callback('Must be a number')
  }

  return callback()
}

export function requiredIf(expression: boolean, message?) {
  return (rule, value, callback) => {
    if (expression && !value) {
      return callback(message || 'Required')
    }

    return callback()
  }
}

export function maxNumber(num: number) {
  return (rule, value, callback) => {
    if (value > num) {
      return callback(`Max is ${num}`)
    }

    return callback()
  }
}
