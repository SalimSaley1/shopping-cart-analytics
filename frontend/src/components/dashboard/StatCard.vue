<template>
  <q-card flat bordered class="stats-card">
    <q-card-section>
      <div class="text-h6">{{ title }}</div>
      <div class="q-mt-sm text-primary" style="font-size: 20px">
        <template v-if="loading">
          <q-spinner thickness="3" size="30px" color="primary" />
        </template>
        <template v-else>

          <template v-if="props.type === 'text' && !props.value" >
            <q-icon name="report_problem" color="grey" />
            Indisponible
          </template>

          {{ formattedValue }}

        </template>
      </div>
    </q-card-section>
  </q-card>
</template>

<script setup>
import { computed, defineProps } from 'vue'

const props = defineProps({
  title: String,
  value: [Number, String],
  type: {
    type: String,
    default: 'text',
  },
  loading: { // Nouvelle propriété
    type: Boolean,
    default: false,
  },
})

const formattedValue = computed(() => {
  switch (props.type) {
    case 'currency':
      return new Intl.NumberFormat('fr-FR', {
        style: 'currency',
        currency: 'EUR',
      }).format(props.value)
    case 'percentage':
      return new Intl.NumberFormat('fr-FR', {
        style: 'percent',
        minimumFractionDigits: 2,
      }).format(props.value)
    default:
      return props.value
  }
})

/*
const valueClass = computed(() => {
  if (props.type === 'text') {
    return props.value !== "Indisponible!" ? 'text-green' : 'text-red'
  }
  return 'text-primary'
})
 */
</script>

<style>
.stats-card {
  text-align: center;
  padding: 1rem;
}

.q-spinner {
  margin: auto;
}

</style>
