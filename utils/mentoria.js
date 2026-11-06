/**
 * Mapa mentor–discípulo del club, tal como está aplicado en la BD de la App
 * al 5 de noviembre de 2026.
 *
 * Fuente: tabla `partners` (`mentorId`, `photoKey`) cruzada con el
 * «Plan de mentorías — octubre 2026» del vault. Solo socios **renovados**:
 * Virginia Hurtado aparece en la BD como discípula de Carlos A. Sánchez pero
 * no renovó, y el plan ya la sacó del programa.
 *
 * `foto: null` significa que el socio **no tiene fotografía en la App**: el
 * nodo cae a iniciales a propósito, para que el hueco se vea. Al 5 de
 * noviembre solo le pasa a Oscar Rangel, que es mentor externo y no tiene
 * perfil en la App; los cuatro socios que faltaban subieron la suya ese día.
 */

export const SOCIOS = {
  victor: { nombre: 'Víctor Santos', foto: '/victor-santos.jpg', nota: 'VPE' },
  samuel: { nombre: 'Samuel Pérez', foto: '/samuel-perez.jpg', nota: 'Presidente' },
  oscar: { nombre: 'Oscar Rangel', foto: null, nota: 'Externo · CG ITLA' },
  carlosS: { nombre: 'Carlos A. Sánchez', foto: '/carlos-sanchez.jpg' },
  edgar: { nombre: 'Edgar Uribe', foto: '/edgar-uribe.jpg' },
  // `partners.office` tiene 'VPM' en Carolina y 'VP de membresías' en Daniela:
  // dos personas con el mismo cargo. El «Plan de mentorías — octubre 2026» y
  // las notas de la sesión 468 dan la VPM a Daniela, así que es la que se
  // rotula. Hay que corregir el campo en la App.
  carolina: { nombre: 'Carolina Valero', foto: '/carolina-valero.jpg', trato: 'Mentora' },
  gabiA: { nombre: 'Gabriela Alquicirez', foto: '/gabriela-alquicirez.jpg', nota: 'SAA' },
  daniela: { nombre: 'Daniela Vega', foto: '/daniela-vega.jpg', nota: 'VPM', trato: 'Mentora' },
  uriel: { nombre: 'Uriel Flores', foto: '/uriel-flores.jpg', nota: 'VPPR' },
  gabiM: { nombre: 'Gabriela Meneses', foto: '/gabriela-meneses.jpg', trato: 'Mentora' },

  fatima: { nombre: 'Fátima Vital', foto: '/fatima-vital.jpg' },
  hugo: { nombre: 'Hugo Osorio', foto: '/hugo-osorio.jpeg' },
  wendolyn: { nombre: 'Wendolyn García', foto: '/wendolyn-garcia.png', nota: 'Tesorera' },
  bolivar: { nombre: 'Bolívar Pedroza', foto: '/bolivar-pedroza.jpg', nota: 'Ingresó 18-oct' },
  elizabeth: { nombre: 'Elizabeth Esquivel', foto: '/elizabeth-esquivel.jpg' },
  janet: { nombre: 'Janet Tolentino', foto: '/janet-tolentino.jpg' },
  karla: { nombre: 'Karla Rodríguez', foto: '/karla-rodriguez.jpg', nota: 'Secretaria' },
  alberto: { nombre: 'Alberto Téllez', foto: '/alberto-tellez.jpg' },
  patricio: { nombre: 'Patricio Straffon', foto: '/patricio-straffon.jpg' },
  landaverde: { nombre: 'Carlos E. Landaverde', foto: '/carlos-landaverde.jpg' },
  aaron: { nombre: 'Aarón Hernández', foto: '/aaron-hernandez.jpg' },
  peel: { nombre: 'Peel Desmornes', foto: '/peel-desmornes.jpg' },
  marco: { nombre: 'Marco A. Chávez', foto: '/marco-chavez.png' },
  juanPablo: { nombre: 'Juan Pablo Vega', foto: '/juan-pablo-vega.jpg', nota: 'Ingresó 3-nov' },
  jorge: { nombre: 'Jorge Cuevas', foto: '/jorge-cuevas.jpeg' },
}

/** Un cluster por mentor, en orden de carga. */
export const CLUSTERS = [
  { mentor: 'victor', discipulos: ['carolina', 'fatima', 'gabiA', 'hugo', 'uriel', 'wendolyn'] },
  { mentor: 'samuel', discipulos: ['bolivar', 'elizabeth', 'janet', 'karla'] },
  { mentor: 'carlosS', discipulos: ['alberto', 'edgar', 'patricio'] },
  { mentor: 'oscar', discipulos: ['daniela', 'samuel', 'victor'] },
  { mentor: 'carolina', discipulos: ['landaverde', 'gabiM'] },
  { mentor: 'gabiA', discipulos: ['aaron', 'peel'] },
  { mentor: 'gabiM', discipulos: ['juanPablo'] },
  { mentor: 'daniela', discipulos: ['marco'] },
  { mentor: 'uriel', discipulos: ['jorge'] },
  { mentor: 'edgar', discipulos: ['carlosS'] },
]

/**
 * Antepone el `base` del sitio a la ruta de la foto.
 *
 * Las fotos de los grafos llegan a `<img>` como string de datos, no como
 * literal en la plantilla, así que **Vite no las reescribe en el build**: en
 * GitHub Pages, servido bajo `/toastmasters-sesion-472/`, `/victor-santos.jpg`
 * se iba a la raíz del dominio y las veinte caras salían rotas. En `npm run
 * dev` no se nota, porque ahí el base es `/`.
 */
function conBase(foto) {
  if (!foto) return null
  const base = import.meta.env?.BASE_URL ?? '/'
  return `${base.replace(/\/$/, '')}/${foto.replace(/^\//, '')}`
}

/** Resuelve una clave o un cluster a objetos listos para `<Grafo>`. */
export function socio(clave) {
  const s = SOCIOS[clave]
  if (!s) throw new Error(`Socio desconocido en el mapa de mentoría: ${clave}`)
  return { ...s, foto: conBase(s.foto) }
}

export function cluster(claveMentor) {
  const c = CLUSTERS.find((x) => x.mentor === claveMentor)
  if (!c) throw new Error(`No hay cluster para el mentor: ${claveMentor}`)
  return { mentor: socio(c.mentor), discipulos: c.discipulos.map(socio) }
}

export const CLUSTERS_RESUELTOS = CLUSTERS.map((c) => cluster(c.mentor))
