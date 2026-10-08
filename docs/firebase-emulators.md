# Isolated Firebase development

Requirements: Node 22+, pnpm 10+, and Java 21+ (`java -version`).
Run `pnpm install --frozen-lockfile` to install the pinned Firebase CLI and
rules test library. The first emulator launch downloads Firebase emulator binaries.

In two terminals:

```sh
pnpm emulators:start
pnpm dev:emulators
```

Open the Vite URL. Auth uses `127.0.0.1:9099`, Firestore uses `127.0.0.1:8080`,
and the Emulator UI uses <http://127.0.0.1:4000>. Create disposable accounts
through the existing registration page or the Emulator UI. No production
credentials, Firebase login, copied data, or `.env` changes are needed.

The separate `firebase.emulators.json` configuration uses the existing rules
and indexes. Scripts always pass `--project demo-pd-28` and `--only auth,firestore`;
`.firebaserc`, `firebase.json`, hosting, and deployed rules stay unchanged.
The app uses fake credentials and the same demo project only when Vite is
running in development with `--mode emulator`. Normal `pnpm dev` retains
existing configuration. Production builds ignore emulator mode.

## Validation

```sh
pnpm test:emulators
pnpm build --mode emulator
pnpm check:emulator-build
pnpm perf
```

`test:emulators` starts fresh emulators, runs Auth/Firestore integration and
profile permission checks, and stops the emulators. Tests require the exact
loopback host variables and demo project supplied by `emulators:exec`; running
`node --test tests/emulators/*.test.mjs` directly fails before SDK initialization.
No live fallback is allowed. If a port is occupied, stop that process before
running tests; do not substitute a remote host or live project.

Fixtures use generated `.test` email addresses and local profile data. Rules
tests clear only the demo database and use mocked authenticated/anonymous
contexts. They cover workspace ownership and private task reads, writes, and
field validation, including stable-ID retries.
Emulator data is disposable; stop the processes when finished. No export/import
of hosted data is part of this workflow. CI runs these checks in Quality Gate.
The emulator does not enforce production compound indexes or every service limit.
