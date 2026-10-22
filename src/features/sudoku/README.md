# Sudoku scores

Classic and Killer run locally and remain playable without an account or a
network. New games record start and completion times across reloads. Older
saved games remain playable as untimed practice games.

Scores are awarded only for completed games: Easy 1,000 / Medium 2,000 / Hard
3,000 base points, plus `max(0, 600 - elapsedSeconds)`, minus 100 per mistake.
Three mistakes end the game; retry starts the same puzzle with a new timer.

The global leaderboard ranks the top 20 **games**, separately by mode and by
UTC completion day, Monday-based week, month, or all time. Ties favor shorter
times. A player can rank each puzzle once. Guests supply a public name after
winning and use a random browser identity; signed-in players use their account
identity and a prefilled, editable profile name. No email is copied into scores.

`sudokuScores` contains immutable public community results. Firestore rules
validate identity, field limits, period buckets, timestamps, and the score
formula. These are **client-reported results**, not an authoritative competition:
the server does not issue puzzles or verify a move log. A modified client can
claim a win or a shorter time, and guests can clear their browser identity.
Competitive anti-cheat and guest rate limiting require a trusted game service.

## Local verification

Java 21 must be available on PATH for the Firebase emulators.

```sh
pnpm test:run src/features/sudoku
pnpm exec firebase emulators:exec --only firestore --project demo-pd-28 --config firebase.emulators.json 'node --test scripts/sudoku-rules.test.mjs'
```

Browser tests use a separate origin and demo emulators to preserve the user's
normal saved game and avoid publishing test scores:

```sh
pnpm exec firebase emulators:start --only auth,firestore --project demo-pd-28 --config firebase.emulators.json
pnpm dev --mode emulator --host 127.0.0.1 --port 5175
```

Production needs deployment of `firestore.rules` and `firestore.indexes.json`
before leaderboard reads/writes work. Deployment is a separate approval step.
The UI reports unavailable rankings and failed submissions and retains the
completed game for retry. The Firestore SDK is loaded only when needed.
