import * as M from 'hyper-ts/lib/ReaderMiddleware'
import { pipe } from 'fp-ts/lib/function'
import { decodeHeader } from '../../common/controller/decoder'
import { AuthorizationDecoder } from './users.decoder'
import { toUnauthorizedError } from '../../common/errors/UnauthorizedError'
import { authorizeUser } from './users.service'
import {
  internalServerError,
  json,
  unauthorized
} from '../../common/controller/http-response'

export const requireAuth = pipe(
  decodeHeader('Authorization', AuthorizationDecoder),
  M.mapLeft(toUnauthorizedError),
  M.ichainW((accessToken) =>
    pipe(authorizeUser(accessToken), M.fromReaderTaskEither)
  )
)

export const getCurrentUserHandler = pipe(
  decodeHeader('Authorization', AuthorizationDecoder),
  M.mapLeft(toUnauthorizedError),
  M.ichainW((accessToken) =>
    pipe(authorizeUser(accessToken), M.fromReaderTaskEither)
  ),
  M.ichainW(json),
  M.orElseW((error) => {
    switch (error._tag) {
      case 'UnauthorizedError':
        return unauthorized()
      default:
        return internalServerError()
    }
  })
)
