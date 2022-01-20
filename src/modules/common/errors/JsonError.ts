export interface JsonError {
  _tag: 'JsonError'
}

export const toJsonError = (): JsonError => ({
  _tag: 'JsonError'
})
