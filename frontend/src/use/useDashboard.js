// composables/useDashboard.js
import { ref } from 'vue'
import { useSaleStore } from 'stores/sale.js'
import { useProductStore } from 'stores/product.js'

export function useDashboard() {

  const { getTotalSales, getTotalSalesQuantity, getTopCategory, getTopProducts, getCategorySales} = useSaleStore()
  const { getProducts } = useProductStore()


  const isLoadingTotalSales = ref(false)
  const isLoadingTotalSalesQuantity = ref(false)
  const isLoadingTopCategory = ref(false)
  const isLoadingProducts = ref(false)
  const isLoadingCategorySales = ref(false)
  const isLoadingTopProducts = ref(false)

  const totalSales = ref(0)
  const totalSalesQuantity = ref(0)
  const topCategory = ref('')
  const growthRate = ref(0.15)
  const topProducts = ref([])
  const categorySales = ref([])
  const products = ref([])

  async function updateDashboard(data) {
    await Promise.all([
      updateTotalSales(data),
      updateTotalSalesQuantity(data),
      updateTopCategory(data),
      generateTopProducts(data),
      updateCategorySales(data),
      updateProducts(data)
    ])
  }

  async function updateTotalSales(data) {
    isLoadingTotalSales.value = true
    totalSales.value =  await getTotalSales(data)
    isLoadingTotalSales.value = false
  }
  async function updateTotalSalesQuantity(data) {
    isLoadingTotalSalesQuantity.value = true
    totalSalesQuantity.value =  await getTotalSalesQuantity(data)
    isLoadingTotalSalesQuantity.value = false
  }
  async function updateTopCategory(data) {
    isLoadingTopCategory.value = true
    const newTopCategory = await getTopCategory(data)
    if (!newTopCategory){
      topCategory.value = ''
      isLoadingTopCategory.value = false
      return
    }
    topCategory.value = newTopCategory
    isLoadingTopCategory.value = false
  }
  // For top products graphic
  async function generateTopProducts(data) {
    isLoadingTopProducts.value = true
    const products = await getTopProducts(data)
    if (products.length === 0){
      topProducts.value = []
      isLoadingTopProducts.value = false
      return
    }
    topProducts.value = products.map(product => (
      { name: product.name, value: product['totalQuantity'] }
    ))
    isLoadingTopProducts.value = false
  }

  async function updateCategorySales(data) {
    isLoadingCategorySales.value = true
    const sales = await getCategorySales(data)
    if (sales.length === 0){
      categorySales.value = []
      isLoadingCategorySales.value = false
      return
    }
    categorySales.value = sales.map(sale => (
      { name: sale.category, value: sale.percentage }
    ))
    isLoadingCategorySales.value = false
  }

  // Products table
  async function updateProducts(data) {
    isLoadingProducts.value = true
    const prod = await getProducts(data)
    if (prod.length === 0){
      products.value = []
      isLoadingProducts.value = false
      return
    }
    products.value = prod
    isLoadingProducts.value = false
  }

  return {
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
  }
}
