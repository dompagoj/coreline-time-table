export function positiveNumber(rule, value, callback) {
  if (value < 0) {
    return callback('Must be a positive number')
  }

  return callback()
}

export function maxNumber(num: number) {
  return (rule, value, callback) => {
    if (value > num) {
      return callback(`Max is ${num}`)
    }

    return callback()
  }
}
