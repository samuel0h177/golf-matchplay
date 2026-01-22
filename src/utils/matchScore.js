export function getMatchSummary(match) {
  const score = match?.score ?? {}
  const holesUp = Number.isFinite(score.holesUp) ? score.holesUp : 0
  const thru = Number.isFinite(score.thru) ? score.thru : 0
  const leader = score.leader ?? null

  if (!leader || holesUp === 0) {
    return 'TIED'
  }

  if (match.status === 'final' && thru > 0 && thru < 18) {
    const remaining = 18 - thru
    return `${holesUp}&${remaining}`
  }

  return `${holesUp}UP`
}

export function getMatchOutcome(match) {
  const score = match?.score ?? {}
  const leader = score.leader ?? null

  if (match.status !== 'final') {
    return null
  }

  if (!leader) {
    return 'HALVED'
  }

  return leader
}
