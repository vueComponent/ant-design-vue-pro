import ResizeObserverLite from 'resize-observer-lite'
import matchQueries from 'container-query-toolkit/lib/matchQueries'
import isShallowEqual from './isShallowEqual'

export default class ContainerQueryCore {
  constructor (query, callback) {
    this.result = {}
    this.rol = new ResizeObserverLite((size) => {
      const result = matchQueries(query)(size)
      if (!isShallowEqual(this.result, result)) {
        callback(result)
        this.result = result
      }
    })
  }

  observe (element) {
    this.rol.observe(element)
  }

  disconnect () {
    this.rol.disconnect()
  }
}
