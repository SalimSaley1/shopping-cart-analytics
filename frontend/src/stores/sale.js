// src/stores/categoryStore.js
import { defineStore } from 'pinia'
import { reactive } from 'vue'
import { api } from 'src/boot/axios' // Import the Axios instance

export const useSaleStore = defineStore('saleStore', () => {
  const salesStore = reactive([])


  const getTotalSales = async (data) => {
    const {data : apiSale} = await api.get('/analytics/total_sales',{params: data })
    return apiSale.totalSales;
  }


  const getTopProducts  = async (data) => {
    const { data: apiSale } = await api.get('/analytics/trending_products',{params: data })
    return apiSale
  }

  const getTopCategory = async (data) => {
    const { data: apiSale } = await api.get('/analytics/trending_products',{params: data })
    if (apiSale.length === 0){
      return null
    }
    return apiSale[0].category;
  }

  const getTotalSalesQuantity = async (data) => {
    const {data : apiSale} = await api.get('analytics/total_sales_quantity',{params: data })
    return apiSale.totalSalesQuantity;
  }

  const getCategorySales  = async (data) => {
    const { data: apiSale } = await api.get('/analytics/category_sales',{params: data })
    return apiSale
  }




  return { salesStore, getTotalSales, getTotalSalesQuantity , getTopCategory, getTopProducts, getCategorySales }
})
