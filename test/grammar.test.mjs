import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { createRequire } from 'node:module';
import { test } from 'node:test';
import { createHighlighterCore } from 'shiki/core';
import { createJavaScriptRegexEngine } from 'shiki/engine/javascript';
import { createOnigurumaEngine } from 'shiki/engine/oniguruma';
import dark from 'shiki/themes/github-dark.mjs';
import light from 'shiki/themes/github-light.mjs';
import grammar from 'shiki-env-spec';

const require = createRequire(import.meta.url);
const sample = await readFile(new URL('../examples/env-spec.sample', import.meta.url), 'utf8');
const scopes = line => line.flatMap(token => token.explanation?.flatMap(part => part.scopes.map(scope => scope.scopeName)) ?? []);

for (const [engineName, createEngine] of [
  ['oniguruma', () => createOnigurumaEngine(import('shiki/wasm'))],
  ['javascript', () => createJavaScriptRegexEngine()],
]) {
  for (const theme of [dark, light]) {
    test(`${engineName}: ${theme.name} highlights schema syntax and both language names`, async () => {
      const highlighter = await createHighlighterCore({ langs: [grammar], themes: [theme], engine: createEngine() });
      try {
        const options = { lang: 'env-spec', theme: theme.name, includeExplanation: 'scopeName' };
        const tokens = highlighter.codeToTokensBase(sample, options);
        assert.deepEqual(tokens.map(line => line.map(token => token.content).join('')), sample.split('\n'));
        assert.deepEqual(highlighter.codeToTokensBase(sample, { ...options, lang: 'varlock' }), tokens);
        const code = [
          '# This @required is just prose',
          '# @required @type=string(startsWith=pk-)',
          'TOKEN=op("op://${VAULT}/service/key")',
          "LITERAL='$VAULT'",
          'COUNT=123',
          'MULTILINE="""',
          'hello $VAULT',
          '"""',
          'AFTER=42',
        ].join('\n');
        const result = highlighter.codeToTokensBase(code, options);
        assert.ok(!scopes(result[0]).includes('variable.annotation.env-spec'));
        assert.ok(scopes(result[1]).includes('variable.annotation.env-spec'));
        assert.ok(scopes(result[2]).includes('punctuation.section.interpolation.env-spec'));
        assert.ok(!scopes(result[3]).includes('punctuation.section.interpolation.env-spec'));
        assert.ok(scopes(result[4]).includes('constant.numeric.env-spec'));
        assert.ok(scopes(result[8]).includes('constant.numeric.env-spec'));
      } finally {
        highlighter.dispose();
      }
    });
  }
}

test('CommonJS and ESM consumers receive the same grammar', () => {
  assert.deepEqual(require('shiki-env-spec'), grammar);
});

test('the vendored grammar matches the recorded upstream checksum', async () => {
  const source = JSON.parse(await readFile(new URL('../grammar-source.json', import.meta.url), 'utf8'));
  const raw = await readFile(new URL('../env-spec.tmLanguage.json', import.meta.url));
  assert.equal(createHash('sha256').update(raw).digest('hex'), source.sha256);
});
