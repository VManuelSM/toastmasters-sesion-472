<script setup>
import { computed } from 'vue'
import Grafo from './Grafo.vue'
import { cluster } from '../utils/mentoria.js'

/**
 * Un grafo de mentoría pedido por la clave del mentor, para que las láminas
 * queden en markdown plano: `<ClusterMentor mentor="victor" />`.
 */
const props = defineProps({
  mentor: { type: String, required: true },
  escala: { type: String, default: 'normal' },
  arranque: { type: Number, default: -90 },
})

const datos = computed(() => cluster(props.mentor))
</script>

<template>
  <Grafo
    :mentor="datos.mentor"
    :discipulos="datos.discipulos"
    :escala="escala"
    :arranque="arranque"
  />
</template>
