<script setup>
import { computed } from 'vue'
import { useEventStore } from '../stores/eventStore'

const props = defineProps({
  modelValue: {
    type: Boolean,
    required: true,
  },
  playerId: {
    type: String,
    default: null,
  },
})

const emit = defineEmits(['update:modelValue'])
const store = useEventStore()

const player = computed(() => (props.playerId ? store.playerMap[props.playerId] : null))
const team = computed(() => (player.value ? store.teamMap[player.value.teamId] : null))
</script>

<template>
  <v-dialog :model-value="modelValue" max-width="420" @update:model-value="emit('update:modelValue', $event)">
    <v-card color="surface" class="player-card" variant="flat">
      <v-card-title class="player-header">
        <v-avatar size="56">
          <v-img :src="player?.avatarUrl" alt="Player avatar" />
        </v-avatar>
        <div class="player-meta">
          <div class="player-name">{{ player?.displayName }}</div>
          <div class="player-subtitle">
            <v-chip size="x-small" variant="tonal" :color="team?.color">
              {{ team?.name }}
            </v-chip>
            <span class="player-seed">Seed {{ player?.seed }}</span>
          </div>
        </div>
      </v-card-title>
      <v-card-text v-if="player" class="player-details">
        <div class="detail-row">
          <span class="detail-label">Age</span>
          <span class="detail-value">{{ player.age }}</span>
        </div>
        <div class="detail-row">
          <span class="detail-label">World Rank</span>
          <span class="detail-value">#{{ player.profile.worldRank }}</span>
        </div>
        <div class="detail-row">
          <span class="detail-label">Wins</span>
          <span class="detail-value">{{ player.profile.wins }}</span>
        </div>
        <div class="detail-row">
          <span class="detail-label">Top 10s</span>
          <span class="detail-value">{{ player.profile.top10s }}</span>
        </div>
        <div class="detail-row">
          <span class="detail-label">Country</span>
          <span class="detail-value">{{ player.countryCode }}</span>
        </div>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<style scoped>
.player-card {
  border-radius: 16px;
}

.player-header {
  display: flex;
  gap: 16px;
  align-items: center;
}

.player-meta {
  display: grid;
  gap: 6px;
}

.player-name {
  font-weight: 700;
  color: #111827;
}

.player-subtitle {
  display: flex;
  gap: 8px;
  align-items: center;
}

.player-seed {
  font-size: 0.8rem;
  color: rgba(15, 23, 42, 0.6);
}

.player-details {
  display: grid;
  gap: 10px;
  padding-top: 6px;
}

.detail-row {
  display: flex;
  justify-content: space-between;
  font-size: 0.9rem;
}

.detail-label {
  color: rgba(15, 23, 42, 0.6);
}
</style>
