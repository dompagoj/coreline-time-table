export function getArray(input?: any) {
  if (!input)
    return []

  if (Array.isArray(input))
    return input

  return [input]
}