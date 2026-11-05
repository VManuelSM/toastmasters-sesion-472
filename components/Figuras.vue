<script setup lang="ts">
/**
 * Capa de figuras en gradiente que derivan detrás del contenido.
 *
 * Son tres manchas de `radial-gradient` con los colores de marca. Se mueven
 * sólo con `transform`, que el navegador resuelve en el compositor: no hay
 * `filter: blur()` ni repintado por cuadro, porque el gradiente **ya** nace
 * difuminado. Eso importa — la laptop de la sede también está corriendo el
 * cronómetro, las calificaciones y Chart.js al mismo tiempo.
 *
 * Los tres ciclos duran distinto y son primos entre sí (37 s, 43 s, 53 s), así
 * que la composición tarda más de diez minutos en repetirse: nunca se ve el
 * bucle.
 */
withDefaults(defineProps<{
  /** Sube la intensidad sobre fondos oscuros, donde la mancha se pierde. */
  inverso?: boolean
}>(), {
  inverso: false,
})
</script>

<template>
  <div class="figuras" :class="{ 'figuras--inverso': inverso }" aria-hidden="true">
    <span class="figuras__mancha figuras__mancha--a" />
    <span class="figuras__mancha figuras__mancha--b" />
    <span class="figuras__mancha figuras__mancha--c" />
  </div>
</template>

<style scoped>
.figuras {
  position: absolute;
  inset: 0;
  overflow: hidden;
  pointer-events: none;
}

.figuras__mancha {
  position: absolute;
  border-radius: 50%;
  will-change: transform;
}

/* Azul de marca, arriba a la derecha: es la zona que casi ninguna lámina usa. */
.figuras__mancha--a {
  top: -22%;
  right: -14%;
  width: 46vw;
  height: 46vw;
  background: radial-gradient(circle at 50% 50%, rgb(0 65 101 / 15%) 0%, rgb(0 65 101 / 6%) 42%, transparent 68%);
  animation: figura-deriva-a 37s ease-in-out infinite alternate;
}

/* Guinda, abajo a la izquierda. */
.figuras__mancha--b {
  bottom: -26%;
  left: -16%;
  width: 42vw;
  height: 42vw;
  background: radial-gradient(circle at 50% 50%, rgb(119 36 50 / 13%) 0%, rgb(119 36 50 / 5%) 44%, transparent 70%);
  animation: figura-deriva-b 43s ease-in-out infinite alternate;
}

/* Dorado, centro bajo. La más tenue de las tres: sólo calienta el fondo. */
.figuras__mancha--c {
  bottom: -34%;
  left: 38%;
  width: 34vw;
  height: 34vw;
  background: radial-gradient(circle at 50% 50%, rgb(242 223 116 / 20%) 0%, rgb(242 223 116 / 7%) 46%, transparent 72%);
  animation: figura-deriva-c 53s ease-in-out infinite alternate;
}

/* Sobre los gradientes de portada y cierre hace falta más cuerpo para que la
   figura se note sin ensuciar el texto blanco. */
.figuras--inverso .figuras__mancha--a {
  background: radial-gradient(circle at 50% 50%, rgb(255 255 255 / 12%) 0%, rgb(255 255 255 / 4%) 44%, transparent 70%);
}

.figuras--inverso .figuras__mancha--b {
  background: radial-gradient(circle at 50% 50%, rgb(242 223 116 / 14%) 0%, rgb(242 223 116 / 5%) 46%, transparent 72%);
}

.figuras--inverso .figuras__mancha--c {
  background: radial-gradient(circle at 50% 50%, rgb(255 255 255 / 9%) 0%, rgb(255 255 255 / 3%) 48%, transparent 74%);
}

@keyframes figura-deriva-a {
  from { transform: translate3d(0, 0, 0) scale(1); }
  to   { transform: translate3d(-7%, 9%, 0) scale(1.14); }
}

@keyframes figura-deriva-b {
  from { transform: translate3d(0, 0, 0) scale(1.08); }
  to   { transform: translate3d(11%, -8%, 0) scale(0.94); }
}

@keyframes figura-deriva-c {
  from { transform: translate3d(0, 0, 0) scale(0.92); }
  to   { transform: translate3d(-13%, -6%, 0) scale(1.2); }
}

@media (prefers-reduced-motion: reduce), print {
  .figuras__mancha { animation: none; }
}
</style>
