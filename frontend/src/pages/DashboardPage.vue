// DashboardContainer.vue
<template>
  <q-page class="dashboard-container q-pa-md">
    <div class="row q-col-gutter-md">
      <!-- Filtrage de Période -->
      <div class="col-12">
        <PeriodFilter
          :selected-period="selectedPeriod"
          @update:period="onPeriodUpdate"
          @update:dates="onDatesUpdate"
          @onChangePeriod="updateDashboard"
        />
      </div>

      <!-- Statistiques -->
      <div class="col-12 row">
        <div class="col-12 col-md-3 q-pa-sm" v-for="stat in stats" :key="stat.title">
          <StatCard :title="stat.title" :value="stat.value" :type="stat.type" :loading="stat.loading" />
        </div>
      </div>

      <!-- Graphiques -->
      <div class="col-12 col-md-6">
        <CategoryChart ref="categoryChartRef" :chartData="categorySales" :loading="isLoadingCategorySales"/>
      </div>
      <div class="col-12 col-md-6">
        <ProductChart ref="productChartRef" :chartData="topProducts" :loading="isLoadingTopProducts"/>
      </div>

      <!-- Tableau Produits -->
      <div class="col-12">
        <ProductTable :products="products" :isLoading="isLoadingProducts"/>
      </div>
    </div>
  </q-page>
</template>

<script setup>
import { useDashboard } from 'src/use/useDashboard.js'
import CategoryChart from 'components/dashboard/CategoryChart.vue'
import ProductChart from 'components/dashboard/ProductChart.vue'
import StatCard from 'components/dashboard/StatCard.vue'
import { computed } from 'vue'
import ProductTable from 'components/dashboard/ProductTable.vue'
import PeriodFilter from 'components/dashboard/PeriodFilter.vue'
import { useFilter } from 'src/use/useFilter.js'

const {
  totalSales,
  totalSalesQuantity,
  topCategory,
  growthRate,
  products,
  isLoadingTotalSales,
  isLoadingTotalSalesQuantity,
  isLoadingTopCategory,
  isLoadingProducts,
  isLoadingCategorySales,
  isLoadingTopProducts,
  topProducts,
  categorySales,
  updateDashboard,
} = useDashboard()

const { onPeriodUpdate, onDatesUpdate, selectedPeriod } = useFilter()

const stats = computed(() => [
  {
    title: 'Ventes Totales',
    value: totalSales.value,
    type: 'currency',
    loading: isLoadingTotalSales.value, // Associe le loader à l'état global
  },
  {
    title: 'Produits Vendus',
    value: totalSalesQuantity.value,
    type: 'number',
    loading: isLoadingTotalSalesQuantity.value,
  },
  {
    title: 'Top Catégorie',
    value: topCategory.value,
    type: 'text',
    loading: isLoadingTopCategory.value,
  },
  {
    title: 'Croissance',
    value: growthRate.value,
    type: 'percentage',
    loading: isLoadingTotalSales.value,
  },
])




</script>

<style>
.dashboard-container {
  background-color: #f5f7fa;
}

.stats-card {
  transition: all 0.3s ease;
}

.stats-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
}
</style>
