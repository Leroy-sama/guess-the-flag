/**
 * Fetch + transform country data from mledoze/countries into our app shape.
 * Run: pnpm update-countries
 */
import { createHash } from 'node:crypto'
import { readFileSync, writeFileSync, existsSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const SOURCE_URL =
  'https://raw.githubusercontent.com/mledoze/countries/master/countries.json'

const __dirname = dirname(fileURLToPath(import.meta.url))
const OUT_PATH = join(__dirname, '../app/assets/data/countries.json')

function transform(raw) {
  const cca2 = String(raw.cca2 || '').toUpperCase()
  const code = cca2.toLowerCase()

  const languages = Object.entries(raw.languages || {}).map(([iso, name]) => ({
    name: String(name),
    iso639_3: iso,
  }))

  return {
    name: raw.name?.common || raw.name?.official || cca2,
    alpha2Code: cca2,
    region: raw.region || '',
    capital: Array.isArray(raw.capital) && raw.capital.length ? raw.capital[0] : '',
    languages,
    // ponytail: mledoze has no flagcdn URLs — build them from cca2
    flags: {
      svg: code ? `https://flagcdn.com/${code}.svg` : '',
      png: code ? `https://flagcdn.com/w320/${code}.png` : '',
    },
  }
}

function hash(text) {
  return createHash('sha256').update(text).digest('hex')
}

async function main() {
  const res = await fetch(SOURCE_URL)
  if (!res.ok) {
    throw new Error(`Fetch failed: ${res.status} ${res.statusText}`)
  }

  const source = await res.json()
  if (!Array.isArray(source)) {
    throw new Error('Source JSON is not an array')
  }

  const countries = source
    .map(transform)
    .filter(c => c.alpha2Code && c.flags.svg)
    .sort((a, b) => a.name.localeCompare(b.name, 'en'))

  const next = `${JSON.stringify(countries, null, 2)}\n`
  const prev = existsSync(OUT_PATH) ? readFileSync(OUT_PATH, 'utf8') : ''
  const changed = hash(prev) !== hash(next)

  writeFileSync(OUT_PATH, next, 'utf8')

  console.log(`Wrote ${countries.length} countries → ${OUT_PATH}`)
  console.log(changed ? 'Data changed.' : 'No changes.')
  process.exitCode = 0
}

main().catch((err) => {
  console.error(err)
  process.exitCode = 1
})
