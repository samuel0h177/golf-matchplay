import { faker } from '@faker-js/faker'

faker.seed(202701)

const SESSION_TEMPLATES = [
  { id: 'fri-foursomes', name: 'Friday Foursomes', format: 'foursomes', matchCount: 4 },
  { id: 'fri-fourball', name: 'Friday Four-ball', format: 'fourball', matchCount: 4 },
  { id: 'sat-foursomes', name: 'Saturday Foursomes', format: 'foursomes', matchCount: 4 },
  { id: 'sat-fourball', name: 'Saturday Four-ball', format: 'fourball', matchCount: 4 },
  { id: 'sun-singles', name: 'Sunday Singles', format: 'singles', matchCount: 12 },
]

const TEAM_DEFS = [
  { id: 'usa', name: 'USA', shortName: 'USA', color: '#C8102E', accent: '#F9E547' },
  { id: 'vietnam', name: 'Vietnam', shortName: 'VNM', color: '#0050B5', accent: '#9ED0FF' },
]

function createPlayers(teamId, count) {
  return Array.from({ length: count }, (_, index) => {
    const firstName = faker.person.firstName()
    const lastName = faker.person.lastName()
    return {
      id: `${teamId}-player-${index + 1}`,
      teamId,
      firstName,
      lastName,
      displayName: `${firstName} ${lastName}`,
      avatarUrl: faker.image.avatar(),
      age: faker.number.int({ min: 20, max: 40 }),
      countryCode: faker.location.countryCode(),
      seed: index + 1,
      profile: {
        worldRank: faker.number.int({ min: 1, max: 200 }),
        wins: faker.number.int({ min: 0, max: 12 }),
        top10s: faker.number.int({ min: 0, max: 25 }),
      },
    }
  })
}

function samplePlayers(players, count) {
  return faker.helpers.arrayElements(players, count).map((player) => player.id)
}

function createScore() {
  const status = faker.helpers.arrayElement(['in_progress', 'final'])
  const thru = status === 'final' ? 18 : faker.number.int({ min: 5, max: 18 })
  const holes = Array.from({ length: 18 }, (_, index) => {
    if (index >= thru && status !== 'final') {
      return null
    }
    return faker.helpers.arrayElement(['usa', 'vietnam', null])
  })
  const leader = faker.helpers.arrayElement(['usa', 'vietnam', null])
  const holesUp = leader ? faker.number.int({ min: 1, max: 4 }) : 0

  return {
    status,
    score: {
      leader,
      holesUp,
      thru,
      holes,
    },
  }
}

export function buildEventSeed() {
  const players = [
    ...createPlayers('usa', 12),
    ...createPlayers('vietnam', 12),
  ]

  const sessions = SESSION_TEMPLATES.map((session) => ({
    id: session.id,
    name: session.name,
    format: session.format,
  }))

  const matches = []
  let matchNumber = 1

  SESSION_TEMPLATES.forEach((session) => {
    const teamAPlayers = players.filter((player) => player.teamId === 'usa')
    const teamBPlayers = players.filter((player) => player.teamId === 'vietnam')

    Array.from({ length: session.matchCount }).forEach(() => {
      const selectionSize = session.format === 'singles' ? 1 : 2
      const matchPlayersA = samplePlayers(teamAPlayers, selectionSize)
      const matchPlayersB = samplePlayers(teamBPlayers, selectionSize)
      const scoreState = createScore()

      matches.push({
        id: `match-${matchNumber}`,
        matchNumber,
        sessionId: session.id,
        format: session.format,
        teamAPlayerIds: matchPlayersA,
        teamBPlayerIds: matchPlayersB,
        status: scoreState.status,
        score: scoreState.score,
      })

      matchNumber += 1
    })
  })

  return {
    event: {
      id: 'ryder-modeled',
      name: 'Matchplay Showcase',
      venue: 'Adare Manor (Prototype)',
      dates: 'Sept 13-19, 2027',
    },
    teams: TEAM_DEFS,
    players,
    sessions,
    matches,
  }
}
