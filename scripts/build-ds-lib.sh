#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")/.."

npx vite build --config vite.config.lib.ts
npx tsc -p tsconfig.ds-lib.json

cat > dist-ds-lib/package.json <<'EOF'
{
  "name": "ui-kit",
  "version": "0.0.0",
  "types": "types/src/shared/ui-kit/index.d.ts"
}
EOF
