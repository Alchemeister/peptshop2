import { readdirSync, readFileSync, statSync } from 'node:fs'
import { join, relative, resolve } from 'node:path'

const root = resolve(import.meta.dirname, '..')
const sourceRoot = join(root, 'src')
const bannedPatterns = [
  ['Supabase client', /@supabase\//i],
  ['database call', /\.from\s*\(/],
  ['network fetch', /\bfetch\s*\(/],
  ['Axios client', /\baxios\b/i],
  ['Next.js import', /from\s+['"]next\//],
  ['private path alias', /from\s+['"]@\//],
  ['environment read', /(?:process|import\.meta)\.env/],
  ['secret marker', /sb_(?:secret|service_role)|SUPABASE_DB_PASSWORD|SERVICE_ROLE_KEY/i],
]

const excludedLinkPatterns = [
  /href=[{]?['"]\/group-testing(?:\/|['"])/,
  /href=[{]?['"]\/rfq(?:\/|['"])/,
  /href=[{]?['"]\/pools(?:\/|['"])/,
]

const files = []
const walk = (directory) => {
  for (const name of readdirSync(directory)) {
    const path = join(directory, name)
    if (statSync(path).isDirectory()) walk(path)
    else if (/\.(?:ts|tsx|css)$/.test(name)) files.push(path)
  }
}
walk(sourceRoot)

const errors = []
for (const path of files) {
  const source = readFileSync(path, 'utf8')
  for (const [label, pattern] of bannedPatterns) {
    if (pattern.test(source)) errors.push(`${relative(root, path)}: ${label}`)
  }
  if (!path.endsWith('route-manifest.ts')) {
    for (const pattern of excludedLinkPatterns) {
      if (pattern.test(source)) errors.push(`${relative(root, path)}: excluded route link`)
    }
  }
}

const homeSource = readFileSync(join(sourceRoot, 'pages', 'home-page.tsx'), 'utf8')
const preservedHomepageMarkers = [
  'Browse research compounds from vetted suppliers.',
  'Browse Catalog',
  'How PeptShop Works',
  'Popular',
  'In stock and ready to ship.',
  'Featured Suppliers',
]
const retiredHomepageRedesignMarkers = [
  'Research buying,',
  'Independent marketplace',
  'Open catalog',
  'A COA should answer questions',
]

for (const marker of preservedHomepageMarkers) {
  if (!homeSource.includes(marker))
    errors.push(`src/pages/home-page.tsx: missing preserved homepage marker: ${marker}`)
}
for (const marker of retiredHomepageRedesignMarkers) {
  if (homeSource.includes(marker))
    errors.push(`src/pages/home-page.tsx: retired homepage redesign marker: ${marker}`)
}

if (errors.length > 0) {
  console.error('Frontend boundary check failed:')
  for (const error of errors) console.error(`- ${error}`)
  process.exit(1)
}

console.log(`Frontend boundary check passed across ${files.length} source files.`)
