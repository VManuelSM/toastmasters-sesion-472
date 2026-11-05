/**
 * Medidas de los grafos de mentoría.
 *
 * Viven fuera de `Grafo.vue` porque el mapa del club necesita las mismas
 * cifras para alinear los ocho grafos: sin un ancla común, cada caja se
 * centra en su celda y los mentores quedan a distinta altura, que es lo que
 * hace que una rejilla de grafos se lea como un error de maquetación.
 */

export const MEDIDAS = {
  normal: { radio: 126, mentor: 96, discipulo: 72, etiquetas: true },
  media: { radio: 96, mentor: 72, discipulo: 56, etiquetas: true },
  chica: { radio: 78, mentor: 60, discipulo: 46, etiquetas: true },
  mini: { radio: 62, mentor: 50, discipulo: 34, etiquetas: false },
}

/** Alto del nombre del mentor cuando va al pie de la caja, no bajo su foto. */
export const ALTO_PIE = 22

/**
 * En el mapa del club el radio se encoge con el número de discípulos: una
 * pareja de una sola persona dentro de una caja de seis deja un hueco que
 * lee como error de maquetación.
 */
export function radioMini(n) {
  if (n <= 1) return 44
  if (n === 2) return 52
  return MEDIDAS.mini.radio
}

/** Medidas finales de un grafo, ya resuelto el radio variable de `mini`. */
export function medidas(escala, n) {
  const base = MEDIDAS[escala] ?? MEDIDAS.normal
  if (escala !== 'mini') return base
  return { ...base, radio: radioMini(n) }
}

/**
 * Ancla vertical común para una rejilla de grafos `mini`: la distancia del
 * borde superior de la caja al centro del mentor, tomada del grafo más alto.
 */
export function anclaMini(cuentas) {
  const mitad = MEDIDAS.mini.discipulo / 2
  return Math.max(...cuentas.map((n) => radioMini(n) + mitad))
}
