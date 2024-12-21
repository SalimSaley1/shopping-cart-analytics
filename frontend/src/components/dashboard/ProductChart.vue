
// components/ProductChart.vue
<template>
  <q-card flat bordered>
    <q-card-section>
      <div class="text-h6 q-mb-md">Top 5 Produits</div>

      <!-- Conteneur du graphique -->
      <div class="chart-container" style="position: relative;">

        <!-- Graphique -->
        <div
          ref="chartRef"
          style="height: 300px;"
        ></div>

        <!-- Overlay de chargement -->
        <div v-if="loading" class="chart-overlay">
          <q-spinner thickness="3" size="30px" color="primary" class="absolute-full flex flex-center" style="z-index: 10"/>
        </div>

        <div v-else-if="!chartData.length" class="chart-overlay">
          <div class="absolute-full flex flex-center">
            <q-icon name="report_problem" size="3rem" color="grey" />
            <div class="text-caption text-grey q-ml-sm">Aucune donnée disponible</div>
          </div>
        </div>

      </div>

    </q-card-section>
  </q-card>
</template>

<script setup>
import { ref, onMounted, onUnmounted, watch } from 'vue'
import * as echarts from 'echarts'

const props = defineProps({
  chartData: {
    type: Array,
    default: () => []
  },
  loading: {
  type: Boolean,
  default: false
}
})

const defaultTopProducts = [
  { name: 'Keyboard', value: 0 },
  { name: 'Water Bottle', value: 0 },
  { name: 'Graphic Novel', value: 0 },
  { name: 'Salad Spinner', value: 0 },
  { name: 'Scarf', value: 0 }
]

const chartRef = ref(null)
let chart = null

function initChart() {
  if (chartRef.value) {
    chart = echarts.init(chartRef.value)

    updateChart()
  }
}

function updateChart() {
  if (!chart) return

  const option = {
    tooltip: {
      trigger: 'axis',
      axisPointer: { type: 'shadow' }
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      containLabel: true
    },
    xAxis: [{
      type: 'category',
      data: props.chartData.length ? props.chartData.map(item => item.name) : defaultTopProducts.map(item => item.name),
      axisTick: { alignWithLabel: true }
    }],
    yAxis: [{
      type: 'value',
      name: 'Ventes'
    }],
    series: [{
      name: 'Ventes',
      type: 'bar',
      barWidth: '60%',
      data: props.chartData.length ? props.chartData.map(item => item.value) : defaultTopProducts.map(item => item.value),
      itemStyle: {
        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
          { offset: 0, color: '#83bff6' },
          { offset: 0.5, color: '#188df0' },
          { offset: 1, color: '#188df0' }
        ])
      }
    }]
  }

  chart.setOption(option)
}

onMounted(() => {
  initChart()
})

onUnmounted(() => {
  if (chart) {
    chart.dispose()
  }
})

watch(
  () => props.chartData,
    updateChart,
  { deep: true }
)


</script>


<style scoped>

.chart-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(255, 255, 255, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 10;
}

</style>
