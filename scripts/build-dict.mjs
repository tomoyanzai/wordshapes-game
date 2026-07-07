// Regenerates src/data/dictionary.ts from the `word-list` dev dependency.
// Run with: node scripts/build-dict.mjs
import { readFileSync, writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const words = readFileSync(join(root, 'node_modules/word-list/words.txt'), 'utf8')
  .split('\n')
  .filter((w) => /^[a-z]{2,9}$/.test(w))

const out = `// GENERATED FILE — do not edit by hand. Rebuild with: node scripts/build-dict.mjs
// ${words.length} English words of 2–9 letters, used to validate guesses.
export const DICTIONARY_RAW: string =
  '${words.join('\\n')}'
`
writeFileSync(join(root, 'src/data/dictionary.ts'), out)
console.log(`wrote src/data/dictionary.ts with ${words.length} words`)
