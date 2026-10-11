# shiki-env-spec

[![CI](https://github.com/akshitkrnagpal/shiki-env-spec/actions/workflows/ci.yml/badge.svg)](https://github.com/akshitkrnagpal/shiki-env-spec/actions/workflows/ci.yml)

Syntax highlighting for [Varlock](https://varlock.dev/) `.env.schema` files in
[Shiki](https://shiki.style/), powered by Varlock's
[@env-spec](https://varlock.dev/env-spec/overview/) TextMate grammar.

Highlights schema decorators such as `@required`, `@sensitive`, and `@type`,
resolver functions, variable interpolation, strings, numbers, and multiline values.

## Installation

Install Shiki and the language package from GitHub:

```sh
npm install shiki github:akshitkrnagpal/shiki-env-spec
```

## Usage

Register the grammar when creating your highlighter, then use `env-spec` as the
language ID:

```js
import { createHighlighter } from 'shiki';
import envSpec from 'shiki-env-spec';

const highlighter = await createHighlighter({
  themes: ['github-dark'],
  langs: [envSpec],
});

const schema = `# @required @sensitive
API_KEY=

# @type=number(min=1, max=65535)
PORT=3000`;

const html = highlighter.codeToHtml(schema, {
  lang: 'env-spec',
  theme: 'github-dark',
});

highlighter.dispose();
```

`varlock` is an alias for `env-spec`, so either language ID works.

For an existing highlighter, load the grammar before highlighting:

```js
await highlighter.loadLanguage(envSpec);
```

If your application chooses languages from filenames, map `.env.schema` to
`env-spec`. Shiki's highlighting API takes an explicit language ID.

### CommonJS

```js
const envSpec = require('shiki-env-spec');
```

### Raw TextMate grammar

The original grammar JSON is available through `shiki-env-spec/grammar` for
editor integrations and other TextMate consumers.

## Compatibility

- Tested with Shiki 4, including its Oniguruma and JavaScript regex engines.
- Works with `createHighlighter` and `createHighlighterCore`.
- Includes ESM, CommonJS, and TypeScript declarations.
- Supports Node.js 20+, browsers, and bundlers.

## Issues and contributions

Report package or integration problems in
[this repository's issues](https://github.com/akshitkrnagpal/shiki-env-spec/issues).
The grammar is maintained by
[Varlock](https://github.com/dmno-dev/varlock/blob/main/packages/vscode-plugin/syntaxes/env-spec.tmLanguage.json);
contribute syntax fixes there so other integrations benefit too.

See [CONTRIBUTING.md](./CONTRIBUTING.md) for development and release instructions.

## License

[MIT](./LICENSE). The upstream grammar is MIT licensed by DMNO Inc.; its original
notice is included in [VARLOCK-LICENSE](./VARLOCK-LICENSE).
