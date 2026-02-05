<script setup>
import { computed, ref } from 'vue'
import { useEventStore } from '../stores/eventStore'
import { useAuthStore } from '../stores/authStore'
import PlayerDrawer from './PlayerDrawer.vue'

const props = defineProps({
  match: {
    type: Object,
    required: true,
  },
})

const store = useEventStore()
const auth = useAuthStore()

const teamAPlayers = computed(() =>
  props.match.teamAPlayerIds
    .map((id) => store.playerMap[id])
    .filter(Boolean),
)

const teamBPlayers = computed(() =>
  props.match.teamBPlayerIds
    .map((id) => store.playerMap[id])
    .filter(Boolean),
)

const matchSummary = computed(() => store.matchSummary(props.match))
const isFinal = computed(() => props.match.status === 'final' || props.match.score?.thru === 18)
const matchStatus = computed(() => (isFinal.value ? 'Final' : 'Live'))
const leader = computed(() => props.match.score?.leader ?? null)
const holeResults = computed(() => {
  const holes = props.match.score?.holes ?? []
  const thru = Number(props.match.score?.thru ?? 0)

  return Array.from({ length: 18 }, (_, index) => {
    if (props.match.status !== 'final' && index >= thru) {
      return 'unplayed'
    }
    return holes[index] ?? null
  })
})
const canEdit = computed(() => {
  if (!auth.isAuthenticated) return false
  if (auth.canEditAnyMatch) return true
  const playerId = auth.currentUser?.playerId
  if (!playerId) return false
  return (
    props.match.teamAPlayerIds.includes(playerId) ||
    props.match.teamBPlayerIds.includes(playerId)
  )
})
const usaPercent = computed(() => {
  if (leader.value === 'usa') return 100
  if (leader.value === 'vietnam') return 0
  return 50
})
const vietnamPercent = computed(() => 100 - usaPercent.value)
const drawerOpen = ref(false)
const activePlayerId = ref(null)

function openPlayer(playerId) {
  activePlayerId.value = playerId
  drawerOpen.value = true
}

function ensureHoles() {
  if (!props.match.score) {
    props.match.score = { leader: null, holesUp: 0, thru: 0, holes: Array(18).fill(null) }
    return
  }
  if (!Array.isArray(props.match.score.holes)) {
    props.match.score.holes = Array(18).fill(null)
    return
  }
  if (props.match.score.holes.length < 18) {
    props.match.score.holes = [
      ...props.match.score.holes,
      ...Array(18 - props.match.score.holes.length).fill(null),
    ]
  }
}

function cycleHole(index) {
  if (!canEdit.value) return
  ensureHoles()
  const current = props.match.score.holes[index]
  const next = current === 'usa' ? 'vietnam' : current === 'vietnam' ? null : 'usa'
  props.match.score.holes[index] = next

  if (props.match.status !== 'final') {
    props.match.score.thru = Math.max(props.match.score.thru ?? 0, index + 1)
  }
}
</script>

<template>
  <v-card class="match-card" variant="flat" color="surface">
    <div class="match-header">
      <div class="match-title">Match {{ match.matchNumber }}</div>
      <div class="match-status">{{ matchStatus }}</div>
    </div>

    <div class="match-rows">
      <div class="match-side">
        <div class="match-team">
          <img class="team-flag" src="/flags/usa.svg" alt="USA flag" />
          USA
        </div>
        <div class="match-players">
          <button
            v-for="player in teamAPlayers"
            :key="player.id"
            type="button"
            class="match-player"
            @click="openPlayer(player.id)"
          >
            <img
              class="player-avatar"
              :src="player.avatarUrl"
              :alt="player.displayName"
            />
            <span>{{ player.displayName }}</span>
          </button>
        </div>
      </div>
      <div class="match-score">
        <div
          class="match-score-text"
          :class="{
            'score-usa': leader === 'usa',
            'score-vietnam': leader === 'vietnam',
          }"
        >
          {{ matchSummary }}
          <span v-if="isFinal" class="score-final">Final</span>
        </div>
      </div>
      <div class="match-side match-side-away">
        <div class="match-team">
          <img class="team-flag" src="/flags/vietnam.svg" alt="Vietnam flag" />
          Vietnam
        </div>
        <div class="match-players">
          <button
            v-for="player in teamBPlayers"
            :key="player.id"
            type="button"
            class="match-player"
            @click="openPlayer(player.id)"
          >
            <span>{{ player.displayName }}</span>
            <img
              class="player-avatar"
              :src="player.avatarUrl"
              :alt="player.displayName"
            />
          </button>
        </div>
      </div>
    </div>

    <div class="match-holes">
      <button
        v-for="holeIndex in 18"
        :key="holeIndex"
        type="button"
        class="hole-chip"
        :class="{
          'hole-usa': holeResults[holeIndex - 1] === 'usa',
          'hole-vietnam': holeResults[holeIndex - 1] === 'vietnam',
          'hole-tied': holeResults[holeIndex - 1] === null,
          'hole-unplayed': holeResults[holeIndex - 1] === 'unplayed',
          'hole-disabled': !canEdit,
        }"
        @click="cycleHole(holeIndex - 1)"
        :disabled="!canEdit"
      >
        {{ holeIndex }}
      </button>
    </div>

    <div class="match-winbar">
      <div class="winbar-labels">
        <span class="winbar-label usa">{{ usaPercent }}%</span>
        <span class="winbar-label vietnam">{{ vietnamPercent }}%</span>
      </div>
      <div class="winbar-track">
        <div class="winbar-usa" :style="{ width: `${usaPercent}%` }" />
        <div class="winbar-vietnam" :style="{ width: `${vietnamPercent}%` }" />
      </div>
    </div>
  </v-card>

  <PlayerDrawer v-model="drawerOpen" :player-id="activePlayerId" />
</template>

<style scoped>
.match-card {
  padding: 16px;
  border-radius: 14px;
  border: 1px solid rgba(15, 23, 42, 0.08);
}

.match-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 12px;
  font-size: 0.9rem;
  color: rgba(15, 23, 42, 0.6);
}

.match-title {
  text-transform: uppercase;
  letter-spacing: 0.12rem;
  font-size: 0.75rem;
}

.match-status {
  font-size: 0.75rem;
}

.match-rows {
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  gap: 12px;
  align-items: center;
}

.match-holes {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  justify-content: center;
  margin-top: 14px;
}

.hole-chip {
  width: 28px;
  height: 28px;
  border-radius: 999px;
  display: grid;
  place-items: center;
  font-size: 0.8rem;
  font-weight: 600;
  color: #111827;
  background: #e5e7eb;
  border: none;
  cursor: pointer;
}

.hole-chip.hole-disabled {
  cursor: not-allowed;
  opacity: 0.6;
}

.hole-usa {
  background: #c8102e;
  color: #fff;
}

.hole-vietnam {
  background: #0050b5;
  color: #fff;
}

.hole-tied {
  background: #d1d5db;
  color: #111827;
}

.hole-unplayed {
  background: #f3f4f6;
  color: #9ca3af;
}

.match-winbar {
  margin-top: 12px;
}

.winbar-labels {
  display: flex;
  justify-content: space-between;
  font-weight: 700;
  font-size: 0.85rem;
  margin-bottom: 6px;
}

.winbar-label.usa {
  color: #c8102e;
}

.winbar-label.vietnam {
  color: #0050b5;
}

.winbar-track {
  display: flex;
  height: 12px;
  border-radius: 999px;
  overflow: hidden;
  background: #e5e7eb;
}

.winbar-usa {
  background: #c8102e;
  transition: width 200ms ease;
}

.winbar-vietnam {
  background: #0050b5;
  transition: width 200ms ease;
}

.match-side {
  display: grid;
  gap: 6px;
}

.match-side-away {
  text-align: right;
}

.match-team {
  font-weight: 600;
  font-size: 0.85rem;
  color: rgba(15, 23, 42, 0.8);
  display: inline-flex;
  gap: 8px;
  align-items: center;
}

.match-side-away .match-team {
  justify-content: flex-end;
}

.match-players {
  display: grid;
  gap: 4px;
  font-size: 0.85rem;
}

.match-player {
  color: rgba(15, 23, 42, 0.75);
  background: transparent;
  border: none;
  padding: 0;
  text-align: left;
  cursor: pointer;
  font: inherit;
  display: inline-flex;
  align-items: center;
  gap: 8px;
}

.match-player:hover {
  color: rgba(15, 23, 42, 1);
  text-decoration: underline;
}

.match-side-away .match-player {
  justify-content: flex-end;
  text-align: right;
}

.player-avatar {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  object-fit: cover;
  box-shadow: 0 0 0 2px #ffffff;
}

.match-score-text {
  font-size: 1.1rem;
  font-weight: 700;
  text-align: center;
  min-width: 64px;
  color: #111827;
  display: inline-flex;
  align-items: baseline;
  gap: 6px;
}

.team-flag {
  width: 20px;
  height: 14px;
  border-radius: 2px;
  box-shadow: 0 0 0 1px rgba(0, 0, 0, 0.08);
  object-fit: cover;
}

.score-usa {
  color: #c8102e;
}

.score-vietnam {
  color: #0050b5;
}

.score-final {
  font-size: 0.75rem;
  text-transform: uppercase;
  letter-spacing: 0.08rem;
  color: rgba(15, 23, 42, 0.6);
}
</style>
