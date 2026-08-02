import { readFile } from 'node:fs/promises'

const requiredFiles = [
  'README.md',
  'LICENSE',
  '.github/workflows/ci.yml',
  'docs/PRODUCTION_READINESS.md',
]

const contents = Object.fromEntries(
  await Promise.all(requiredFiles.map(async (path) => [path, await readFile(path, 'utf8')])),
)

const packageJson = JSON.parse(await readFile('package.json', 'utf8'))
const failures = []

if (packageJson.private !== true) failures.push('package.json must remain private=true to prevent accidental npm publication')
if (!contents['LICENSE'].includes('CasJam Media LLC (Builder Methods)')) failures.push('upstream copyright attribution is missing')
if (!contents['README.md'].includes('Created by Brian Casel')) failures.push('upstream creator attribution is missing')
if (!contents['.github/workflows/ci.yml'].includes('npm run check')) failures.push('CI does not enforce the release check')
if (!contents['docs/PRODUCTION_READINESS.md'].includes('NOT VERIFIED')) failures.push('release record must preserve explicit unverified gates')

if (failures.length) {
  console.error(failures.map((failure) => `- ${failure}`).join('\n'))
  process.exit(1)
}

console.log('release contract passed')
