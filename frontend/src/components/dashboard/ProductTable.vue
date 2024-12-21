
// components/ProductTable.vue
<template>
  <q-card flat bordered>
    <q-card-section>
      <div class="text-h6 q-mb-md">Liste des Produits</div>
      <q-table
        :rows="isLoading ? skeletonRows : products"
        :columns="columns"
        row-key="id"
        flat
        dense
        :pagination="{
          rowsPerPage: 5
        }"
      >

        <!-- Skeleton dynamique pour les autres colonnes -->
        <template
          v-for="col in columns.filter(c => c.name !== 'price' && c.name !== 'totalSales')"
          :key="col.name"
          v-slot:[`body-cell-${col.name}`]="props"
        >
          <q-td :props="props">
            <template v-if="isLoading">
              <q-skeleton type="text" style="width: 250px" />
            </template>
            <template v-else>
              {{ props.value }}
            </template>
          </q-td>
        </template>

        <!-- Personnalisation pour la colonne 'price' -->
        <template v-slot:body-cell-Price="props">
          <q-td :props="props">
            <template v-if="isLoading">
              <q-skeleton type="text" style="width: 250px" />
            </template>
            <template v-else>
              {{ formatCurrency(props.value) }}
            </template>
          </q-td>
        </template>

        <!-- Personnalisation pour la colonne 'totalSales' -->
        <template v-slot:body-cell-totalSales="props">
          <q-td :props="props">
            <template v-if="isLoading">
              <q-skeleton type="text" style="width: 300px" />
            </template>
            <template v-else>
              {{ formatNumber(props.value) }}
            </template>
          </q-td>
        </template>

      </q-table>
    </q-card-section>
  </q-card>
</template>

<script setup>
import { defineProps } from 'vue'

// eslint-disable-next-line no-unused-vars
const props = defineProps({
  products: {
    type: Array,
    default: () => []
  },
  isLoading: {
    type: Boolean,
    default: false,
  }
})

const columns = [
  { name: 'ProductID',
    label: 'ID',
    field: 'ProductID',
    align: 'left'
  },
  {
    name: 'ProductName',
    label: 'Nom',
    field: 'ProductName',
    align: 'left'
  },
  {
    name: 'Price',
    label: 'Prix',
    field: 'Price',
    align: 'center'
  },
  {
    name: 'TotalQuantity',
    label: 'Ventes Totales',
    field: 'TotalQuantity',
    align: 'right'
  }
]
function formatCurrency(value) {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'EUR'
  }).format(value)
}

function formatNumber(value) {
  return new Intl.NumberFormat('fr-FR').format(value)
}

// Faux "Skeleton" data pour simuler des lignes vides
const skeletonRows = Array.from({ length: 4 })
  .map(
    ( ) => {
      return columns.reduce(
        (row, col) => {
          row[col.name] = null
          return row
        }, { ProductID: null } // val initiale
      )
    }
  )

</script>
