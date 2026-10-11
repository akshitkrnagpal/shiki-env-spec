import { readFile, mkdir, writeFile } from 'node:fs/promises';

const root = new URL('../', import.meta.url);
const source = JSON.parse(await readFile(new URL('env-spec.tmLanguage.json', root), 'utf8'));
const grammar = { ...source, name: 'env-spec', displayName: '@env-spec', aliases: ['varlock'] };
const output = new URL('dist/', root);
await mkdir(output, { recursive: true });
const data = JSON.stringify(grammar);
const attribution = '// @env-spec grammar: dmno-dev/varlock (MIT). See VARLOCK-LICENSE.\n';
await Promise.all([
  writeFile(new URL('index.js', output), `${attribution}const grammar = ${data};\nexport default grammar;\n`),
  writeFile(new URL('index.cjs', output), `${attribution}module.exports = ${data};\n`),
  writeFile(new URL('index.d.ts', output), `import type { LanguageRegistration } from '@shikijs/types';\ndeclare const grammar: LanguageRegistration;\nexport default grammar;\n`),
  writeFile(new URL('index.d.cts', output), `import type { LanguageRegistration } from '@shikijs/types';\ndeclare const grammar: LanguageRegistration;\nexport = grammar;\n`),
]);
