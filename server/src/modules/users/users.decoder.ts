import * as t from 'io-ts'

export const AuthorizationDecoder = t.string

export const UserDecoder = t.type({
  id: t.string,
  email: t.string
})
