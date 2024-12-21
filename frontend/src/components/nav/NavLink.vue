<template>
  <q-item clickable class="text-white" tag="a" :to="props.link" dense>
    <q-item-section v-if="props.icon" avatar class="q-pr-xs">
      <q-icon :name="props.icon" size="md" class="q-mr-xs" />
    </q-item-section>

    <q-item-section class="q-pr-xs" style="display: flex; align-items: center;">
      <q-item-label class="text-body1 q-mr-xs" style="margin-left: -2rem;">{{ props.title }}</q-item-label>
    </q-item-section>
  </q-item>
</template>

<script setup>
defineOptions({
  name: 'NavLink'
})

const props = defineProps({
  title: {
    type: String,
    required: true
  },

  link: {
    type: String,
    default: '#'
  },

  icon: {
    type: String,
    default: ''
  }
})
</script>
