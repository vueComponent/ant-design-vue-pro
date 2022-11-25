import isShallowEqual from './isShallowEqual'
const hasOwnProperty = Object.prototype.hasOwnProperty

export default function isQueriesEqual (queryA, queryB) {
  const keysA = Object.keys(queryA)
  const keysB = Object.keys(queryB)

  if (keysA.length !== keysB.length) {
    return false
  }

  for (let i = 0; i < keysA.length; i++) {
    if (!hasOwnProperty.call(queryB, keysA[i]) ||
      !isShallowEqual(queryA[keysA[i]], queryB[keysA[i]])) {
      return false
    }
  }

  return true
}
