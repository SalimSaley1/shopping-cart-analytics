import { useUserLoginStore } from 'stores/userLogin'
const routes = [

  {
    path: '/',
    component: () => import('layouts/LoggedLayout.vue'),
    children: [
      { path: '',name : 'dashboard', component: () => import('pages/DashboardPage.vue'), meta: { requiresAuth: true } }
    ]
  },
  {
    path: '/login',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', name : 'login', component: () => import('pages/LoginPage.vue') ,
        beforeEnter: (to, from, next) => {
        const userStore = useUserLoginStore()
        const currentUser = userStore.currentUser

        if (currentUser) {
          next('/')
        } else {
          next()
        }
      }}
    ]
  },
  {
    path: '/signup',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '',name : 'signup', component: () => import('pages/SignupPage.vue') ,
        beforeEnter: (to, from, next) => {
        const userStore = useUserLoginStore()
        const currentUser = userStore.currentUser

        if (currentUser) {
          next('/')
        } else {
          next()
        }
      }}
    ]
  },
 

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue')
  }
]

export default routes
