import { defineStore } from 'pinia'
import { api } from 'src/boot/axios' // Utiliser l'instance d'API

export const useUserLoginStore = defineStore('userLoginStore', {
  state: () => {
    return {
      currentUser: null
      // errors: {}
    }
  },
  actions: {
    async store (endpoint, data) {
      try {
        const response = await api.post(this.pageInfo.STORE_CREDENTIALS + endpoint, data)
        const token = response.data.token
        if (token) {
          this.currentUser = Object.assign({}, { token })
        }
        return token
      } catch (error) {
        throw error.response.data
      }
    },
    async getUserInfo (token) {
      const header = { headers: { Authorization: 'Bearer ' + token } }
      try {
        const response = await api.post(this.pageInfo.LOAD_USER_INFO, null, header)
        this.currentUser = { ...this.currentUser, ...response.data }
        return true
      } catch (error) {
        throw error.response.data
      }
    },
    async logout () {
      if (!this.currentUser) {
        return true
      }

      try {
        await api.post(this.pageInfo.LOGOUT)
        return true
      } catch (error) {
        if (error.response && error.response.status === 401) {
          // Si l'erreur est une expiration de token (statut 401), continue sans bloquer la déconnexion
          console.warn('Le token est expiré ou invalide. Déconnexion locale...')
        } else {
          // Pour toute autre erreur, la jeter pour que le client puisse gérer le message d'erreur
          throw error.response.data
        }
      } finally {
        // Dans tous les cas, réinitialiser l'utilisateur et le token localement
        this.currentUser = null
      }
    },

    removeToken () { this.currentUser = null },
    isUser (id) {
      return this.currentUser?.id === id
    }
  },
  getters: {
    getToken: state => state.currentUser?.token,
    getUserId: state => state.currentUser?.id,
    getName: state => state.currentUser?.name,
    isLoggedIn: state => !!state.currentUser,
    pageInfo: () => ({
      STORE_CREDENTIALS: process.env.API_URL + 'auth/',
      STORE_LOGIN: process.env.API_URL + 'api/login',
      LOAD_USER_INFO: process.env.API_URL + 'api/user',
      LOGOUT: process.env.API_URL + 'api/logout'
    })
  },
  persist: true
})
