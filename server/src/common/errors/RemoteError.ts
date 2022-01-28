export interface RemoteError {
  _tag: 'RemoteError'
}

export const toRemoteError = (e?: unknown): RemoteError => {
  console.error(e)
  return {
    _tag: 'RemoteError'
  }
}
