export interface UnauthorizedError {
  _tag: 'UnauthorizedError'
}

export const toUnauthorizedError = (): UnauthorizedError => ({
  _tag: 'UnauthorizedError'
})
