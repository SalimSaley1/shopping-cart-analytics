<template>
  <q-layout view="hHh lpR fFf">
    <q-header elevated>
      <q-toolbar>
        <q-btn flat dense round icon="menu" aria-label="Menu" @click="toggleLeftDrawer" />
        <q-toolbar-title>
          <div class="absolute-center"><q-icon name="shopping_cart" /> Dashboard</div>
        </q-toolbar-title>
        <div v-if="storeUserLogin.currentUser">
          <!-- <h5>welcome, {{ storeUserLogin.currentUser.email }}</h5> -->
          <!--<h5>welcome, {{ storeUserLogin.currentUser.email }}</h5> -->
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
      <!-- <router-view :key="$route.fullPath" /> -->
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup>
import { ref } from 'vue'
import NavLink from 'src/components/nav/NavLink.vue'
import { useUserLoginStore } from 'src/stores/userLogin'
const storeUserLogin = useUserLoginStore()

const navList = [
  {
    title: 'Login',
    icon: 'login',
    link: '/login',
  },
  {
    title: 'Register',
    icon: 'person_add',
    link: '/signup',
  },
]

const leftDrawerOpen = ref(false)

function toggleLeftDrawer() {
  leftDrawerOpen.value = !leftDrawerOpen.value
}
</script>
