<template>
  <q-layout view="hHh lpR fFf">
    <q-header elevated>
      <q-toolbar>
        <q-btn flat dense round icon="menu" aria-label="Menu" @click="toggleLeftDrawer" />
        <q-toolbar-title>
          <div class="absolute-center"><q-icon name="shopping_cart" /> Dashboard</div>
        </q-toolbar-title>
        <div v-if="storeUserLogin.currentUser" class="q-mr-md">
          <q-btn round flat>
            <q-avatar>
              <img src="icons/placeholder.jpg" alt="User Avatar" />
            </q-avatar>
            <q-menu auto-close>
              <q-list style="min-width: 200px">
                <q-item>
                  <q-item-section>
                    <div class="text-h6">{{ storeUserLogin.currentUser.name }}</div>
                    <div class="text-caption text-grey">{{ storeUserLogin.currentUser.email }}</div>
                  </q-item-section>
                </q-item>
                <q-separator />
                <q-item clickable @click.prevent="logout()">
                  <q-item-section>
                    <q-icon name="logout" />
                    <span class="q-ml-md">Déconnexion</span>
                  </q-item-section>
                </q-item>
              </q-list>
            </q-menu>
          </q-btn>
        </div>
      </q-toolbar>
    </q-header>
    <q-drawer
      v-model="leftDrawerOpen"
      class="bg-primary"
      :width="200"
      :breakpoint="767"
      show-if-above
      bordered
    >
      <q-list>
        <q-item-label class="text-white" header> Navigation </q-item-label>
        <NavLink v-for="link in navList" :key="link.title" v-bind="link" />
      </q-list>
    </q-drawer>
    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import NavLink from 'src/components/nav/NavLink.vue'
import { useUserLoginStore } from 'src/stores/userLogin'

defineOptions({
  name: 'MainLayout',
})

const storeUserLogin = useUserLoginStore()
const router = useRouter()

const logout = () => {
  // LOGOUT CUSTOMER
  storeUserLogin
    .logout()
    .then((res) => {
      console.log(res)
      router.push({ name: 'login' })
    })
    .catch((e) => {
      console.log(e)
      router.push({ name: 'login' })
    })
}

const navList = [
  {
    title: 'Dashboard',
    icon: 'shopping_cart',
    link: '/dashboard',
  },
]

const leftDrawerOpen = ref(false)

function toggleLeftDrawer() {
  leftDrawerOpen.value = !leftDrawerOpen.value
}
</script>
