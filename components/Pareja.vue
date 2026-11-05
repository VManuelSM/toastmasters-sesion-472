<script setup>
/**
 * Socio nuevo y su mentor, con el vínculo escrito en medio.
 *
 * Misma figura que la bienvenida formal de la sesión 468, pero con el hueco de
 * fotografía resuelto: Juan Pablo todavía no tiene foto en la App y la versión
 * con `<img>` dejaba un marco roto en la lámina de su toma de protesta.
 */
const props = defineProps({
  socio: { type: Object, required: true },
  mentor: { type: Object, required: true },
  /** Palabra sobre la línea que une a los dos. */
  nexo: { type: String, default: 'mentor' },
  /**
   * Dos parejas en una lámina: retratos más chicos y el nombre del socio
   * nuevo bajo su foto, porque el encabezado ya no puede rotular a uno solo.
   */
  compacta: { type: Boolean, default: false },
})

function iniciales(nombre) {
  return nombre
    .split(/\s+/)
    .filter((p) => p.length > 2)
    .slice(0, 2)
    .map((p) => p[0])
    .join('')
    .toUpperCase()
}
</script>

<template>
  <div class="pareja" :class="{ 'pareja--compacta': compacta }">
    <figure class="pareja__item">
      <img v-if="socio.foto" :src="socio.foto" :alt="socio.nombre" class="pareja__foto pareja__foto--grande">
      <span v-else class="pareja__foto pareja__foto--grande pareja__foto--vacia">{{ iniciales(socio.nombre) }}</span>
      <figcaption v-if="compacta">
        {{ socio.nombre }}
        <span>Socio nuevo</span>
      </figcaption>
    </figure>

    <span class="pareja__nexo">{{ nexo }}</span>

    <figure class="pareja__item">
      <img v-if="mentor.foto" :src="mentor.foto" :alt="mentor.nombre" class="pareja__foto">
      <span v-else class="pareja__foto pareja__foto--vacia">{{ iniciales(mentor.nombre) }}</span>
      <figcaption>{{ mentor.nombre }}</figcaption>
    </figure>
  </div>
</template>

<style scoped>
.pareja {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--space-6);
  margin-top: var(--space-4);
}

.pareja__item { text-align: center; margin: 0; }

.pareja__foto {
  width: 11rem;
  height: 11rem;
  border-radius: 50%;
  object-fit: cover;
  object-position: center 25%;
  border: 4px solid var(--brand-accent);
  box-shadow: 0 10px 30px rgb(0 0 0 / 18%);
}

.pareja__foto--grande { width: 13rem; height: 13rem; }

/*
 * Sin fotografía en la App. Aquí las iniciales van en claro y no en vino
 * sólido como en el mapa de mentoría: en el mapa el disco marca un hueco
 * entre veinte caras, pero en la lámina de la toma de protesta ocuparía media
 * pantalla y la ceremonia se vería como un error de carga.
 */
.pareja__foto--vacia {
  display: grid;
  place-items: center;
  background: var(--surface-app);
  color: var(--brand-secondary);
  font-family: var(--font-main);
  font-weight: var(--font-weight-bold);
  font-size: 3.2rem;
  border-style: dashed;
}

.pareja__item figcaption {
  margin-top: var(--space-3);
  font-weight: var(--font-weight-semibold);
  color: var(--brand-primary);
}

.pareja__item figcaption span {
  display: block;
  font-size: 0.75rem;
  font-weight: var(--font-weight-medium);
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--text-secondary);
}

/* El nexo es una línea con la palabra encima: lee como un enlace y no como
   una etiqueta suelta entre dos fotos. */
.pareja__nexo {
  position: relative;
  align-self: center;
  margin-bottom: 2.5rem;
  padding: 0 var(--space-3);
  font-size: 0.7rem;
  font-weight: var(--font-weight-semibold);
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: var(--brand-secondary);
}

.pareja__nexo::before,
.pareja__nexo::after {
  content: "";
  position: absolute;
  top: 50%;
  width: var(--space-5);
  height: 2px;
  background: var(--brand-accent);
}

.pareja__nexo::before { right: 100%; }
.pareja__nexo::after { left: 100%; }

/* Dos parejas en una lámina. Todo baja de escala menos la tipografía del
   nombre, que es lo que se lee desde la última fila. */
.pareja--compacta { gap: var(--space-4); }

.pareja--compacta .pareja__foto { width: 7.4rem; height: 7.4rem; border-width: 3px; }
.pareja--compacta .pareja__foto--grande { width: 9rem; height: 9rem; }
.pareja--compacta .pareja__foto--vacia { font-size: 2.2rem; }

.pareja--compacta .pareja__item figcaption { margin-top: var(--space-2); }

.pareja--compacta .pareja__nexo {
  margin-bottom: 2.2rem;
  padding: 0 var(--space-2);
  font-size: 0.62rem;
  letter-spacing: 0.1em;
}

.pareja--compacta .pareja__nexo::before,
.pareja--compacta .pareja__nexo::after { width: var(--space-3); }

@media (prefers-reduced-motion: no-preference) {
  .slidev-page .pareja__item { animation: tm-asoma 640ms var(--transition-easing-out) both; }
  .slidev-page .pareja__item:nth-child(1) { animation-delay: 380ms; }
  .slidev-page .pareja__item:nth-child(3) { animation-delay: 540ms; }
  .slidev-page .pareja__nexo { animation: tm-sube 620ms var(--transition-easing-out) 700ms both; }
}
</style>
