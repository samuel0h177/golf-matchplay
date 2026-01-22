<script setup>
import { computed } from 'vue'
import { useEventStore } from '../stores/eventStore'
import { clearEventState } from '../utils/storage'

const store = useEventStore()
const matches = computed(() => store.matches)
const usaPlayers = computed(() => store.playersByTeam('usa'))
const vietnamPlayers = computed(() => store.playersByTeam('vietnam'))

const statusOptions = [
  { title: 'Live', value: 'in_progress' },
  { title: 'Final', value: 'final' },
]

const leaderOptions = [
  { title: 'Tied', value: null },
  { title: 'USA', value: 'usa' },
  { title: 'Vietnam', value: 'vietnam' },
]

function ensureHoles(match) {
  if (!match.score) {
    match.score = { leader: null, holesUp: 0, thru: 0, holes: Array(18).fill(null) }
    return
  }
  if (!Array.isArray(match.score.holes)) {
    match.score.holes = Array(18).fill(null)
    return
  }
  if (match.score.holes.length < 18) {
    match.score.holes = [
      ...match.score.holes,
      ...Array(18 - match.score.holes.length).fill(null),
    ]
  }
}

function cycleHole(match, index) {
  ensureHoles(match)
  const current = match.score.holes[index]
  const next = current === 'usa' ? 'vietnam' : current === 'vietnam' ? null : 'usa'
  match.score.holes[index] = next
}

function resetSeed() {
  clearEventState()
  store.reseed()
}
</script>

<template>
  <v-container class="py-6">
    <div class="admin-header">
      <div>
        <div class="admin-title">Administration</div>
        <div class="admin-subtitle">Assign players and update match status.</div>
      </div>
      <v-btn color="secondary" variant="tonal" @click="resetSeed">
        Reseed data
      </v-btn>
    </div>

    <v-expansion-panels class="mt-6" variant="accordion">
      <v-expansion-panel v-for="match in matches" :key="match.id">
        <v-expansion-panel-title>
          <div class="panel-title">
            Match {{ match.matchNumber }} · {{ store.matchSummary(match) }}
          </div>
        </v-expansion-panel-title>
        <v-expansion-panel-text>
          <v-row dense>
            <v-col cols="12" md="6">
              <v-select
                v-model="match.teamAPlayerIds"
                :items="usaPlayers"
                item-title="displayName"
                item-value="id"
                label="USA Players"
                multiple
                chips
              />
            </v-col>
            <v-col cols="12" md="6">
              <v-select
                v-model="match.teamBPlayerIds"
                :items="vietnamPlayers"
                item-title="displayName"
                item-value="id"
                label="Vietnam Players"
                multiple
                chips
              />
            </v-col>
            <v-col cols="12" md="4">
              <v-select
                v-model="match.status"
                :items="statusOptions"
                label="Status"
              />
            </v-col>
            <v-col cols="12" md="4">
              <v-select
                v-model="match.score.leader"
                :items="leaderOptions"
                label="Leader"
              />
            </v-col>
            <v-col cols="6" md="2">
              <v-text-field
                v-model.number="match.score.holesUp"
                label="Up"
                type="number"
                min="0"
              />
            </v-col>
            <v-col cols="6" md="2">
              <v-text-field
                v-model.number="match.score.thru"
                label="Thru"
                type="number"
                min="1"
                max="18"
              />
            </v-col>
            <v-col cols="12">
              <div class="hole-controls">
                <div class="hole-controls-title">Hole results</div>
                <div class="hole-controls-grid">
                  <v-btn
                    v-for="holeIndex in 18"
                    :key="holeIndex"
                    size="x-small"
                    variant="tonal"
                    class="hole-control"
                    :class="{
                      'hole-usa': match.score?.holes?.[holeIndex - 1] === 'usa',
                      'hole-vietnam': match.score?.holes?.[holeIndex - 1] === 'vietnam',
                    }"
                    @click="cycleHole(match, holeIndex - 1)"
                  >
                    {{ holeIndex }}
                  </v-btn>
                </div>
                <div class="hole-legend">
                  <span class="legend-chip usa">USA win</span>
                  <span class="legend-chip vietnam">Vietnam win</span>
                  <span class="legend-chip tied">Halved</span>
                </div>
              </div>
            </v-col>
          </v-row>
        </v-expansion-panel-text>
      </v-expansion-panel>
    </v-expansion-panels>
  </v-container>
</template>

<style scoped>
.admin-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  flex-wrap: wrap;
}

.admin-title {
  font-size: 1.3rem;
  font-weight: 700;
}

.admin-subtitle {
  color: rgba(15, 23, 42, 0.6);
}

.panel-title {
  font-weight: 600;
}

.hole-controls {
  display: grid;
  gap: 8px;
  margin-top: 6px;
}

.hole-controls-title {
  font-weight: 600;
  font-size: 0.9rem;
}

.hole-controls-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.hole-control {
  min-width: 32px;
}

.hole-control.hole-usa {
  background: #c8102e !important;
  color: #fff !important;
}

.hole-control.hole-vietnam {
  background: #0050b5 !important;
  color: #fff !important;
}

.hole-legend {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  font-size: 0.8rem;
  color: rgba(15, 23, 42, 0.6);
}

.legend-chip {
  display: inline-flex;
  align-items: center;
  gap: 6px;
}

.legend-chip::before {
  content: '';
  width: 10px;
  height: 10px;
  border-radius: 999px;
  background: #e5e7eb;
}

.legend-chip.usa::before {
  background: #c8102e;
}

.legend-chip.vietnam::before {
  background: #0050b5;
}
</style>
