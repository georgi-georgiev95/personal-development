// Firestore lives in its own module so the SDK (~470KB) stays out of the
// entry chunk — only code-split consumers (user entity) pull it in.
import { connectFirestoreEmulator, getFirestore } from 'firebase/firestore'
import { app } from '@/shared/config/firebase/firebase'

export const db = getFirestore(app)

if (import.meta.env.DEV && import.meta.env.MODE === 'emulator') {
  connectFirestoreEmulator(db, '127.0.0.1', 8080)
}
