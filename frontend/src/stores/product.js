import { api } from 'boot/axios.js'
import { defineStore } from 'pinia'
import { reactive } from 'vue'


export const useProductStore = defineStore('productStore', () => {
  const productStore = reactive([])

  const getProducts  = async (data) => {
    const { data: apiProduct } = await api.get('/products/table',{params: data })
    return apiProduct
  }

  return { productStore,  getProducts}
})

