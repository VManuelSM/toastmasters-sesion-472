<script setup>
import { computed } from 'vue'
import Pareja from './Pareja.vue'
import { socio } from '../utils/mentoria.js'

/**
 * Pareja socio nuevo–mentor pedida por claves, para la toma de protesta:
 * `<Protesta socio="bolivar" mentor="samuel" />`.
 */
const props = defineProps({
  socio: { type: String, required: true },
  mentor: { type: String, required: true },
  nexo: { type: String, default: 'mentor' },
  /** Dos parejas en una lámina. */
  compacta: { type: Boolean, default: false },
})

const datosSocio = computed(() => socio(props.socio))
const datosMentor = computed(() => socio(props.mentor))
</script>

<template>
  <Pareja :socio="datosSocio" :mentor="datosMentor" :nexo="nexo" :compacta="compacta" />
</template>
