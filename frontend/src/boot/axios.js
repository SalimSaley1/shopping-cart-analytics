// src/boot/axios.js
import { boot } from 'quasar/wrappers'
import axios from 'axios'
import { useUserLoginStore } from 'src/stores/userLogin'

const api = axios.create({
  baseURL: process.env.API_URL,
  headers: { 'Content-Type': 'application/json;charset=UTF-8' }
})

// Intercepteur de requête pour ajouter le token
api.interceptors.request.use(config => {
  const userLoginStore = useUserLoginStore()
  const token = userLoginStore?.currentUser?.token

  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
}, error => Promise.reject(error))

// Intercepteur de réponse pour vérifier si le token est valide
/* api.interceptors.response.use(
  response => response,
  error => {
    if (error.response && error.response.status === 401) {
      const userLoginStore = useUserLoginStore()
      userLoginStore.logout() // Déconnecte l'utilisateur si le token est invalide
      Notify.create({
        type: 'negative',
        message: 'Votre session a expiré. Veuillez vous reconnecter.',
        timeout: 3000
      })
    }
    return Promise.reject(error)
  }
) */

export default boot(({ app }) => {
  app.config.globalProperties.$axios = axios
  app.config.globalProperties.$api = api
})

export { api }
