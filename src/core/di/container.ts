type Constructor<T> = new () => T

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const bindings = new Map<symbol, Constructor<any>>()

export function bindTransient<T>(token: symbol, ctor: Constructor<T>): void {
  bindings.set(token, ctor)
}

export function getTransient<T>(token: symbol): T {
  const ctor = bindings.get(token) as Constructor<T> | undefined
  if (!ctor) {
    throw new Error(`No binding found for token ${String(token)}`)
  }
  return new ctor()
}

// convenience: register known viewmodels here
// NOTE: explicit bindings should be registered in `src/core/di/register.ts`
// to avoid using CommonJS `require` in browser-bundled code. This file
// only provides the binding API (bindTransient/getTransient).
