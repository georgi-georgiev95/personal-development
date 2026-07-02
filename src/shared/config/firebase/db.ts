// Firestore lives in its own module so the SDK (~470KB) stays out of the
// entry chunk — only code-split consumers (user entity) pull it in.
import { getFirestore } from 'firebase/firestore'
import { app } from './firebase'

export const db = getFirestore(app)
