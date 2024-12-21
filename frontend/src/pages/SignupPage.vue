<template>
  <q-page class="flex flex-center bg-soft-grey">
    <q-card flat bordered class="login-card shadow-2">
      <q-card-section class="text-center q-pb-none">
        <div class="text-h4 text-weight-bold text-primary q-mb-md">Inscription</div>

        <div class="login-brand-logo q-mb-md">
          <q-icon name="corporate_fare" size="72px" color="primary" />
        </div>
      </q-card-section>

      <q-card-section>
        <q-form @submit.prevent="storeForm" class="q-gutter-md">
          <q-input
            v-model="form.email"
            type="email"
            label="Adresse email"
            outlined
            dense
            :rules="[
              (val) => !!val || 'L\'email est obligatoire',
              (val) => isValidEmail(val) || 'Veuillez saisir un email valide',
            ]"
            lazy-rules
            color="primary"
            class="input-field"
          >
            <template v-slot:prepend>
              <q-icon name="mail_outline" color="primary" />
            </template>
          </q-input>

          <q-input
            v-model="form.password"
            :type="showPassword ? 'text' : 'password'"
            label="Mot de passe"
            outlined
            dense
            :rules="[
              (val) => !!val || 'Mot de passe requis',
              (val) => val.length >= 8 || 'Minimum 8 caractères',
            ]"
            lazy-rules
            color="primary"
            class="input-field"
          >
            <template v-slot:prepend>
              <q-icon name="lock_outline" color="primary" />
            </template>
            <template v-slot:append>
              <q-icon
                :name="showPassword ? 'visibility_off' : 'visibility'"
                class="cursor-pointer"
                @click="showPassword = !showPassword"
                color="grey-7"
              />
            </template>
          </q-input>

          <q-btn
            type="submit"
            color="primary"
            label="S'inscrire"
            class="full-width q-mt-lg"
            unelevated
            rounded
            size="lg"
            :loading="loading"
          />
        </q-form>
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script setup>
import { reactive, ref } from 'vue'
import useErrors from 'src/use/useErrors.js'
import { useRouter } from 'vue-router'
import { useQuasar } from 'quasar'

const q = useQuasar()
const router = useRouter()
const loading = ref(false)
const showPassword = ref(false)
const form = reactive({
  email: '',
  password: '',
})
const errors = useErrors()

import { useUserLoginStore } from 'stores/userLogin'

const storeUserLogin = useUserLoginStore()

const isValidEmail = (email) => {
  // Vérifier la validité de l'email
  return /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email)
}

const showNotification = (message, type = 'positive') => {
  q.notify({
    message,
    type,
    position: 'top',
    timeout: 2500,
  })
}

const storeForm = async () => {
  loading.value = true

  try {
    const token = await storeUserLogin.store('signup', form)
    //const res = await storeUserLogin.getUserInfo(token)
    console.log(token)
    // console.log('connexion reussie', res)
    showNotification('Utilisateur crée avec succès !')
    await router.push({ name: 'login' })
  } catch (error) {
    errors.record(error.errors, 'form')
    showNotification('Erreur de connexion. Veuillez vérifier vos identifiants.', 'negative')
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.bg-soft-grey {
  background-color: #f5f7fa;
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
}

.login-card {
  width: 100%;
  max-width: 400px;
  border-radius: 12px;
  padding: 24px;
  background: white;
}

.login-brand-logo {
  display: flex;
  justify-content: center;
  opacity: 0.7;
}

.input-field {
  border-radius: 8px;
}

.q-input {
  letter-spacing: 0.5px;
}
</style>
