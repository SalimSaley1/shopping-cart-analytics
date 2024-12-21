import { ref } from 'vue'

export function useFilter() {
  const selectedPeriod = ref('7days')
  const dates = ref({ startDate: null, endDate: null })
  const periodOptions = [
    { label: '7 derniers jours', value: '7days' },
    { label: '30 derniers jours', value: '30days' },
    { label: '12 derniers mois', value: '12months' },
  ]

  function onPeriodUpdate(period) {
    selectedPeriod.value = period
  }

  function onDatesUpdate({ startDate, endDate }) {
    dates.value = { startDate, endDate }
  }

  return { periodOptions, selectedPeriod, onPeriodUpdate, onDatesUpdate, dates }
}
