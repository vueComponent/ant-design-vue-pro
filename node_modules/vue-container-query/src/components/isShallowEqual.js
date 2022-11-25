const hasOwnProperty = Object.prototype.hasOwnProperty

export default function isShallowEqual (paramA, paramB) {
  const keysA = Object.keys(paramA)
  const keysB = Object.keys(paramB)

  if (keysA.length !== keysB.length) {
    return false
  }

  for (let i = 0; i < keysA.length; i++) {
    if (!hasOwnProperty.call(paramB, keysA[i]) || paramA[keysA[i]] !== paramB[keysA[i]]) {
      return false
    }
  }

  return true
}
