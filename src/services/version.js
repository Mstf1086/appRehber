import { doc, getDoc, runTransaction, serverTimestamp } from 'firebase/firestore'
import { db } from './firebase.js'

const versionRef = doc(db, 'versions', 'current')

export const getVersionState = async () => {
  const snapshot = await getDoc(versionRef)

  if (!snapshot.exists()) {
    return { version: 0, lastUpdate: null }
  }

  const data = snapshot.data()
  return {
    version: Number(data.currentVersion || 0),
    lastUpdate: data.lastUpdate || null
  }
}

export const incrementDataVersion = async () => {
  return runTransaction(db, async (transaction) => {
    const snapshot = await transaction.get(versionRef)
    const currentVersion = Number(snapshot.data()?.currentVersion || 0)
    const nextVersion = currentVersion + 1

    transaction.set(
      versionRef,
      {
        currentVersion: nextVersion,
        lastUpdate: serverTimestamp()
      },
      { merge: true }
    )

    return nextVersion
  })
}
