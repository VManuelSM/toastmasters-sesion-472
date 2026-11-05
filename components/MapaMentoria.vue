<script setup>
import { computed } from 'vue'
import Grafo from './Grafo.vue'
import { cluster } from '../utils/mentoria.js'
import { anclaMini, ALTO_PIE } from '../utils/grafo.js'

/**
 * El mapa del club: un grafo mini por mentor, en rejilla.
 *
 * Toma las claves de los mentores que se quieren mostrar en vez de recorrer
 * `CLUSTERS` completo, porque dos relaciones no son de hub y spoke y
 * duplicarían caras en la rejilla: la mentoría externa de Oscar Rangel —cuyos
 * discípulos son a su vez mentores— y la mutua entre Carlos A. Sánchez y
 * Edgar Uribe. Esas dos se cuentan en voz alta, no se dibujan aquí.
 *
 * Los ocho grafos comparten ancla y alto para que **todos los mentores queden
 * a la misma altura**: cada caja ajustada a su contenido los dejaría
 * escalonados y la rejilla se leería como un error.
 */
const props = defineProps({
  claves: { type: Array, required: true },
})

const clusters = computed(() => props.claves.map(cluster))

const ancla = computed(() => anclaMini(clusters.value.map((c) => c.discipulos.length)))
const alto = computed(() => 2 * ancla.value + ALTO_PIE)
</script>

<template>
  <div class="mapa">
    <Grafo
      v-for="c in clusters"
      :key="c.mentor.nombre"
      escala="mini"
      :mentor="c.mentor"
      :discipulos="c.discipulos"
      :ancla-y="ancla"
      :alto-fijo="alto"
    />
  </div>
</template>

<style scoped>
/* Rejilla de celda fija, no `flex-wrap`: los grafos tienen distinto ancho
   según cuántos discípulos traen y en flujo libre las columnas bailarían. */
.mapa {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  justify-items: center;
  align-items: start;
  gap: var(--space-3) var(--space-2);
  margin-top: var(--space-3);
}
</style>
