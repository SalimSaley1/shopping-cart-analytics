<!-- components/PeriodFilter.vue -->
<template>
  <q-card flat bordered>
    <q-card-section class="row items-center">
      <div class="col">
        <q-select
          v-model="localPeriod"
          :options="periodOptions"
          label="Période"
          outlined
          dense
          emit-value
          map-options
          @update:model-value="onPeriodChange"
        />
      </div>
    </q-card-section>
  </q-card>
</template>

<script setup>
import { onMounted, ref, watch } from 'vue'
import { startOfToday, subDays, subMonths, format } from 'date-fns'

// Props et événements
const props = defineProps({
  selectedPeriod: {
    type: String,
    default: '7Days',
  },
  periodOptions: {
    type: Array,
    default: () => [
      { label: '7 derniers jours', value: '7days' },
      { label: '30 derniers jours', value: '30days' },
      { label: '12 derniers mois', value: '12months' },
    ],
  },
})

const emit = defineEmits(['update:period', 'update:dates', 'onChangePeriod'])

// Réactivité
const localPeriod = ref(props.selectedPeriod)

// Fonction pour calculer les dates
function calculateDates(period) {
  const today = startOfToday()
  let startDate, endDate

  switch (period) {
    case '7days':
      startDate = subDays(today, 6)
      endDate = today
      break
    case '30days':
      startDate = subDays(today, 29)
      endDate = today
      break
    case '12months':
      startDate = subMonths(today, 11)
      endDate = today
      break
    default:
      startDate = null
      endDate = null
  }

  return {
    startDate: startDate ? format(startDate, 'yyyy-MM-dd') : null,
    endDate: endDate ? format(endDate, 'yyyy-MM-dd') : null,
  }
}

// Méthode pour mettre à jour la période et les dates
function onPeriodChange(period) {
  emit('update:period', period)
  const { startDate, endDate } = calculateDates(period)
  emit('update:dates', { startDate, endDate })
  emit('onChangePeriod',{ startDate, endDate })
}

// Mettre à jour la période locale lorsqu'elle change dans les props
watch(
  () => props.selectedPeriod,
  (newValue) => {
    localPeriod.value = newValue
  },
)

onMounted(() => {
  onPeriodChange(props.selectedPeriod)
})
</script>
