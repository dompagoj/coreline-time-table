import { promisify } from "util";
import { randomBytes } from "crypto";

export function getArray(input?: any) {
  if (!input)
    return []

  if (Array.isArray(input))
    return input

  return [input]
}

export const randomBytesPromise = promisify(randomBytes)

export async function createRegisterToken() {
  const buf = await randomBytesPromise(48)

  return buf.toString('hex')
}
