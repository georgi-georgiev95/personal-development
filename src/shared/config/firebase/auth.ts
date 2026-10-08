import { connectAuthEmulator, getAuth } from 'firebase/auth'
import { app } from '@/shared/config/firebase/firebase'

export const auth = getAuth(app)

if (import.meta.env.DEV && import.meta.env.MODE === 'emulator') {
  connectAuthEmulator(auth, 'http://127.0.0.1:9099')
}
