import { execFileSync } from 'node:child_process'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

/**
 * Publica `dist/` en la rama `gh-pages` del repositorio.
 *
 * El sitio se construye aquí y no en un runner de GitHub porque el tema es
 * una dependencia local (`file:../slidev-theme-toastmasters-pachuca`) y un
 * workflow no podría resolverlo. `dist/` lleva su propio repositorio —queda
 * ignorado por el de arriba— y de ahí sale un push forzado: el historial del
 * sitio construido no interesa, solo su último estado.
 */

const raiz = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const dist = path.join(raiz, 'dist')

if (!fs.existsSync(path.join(dist, 'index.html')))
  throw new Error('No hay dist/index.html. Corre `npm run build` primero.')

const git = (...args) => execFileSync('git', args, { cwd: dist, stdio: 'inherit' })
const origen = execFileSync('git', ['remote', 'get-url', 'origin'], { cwd: raiz })
  .toString()
  .trim()

if (!fs.existsSync(path.join(dist, '.git'))) git('init', '-q', '-b', 'gh-pages')

git('add', '-A')

// `commit` falla si no cambió nada; eso no es un error de publicación.
try {
  git('commit', '-q', '-m', 'chore: sitio estático de la sesión 472')
} catch {
  console.log('Sin cambios que publicar en el sitio.')
}

git('push', '-q', '-f', origen, 'gh-pages:gh-pages')

console.log('Publicado en https://vmanuelsm.github.io/toastmasters-sesion-472/')
