# Sesión 472 — Mentoría, reconocimientos y toma de protesta

Deck de Slidev para la sesión del **jueves 5 de noviembre de 2026** del club Toastmasters Pachuca Voces con Poder. Cuatro bloques dentro de una sesión ordinaria: cierre de inscripciones del concurso, presentación del programa de mentoría, reconocimiento del socio de octubre y toma de protesta de los dos socios nuevos.

Usa [`slidev-theme-toastmasters-pachuca`](../slidev-theme-toastmasters-pachuca), igual que el deck de Momentos de la Verdad del 8 de octubre.

```bash
npm install
npm run dev        # vista del presentador en /presenter — las notas son el guión
npm run export     # PDF
```

## El mapa de mentoría

`utils/mentoria.js` es la única fuente del mapa: socios, fotos y la lista de parejas mentor–discípulo. Sale de la tabla `partners` de la App (`mentorId`, `photoKey`) cruzada con el *Plan de mentorías — octubre 2026* del vault, y **solo incluye socios renovados**.

Cuando cambie una mentoría, se edita ese archivo y las seis láminas del bloque se rearman solas: `<ClusterMentor mentor="clave" />` dibuja el grafo de un mentor y `<MapaMentoria :claves="[...]" />` la rejilla del club.

`foto: null` no es un error: cae a un disco con las iniciales, y el hueco se deja ver a propósito. El 5 de noviembre, antes de la sesión, subieron la suya los cuatro que faltaban —Juan Pablo, Gabriela Meneses, Elizabeth y Peel—, así que **las veinticuatro parejas del mapa salen con cara**. El único `null` que queda es Oscar Rangel, que es mentor externo y no tiene perfil en la App.

### Las fotos

No están versionadas más que como archivos sueltos en `public/`. Se bajaron del bucket de la App con las credenciales de `toastmasters-backend/.env`, resolviendo cada `photoKey` contra `BUCKET_NAME`. Para refrescarlas hay que repetir ese paso: la App es la fuente, no este repo.

### Dos relaciones que el mapa no dibuja

- **Oscar Rangel** es mentor externo (Club Guadalajara ITLA) y sus discípulos son a su vez mentores. No tiene lámina: va en las notas del mapa, de viva voz.
- **Carlos A. Sánchez y Edgar Uribe** están en mentoría mutua. Dibujarlos en la rejilla duplicaría caras, así que van juntos en su lámina.

El dato sigue en `utils/mentoria.js` —`CLUSTERS` trae las diez relaciones, incluidas esas dos— y `cluster('oscar')` devuelve su grafo si alguna vez se quiere volver a proyectar.

## Geometría de los grafos

`utils/grafo.js` tiene las medidas por escala. El grafo calcula su caja a partir de lo que de verdad dibuja —retratos y etiquetas—, no del diámetro teórico, para que una mentoría de un solo discípulo no reserve el espacio de un anillo completo.

Dos reglas que no son obvias y que conviene no deshacer:

- **Número par de discípulos**: se gira medio paso para que ninguno caiga justo debajo del mentor, encima de su nombre. **Dos discípulos son la excepción**: van en vertical, porque en horizontal la caja queda de 112 px de alto.
- **La animación de entrada de los nodos lleva el `translate(-50%, -50%)` dentro de los fotogramas.** Una animación con `fill-mode: both` fija el `transform` de su último fotograma: reusar `tm-asoma` borraría el centrado y correría todas las caras media foto abajo y a la derecha.

## Datos que hay que revisar antes de proyectar

Están en las notas del presentador, lámina por lámina. Los dos que bloquean:

1. **Cuántas personas hay inscritas al concurso** (lámina 3). Está en la hoja de respuestas del formulario, no en la BD.
2. **Quién llegó a la sesión** (lámina 18). Juan Pablo y su mentora reportaron `NO_DISPONIBLE`; si no están, su toma de protesta se mueve a la 473.
