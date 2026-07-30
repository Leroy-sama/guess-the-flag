/**
 * ponytail: runnable check for pool + quiz eligibility filtering.
 * Run: npx nuxi prepare && node --experimental-strip-types app/composables/useCountryPool.check.ts
 * (or import the helpers in a one-off script — below is plain JS against the JSON)
 */
import { readFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import assert from 'node:assert/strict'

const dir = dirname(fileURLToPath(import.meta.url))
const countries = JSON.parse(
  readFileSync(join(dir, '../assets/data/countries.json'), 'utf8'),
)

const CONTINENTS = ['Africa', 'Americas', 'Asia', 'Europe', 'Oceania']

function eligible(c, quiz) {
  if (quiz === 'capital') return Boolean(c.capital?.trim())
  if (quiz === 'language') return (c.languages?.length ?? 0) > 0
  return Boolean(c.flags?.svg)
}

function pool(regions, quiz) {
  let list = countries.filter(c => eligible(c, quiz))
  if (regions.length) list = list.filter(c => regions.includes(c.region))
  return list
}

assert.equal(pool([], 'flag').length, countries.filter(c => c.flags?.svg).length)
assert.ok(pool(['Africa'], 'flag').every(c => c.region === 'Africa'))
assert.ok(pool(['Africa', 'Europe'], 'flag').every(c => c.region === 'Africa' || c.region === 'Europe'))
assert.ok(pool(['Asia'], 'capital').every(c => c.capital?.trim()))
assert.ok(pool(['Europe'], 'language').every(c => c.languages?.length > 0))
assert.ok(pool(['Oceania'], 'flag').length > 0)
assert.ok(CONTINENTS.every(r => pool([r], 'flag').length > 0))

console.log('useCountryPool.check: ok')
