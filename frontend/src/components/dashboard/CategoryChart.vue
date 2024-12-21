// components/CategoryChart.vue
<template>
  <q-card flat bordered>
    <q-card-section>
      <div class="text-h6 q-mb-md">Répartition des Ventes par Catégorie</div>

      <!-- Conteneur du graphique -->
      <div class="chart-container" style="position: relative;">

        <!-- Graphique Echarts -->
        <div ref="chartRef" style="height: 300px;"></div>

        <!-- Overlay de chargement -->
        <div v-if="loading" class="chart-overlay">
          <q-spinner thickness="3" size="30px" color="primary" class="absolute-full flex flex-center" style="z-index: 10"/>
        </div>

        <div v-else-if="!chartData.length" class="chart-overlay">
          <div class="absolute-full flex flex-center">
            <div style="margin-left: 125px"></div>
            <q-icon name="report_problem" size="3rem" color="grey" />
            <div class="text-caption text-grey q-ml-sm">Données indisponibles</div>
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

const defaultCategorySales = [
  { name: '', value: 0, },
  { name: '', value: 0 },
  { name: '', value: 0 },
  { name: '', value: 0 },
  { name: '', value: 0 }
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
  if (chartRef.value) {
    chart = echarts.init(chartRef.value)

    const option = {
      tooltip: {
        trigger: 'item',
        formatter: '{b}: {c} ({d}%)'
      },
      legend: {
        top: '0%',
        left: 'center'
      },
      series: [{
        name: 'Ventes par Catégorie',
        type: 'pie',
        radius: ['40%', '70%'],
        avoidLabelOverlap: false,
        itemStyle: {
          borderRadius: 10,
          borderColor: '#fff',
          borderWidth: 2
        },
        label: {
          show: true,
          position: 'outside'
        },
        labelLine: { show: true },
        data: props.chartData.length ? props.chartData : defaultCategorySales
      }]
    }

    chart.setOption(option)
  }
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
  background: rgba(255, 255, 255, 0.7);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 10;
}
/*
 ['#e0e0e0', '#f5f5f5', '#cccccc']
 ['#5470c6', '#91cc75', '#fac858', '#ee6666', '#73c0de', '#3ba272', '#fc8452', '#9a60b4', '#ea7ccc']
 */
</style>
