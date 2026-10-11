# Contributing

## Development

```sh
npm ci
npm test
npm run typecheck
npm pack
```

The build emits ESM, CommonJS, and their TypeScript declarations. Tests cover
both Shiki regex engines, light/dark themes, language aliases, package exports,
and the upstream grammar checksum. CI runs on Node 20, 22, and 24 and uploads
installable package archives as workflow artifacts.

## Updating the grammar

The grammar is maintained by
[dmno-dev/varlock](https://github.com/dmno-dev/varlock/blob/main/packages/vscode-plugin/syntaxes/env-spec.tmLanguage.json).
Contribute syntax fixes upstream so other integrations receive them too.

`grammar-source.json` records the pinned upstream commit and SHA-256 checksum.
To update the vendored grammar, copy it from a reviewed upstream commit, update
the metadata and checksum, and run the tests. Preserve the upstream license notice
in `VARLOCK-LICENSE`.

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
