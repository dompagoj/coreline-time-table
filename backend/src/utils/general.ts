import { Poll } from '../data/entities/Poll'
import { User } from '../data/entities/User'

export function getPollWinner(poll?: Poll): User | undefined {
  if (!poll) {
    return undefined
  }
  const { votes } = poll
  const userMap = new Map<User, number>()
  votes.forEach(vote => {
    const { votedFor } = vote
    const currVotes = userMap.get(votedFor)
    userMap.set(votedFor, currVotes || 0 + 1)
  })

  const entries = userMap.entries()
  let winner: User | undefined
  let mostVotes = 0

  let mapEntry = entries.next()
  while (!mapEntry.done) {
    const [user, voteCount] = mapEntry.value
    if (voteCount > mostVotes) {
      winner = user
      mostVotes = voteCount
    }
    mapEntry = entries.next()
  }

  return winner
}
