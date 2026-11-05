<script setup>
import { computed } from 'vue'

/**
 * Grafo radial de una pareja mentor–discípulos: el mentor al centro, sus
 * discípulos alrededor y una arista hacia cada uno.
 *
 * Es un layout polar calculado, no una imagen: el mapa de mentoría cambia cada
 * vez que entra un socio, y así basta editar `utils/mentoria.js` para que la
 * lámina se rearme sola. Las aristas van en un `<svg>` del tamaño exacto de la
 * caja, debajo de los nodos, porque dibujar líneas entre `<div>`s posicionados
 * con CSS obliga a rotaciones que deforman el texto.
 */
import { medidas, ALTO_PIE } from '../utils/grafo.js'

const props = defineProps({
  /** Mentor: `{ nombre, foto, nota }`. `foto: null` cae a iniciales. */
  mentor: { type: Object, required: true },
  /** Discípulos, mismo formato. */
  discipulos: { type: Array, default: () => [] },
  /** `normal` para una lámina completa, `media` para dos o tres por lámina, `mini` para el mapa del club. */
  escala: { type: String, default: 'normal' },
  /** Ángulo del primer discípulo, en grados. −90 = arriba. */
  arranque: { type: Number, default: -90 },
  /** Fuerza las etiquetas de los discípulos (el mapa del club las apaga). */
  etiquetas: { type: Boolean, default: null },
  /** Ancla vertical del mentor, para alinear varios grafos en rejilla. */
  anclaY: { type: Number, default: null },
  /** Alto fijo de la caja, por la misma razón que `anclaY`. */
  altoFijo: { type: Number, default: null },
})

const m = computed(() => medidas(props.escala, props.discipulos.length))

const conEtiquetas = computed(() => props.etiquetas ?? m.value.etiquetas)

/**
 * En `mini` el nombre del mentor va al pie de la caja. Bajo su foto chocaría
 * con el discípulo de abajo, que en una caja de 160 px queda a 60 px.
 */
const pieMentor = computed(() => props.escala === 'mini')

/** Ancho de la etiqueta bajo cada nodo. */
const anchoEtiqueta = computed(() => (conEtiquetas.value ? 112 : 0))

/** Alto de la etiqueta de dos renglones —nombre y cargo— bajo cada nodo. */
const altoEtiqueta = computed(() => (conEtiquetas.value ? 32 : 0))

/** Posiciones relativas al mentor, antes de conocer el tamaño de la caja. */
const relativos = computed(() => {
  const n = props.discipulos.length
  if (!n) return []
  const paso = 360 / n
  // Con un número par de discípulos, arrancar en −90° deja uno exactamente
  // abajo, encima del nombre del mentor. Medio paso de giro libera el eje.
  //
  // Dos discípulos son la excepción: medio paso los pone en línea horizontal
  // y la caja queda de 112 px de alto, un listón de caras pegado al título.
  // En vertical —uno arriba y otro abajo— el nombre del mentor cabe entre su
  // foto y el nodo de abajo, y el grafo ocupa la lámina.
  const arranque = props.arranque + (n % 2 === 0 && n !== 2 ? paso / 2 : 0)
  return props.discipulos.map((d, i) => {
    const rad = ((arranque + i * paso) * Math.PI) / 180
    return {
      ...d,
      dx: m.value.radio * Math.cos(rad),
      dy: m.value.radio * Math.sin(rad),
      orden: i,
    }
  })
})

/**
 * Caja ajustada al contenido real, no al diámetro teórico.
 *
 * Sin esto, una mentoría de un solo discípulo reserva abajo el espacio de un
 * anillo completo y el nombre del mentor queda flotando a cincuenta píxeles
 * de su foto. Se mide la extensión de lo que de verdad se dibuja —retratos y
 * etiquetas— y de ahí salen el tamaño de la caja y el centro.
 */
const caja = computed(() => {
  const mitadMentor = m.value.mentor / 2
  const mitadDisc = m.value.discipulo / 2
  const mitadTexto = Math.max(anchoEtiqueta.value / 2, mitadDisc)

  const xs = [[-mitadMentor, mitadMentor]]
  const ys = [[-mitadMentor, mitadMentor + (pieMentor.value ? 0 : altoEtiqueta.value)]]

  for (const nodo of relativos.value) {
    xs.push([nodo.dx - mitadTexto, nodo.dx + mitadTexto])
    ys.push([nodo.dy - mitadDisc, nodo.dy + mitadDisc + altoEtiqueta.value])
  }

  const minX = Math.min(...xs.map((p) => p[0]))
  const maxX = Math.max(...xs.map((p) => p[1]))
  const minY = Math.min(...ys.map((p) => p[0]))
  const maxY = Math.max(...ys.map((p) => p[1]))

  return {
    ancho: maxX - minX,
    alto: props.altoFijo ?? maxY - minY + (pieMentor.value ? ALTO_PIE : 0),
    cx: -minX,
    cy: props.anclaY ?? -minY,
  }
})

const ancho = computed(() => caja.value.ancho)
const alto = computed(() => caja.value.alto)
const centro = computed(() => ({ x: caja.value.cx, y: caja.value.cy }))

/**
 * El nombre al pie se posiciona dentro del nodo del mentor —que es quien lo
 * lleva— pero tiene que caer al fondo de la caja. Se calcula en píxeles
 * contra el centro del nodo en vez de sacarlo a un hermano del grafo, que
 * rompería el escalonado de la animación.
 */
const estiloPie = computed(() => ({
  top: alto.value - ALTO_PIE - (centro.value.y - m.value.mentor / 2),
  ancho: Math.max(ancho.value, 104),
}))

const nodos = computed(() =>
  relativos.value.map((nodo) => ({
    ...nodo,
    x: centro.value.x + nodo.dx,
    y: centro.value.y + nodo.dy,
  })),
)

/** Iniciales para quien no tiene fotografía en la App. */
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
  <figure
    class="grafo"
    :class="`grafo--${escala}`"
    :style="{ width: `${ancho}px`, height: `${alto}px` }"
  >
    <svg class="grafo__aristas" :viewBox="`0 0 ${ancho} ${alto}`" aria-hidden="true">
      <line
        v-for="nodo in nodos"
        :key="`arista-${nodo.nombre}`"
        :x1="centro.x"
        :y1="centro.y"
        :x2="nodo.x"
        :y2="nodo.y"
      />
    </svg>

    <figure
      class="grafo__nodo grafo__nodo--mentor"
      :style="{ left: `${centro.x}px`, top: `${centro.y}px`, '--lado': `${m.mentor}px` }"
    >
      <img v-if="mentor.foto" :src="mentor.foto" :alt="mentor.nombre" class="grafo__foto">
      <span v-else class="grafo__foto grafo__foto--vacia">{{ iniciales(mentor.nombre) }}</span>
      <figcaption
        class="grafo__texto"
        :class="{ 'grafo__texto--pie': pieMentor }"
        :style="pieMentor ? { top: `${estiloPie.top}px`, width: `${estiloPie.ancho}px` } : null"
      >
        {{ mentor.nombre }}
        <span>{{ mentor.nota ?? mentor.trato ?? 'Mentor' }}</span>
      </figcaption>
    </figure>

    <figure
      v-for="nodo in nodos"
      :key="nodo.nombre"
      class="grafo__nodo"
      :style="{
        left: `${nodo.x}px`,
        top: `${nodo.y}px`,
        '--lado': `${m.discipulo}px`,
        '--retardo': `${260 + nodo.orden * 110}ms`,
      }"
    >
      <img v-if="nodo.foto" :src="nodo.foto" :alt="nodo.nombre" class="grafo__foto">
      <span v-else class="grafo__foto grafo__foto--vacia">{{ iniciales(nodo.nombre) }}</span>
      <figcaption v-if="conEtiquetas" class="grafo__texto grafo__texto--discipulo">
        {{ nodo.nombre }}
        <span v-if="nodo.nota">{{ nodo.nota }}</span>
      </figcaption>
    </figure>
  </figure>
</template>

<style scoped>
.grafo {
  position: relative;
  margin: 0 auto;
  flex: 0 0 auto;
}

.grafo__aristas {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
}

.grafo__aristas line {
  stroke: var(--brand-accent);
  stroke-width: 2;
  opacity: 0.6;
}

.grafo--mini .grafo__aristas line { stroke-width: 1.5; }

/* El nodo se centra en su coordenada: así la arista llega al centro del
   retrato y no a su esquina. */
.grafo__nodo {
  position: absolute;
  margin: 0;
  width: var(--lado);
  transform: translate(-50%, -50%);
  text-align: center;
}

.grafo__foto {
  display: block;
  width: var(--lado);
  height: var(--lado);
  border-radius: 50%;
  object-fit: cover;
  object-position: center 25%;
  border: 3px solid var(--surface-card);
  background: var(--surface-card);
  box-shadow: 0 6px 18px rgb(0 0 0 / 16%);
}

.grafo--mini .grafo__foto { border-width: 2px; }

.grafo__nodo--mentor .grafo__foto {
  border-color: var(--brand-accent);
  box-shadow: 0 10px 26px rgb(0 0 0 / 22%);
}

/* Sin fotografía en la App: iniciales sobre el vino de marca. No es un
   placeholder gris para que el hueco se note desde la última fila. */
.grafo__foto--vacia {
  display: grid;
  place-items: center;
  background: var(--brand-secondary);
  color: var(--text-inverse);
  font-family: var(--font-main);
  font-weight: var(--font-weight-bold);
  font-size: calc(var(--lado) * 0.34);
  letter-spacing: 0.02em;
  border-style: dashed;
  border-color: var(--brand-accent);
}

.grafo__texto {
  position: absolute;
  left: 50%;
  top: calc(var(--lado) + 6px);
  width: 112px;
  transform: translateX(-50%);
  font-family: var(--font-body);
  font-size: 0.62rem;
  font-weight: var(--font-weight-semibold);
  line-height: 1.2;
  color: var(--brand-primary);
}

.grafo__texto span {
  display: block;
  font-size: 0.52rem;
  font-weight: var(--font-weight-medium);
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: var(--text-secondary);
}

.grafo--media .grafo__texto { font-size: 0.56rem; width: 104px; }
.grafo--media .grafo__texto span { font-size: 0.46rem; }

.grafo--chica .grafo__texto { font-size: 0.52rem; width: 100px; }
.grafo--chica .grafo__texto span { font-size: 0.44rem; }

.grafo--mini .grafo__texto {
  width: 96px;
  font-size: 0.54rem;
  top: calc(var(--lado) + 4px);
}

.grafo--mini .grafo__texto span { display: none; }

@media (prefers-reduced-motion: no-preference) {
  /*
   * El nodo ya usa `transform` para centrarse en su coordenada, así que no
   * puede reusar `tm-asoma`: una animación con `fill-mode: both` deja fijo el
   * `transform` de su último fotograma y borraría el centrado, corriendo
   * todas las caras media foto abajo y a la derecha. Por eso la entrada
   * lleva el `translate(-50%, -50%)` dentro de los fotogramas.
   */
  @keyframes grafo-asoma {
    from { opacity: 0; transform: translate(-50%, calc(-50% + 18px)) scale(0.965); }
    to   { opacity: 1; transform: translate(-50%, -50%)              scale(1); }
  }

  .slidev-page .grafo__nodo {
    animation: grafo-asoma 620ms var(--transition-easing-out) both;
    animation-delay: var(--retardo, 120ms);
  }

  .slidev-page .grafo__aristas line {
    animation: grafo-arista 520ms var(--transition-easing-out) 200ms both;
  }

  @keyframes grafo-arista {
    from { opacity: 0; }
    to { opacity: 0.6; }
  }
}
</style>
