# shiki-env-spec

Shiki language support for [@env-spec](https://varlock.dev/env-spec/overview/) and
[Varlock](https://varlock.dev/) `.env.schema` files. Highlights decorators, resolver
functions, variable expansion, literals, and multiline values using Varlock's
TextMate grammar.

## Install and use

Before the first npm release, install directly from GitHub:

```sh
npm install shiki github:akshitkrnagpal/shiki-env-spec
```

After publication to npm:

```sh
npm install shiki shiki-env-spec
```

```js
import { createHighlighter } from 'shiki';
import envSpec from 'shiki-env-spec';

const highlighter = await createHighlighter({
  themes: ['github-dark'],
  langs: [envSpec],
});

const html = highlighter.codeToHtml('# @required @sensitive\nAPI_KEY=', {
  lang: 'env-spec', // 'varlock' is an alias
  theme: 'github-dark',
});

highlighter.dispose();
```

For an existing highlighter, call `await highlighter.loadLanguage(envSpec)`.
CommonJS consumers can use `require('shiki-env-spec')`. The grammar also works
with `createHighlighterCore` and either Shiki regex engine. Map `.env.schema`
filenames to `env-spec` in your application; Shiki takes an explicit language ID.

The raw TextMate grammar is exported as `shiki-env-spec/grammar` for editor tooling.
The package has no runtime imports and supports Node 20+, browsers, and bundlers.
Shiki 4 is covered by the test suite.

## Develop

```sh
npm ci
npm test
npm run typecheck
npm pack
```

The build emits ESM, CommonJS, and their TypeScript declarations. CI tests both
regex engines and light/dark themes on Node 20, 22, and 24, and uploads installable
package archives as workflow artifacts.

## Publishing

The `publish.yml` workflow publishes to npm when a GitHub release is published.
The release tag must match `v` plus the version in `package.json`, e.g. `v0.1.0`.

First-time npm setup requires the package owner's npm account:

1. Authenticate locally with `npm login`, then run `npm publish --access public`
   from this checkout to create `shiki-env-spec` on npm. Use an account with
   permission to publish this package name.
2. In the npm package's **Settings → Trusted Publisher**, choose GitHub Actions:
   organization/user `akshitkrnagpal`, repository `shiki-env-spec`, workflow filename
   `publish.yml`, and no environment name. Allow direct `npm publish`.
3. For later releases, update the version and lockfile, push the commit, and publish
   the matching GitHub release. GitHub-hosted Actions authenticate with OIDC; no npm
   token secret is needed. Run the first CI publication within npm's configured
   trusted-publisher activation window.

See [npm's trusted-publishing instructions](https://docs.npmjs.com/trusted-publishers/).
The workflow uses Node 24 and explicitly installs npm 11.13.0 for OIDC support.

## Grammar source and license

The grammar is maintained by [dmno-dev/varlock](https://github.com/dmno-dev/varlock/blob/main/packages/vscode-plugin/syntaxes/env-spec.tmLanguage.json).
`grammar-source.json` records the pinned upstream commit and SHA-256 checksum.
To update it, copy the grammar from a reviewed upstream commit, update that
metadata and checksum, then run the tests. Grammar fixes should be contributed
to Varlock so other integrations receive them too.

Package code is MIT licensed. The upstream grammar is MIT licensed by DMNO Inc.;
its original notice is included in `VARLOCK-LICENSE`.
