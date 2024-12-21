import axios from 'axios'
import { useUserLoginStore } from 'stores/userLogin'
export default async ({ store, router }) => {
  const setAuthorization = (token) => {
    axios.defaults.headers.common.Authorization = `Bearer ${token}`
    axios.defaults.headers.common.Accept = 'application/json'
    axios.defaults.headers.common['Content-Type'] = 'application/json'
  }
  // verifyAuth(store, router)
  router.beforeEach((to, from, next) => {
    // USER CUSTOMER
    const requiresAuth = to.matched.some(record => record.meta.requiresAuth)
    const currentUser = useUserLoginStore(store).currentUser
    if (currentUser) {
      setAuthorization(currentUser.token)
    }

    if (requiresAuth && !currentUser) {
      next('/login')
    } else if (to.path === '/login' && requiresAuth) {
      next()
    } else {
      next()
    }
  })

}
