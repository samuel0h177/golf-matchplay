import { defineStore } from 'pinia'
import { buildEventSeed } from '../data/seed'
import { getMatchOutcome, getMatchSummary } from '../utils/matchScore'
import { loadEventState } from '../utils/storage'

function buildInitialState() {
  const saved = loadEventState()
  if (saved) {
    return saved
  }
  return buildEventSeed()
}

export const useEventStore = defineStore('event', {
  state: () => buildInitialState(),
  getters: {
    teamMap: (state) =>
      Object.fromEntries(state.teams.map((team) => [team.id, team])),
    playerMap: (state) =>
      Object.fromEntries(state.players.map((player) => [player.id, player])),
    playersByTeam: (state) => (teamId) =>
      state.players.filter((player) => player.teamId === teamId),
    matchesBySession: (state) => (sessionId) =>
      state.matches.filter((match) => match.sessionId === sessionId),
    matchSummary: () => (match) => getMatchSummary(match),
    teamPoints: (state) => {
      const totals = Object.fromEntries(state.teams.map((team) => [team.id, 0]))

      state.matches.forEach((match) => {
        const outcome = getMatchOutcome(match)
        if (!outcome) {
          return
        }

        if (outcome === 'HALVED') {
          Object.keys(totals).forEach((teamId) => {
            totals[teamId] += 0.5
          })
          return
        }

        totals[outcome] += 1
      })

      return totals
    },
    sessionPoints: (state) => (sessionId) => {
      const totals = Object.fromEntries(state.teams.map((team) => [team.id, 0]))
      const matches = state.matches.filter((match) => match.sessionId === sessionId)

      matches.forEach((match) => {
        const outcome = getMatchOutcome(match)
        if (!outcome) {
          return
        }

        if (outcome === 'HALVED') {
          Object.keys(totals).forEach((teamId) => {
            totals[teamId] += 0.5
          })
          return
        }

        totals[outcome] += 1
      })

      return totals
    },
  },
  actions: {
    reseed() {
      Object.assign(this, buildEventSeed())
    },
    assignPlayers(matchId, teamKey, playerIds) {
      const match = this.matches.find((item) => item.id === matchId)
      if (!match) return
      if (teamKey === 'teamA') {
        match.teamAPlayerIds = playerIds
      }
      if (teamKey === 'teamB') {
        match.teamBPlayerIds = playerIds
      }
    },
    updateMatch(matchId, patch) {
      const match = this.matches.find((item) => item.id === matchId)
      if (!match) return
      Object.assign(match, patch)
    },
    updateMatchScore(matchId, patch) {
      const match = this.matches.find((item) => item.id === matchId)
      if (!match) return
      match.score = {
        ...match.score,
        ...patch,
      }
    },
  },
})
