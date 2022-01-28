import { Axios } from 'axios'
import { pipe } from 'fp-ts/lib/function'
import * as TE from 'fp-ts/TaskEither'
import * as O from 'fp-ts/Option'
import { toUnauthorizedError } from '../../common/errors/UnauthorizedError'
import { OAuthConfig } from '../../config'
import { UserDecoder } from './users.decoder'
import { toRemoteError } from '../../common/errors/RemoteError'
import { parseAxiosError } from '../../infra/axios/parse-axios-error'

export interface UserServiceDeps {
  axios: Axios
}

const parseAuthenticationError = (e: unknown) =>
  pipe(
    e,
    parseAxiosError,
    O.chain(O.fromPredicate((res) => res.status === 401)),
    O.foldW(() => toRemoteError(e), toUnauthorizedError)
  )

export const authorizeUser =
  (accessToken: string) =>
  ({ axios }: UserServiceDeps) =>
    pipe(
      TE.tryCatch(
        () =>
          axios.get(OAuthConfig.usersEndpoint, {
            headers: {
              Authorization: accessToken
            }
          }),
        parseAuthenticationError
      ),
      TE.map((result) => result.data),
      TE.chainW((result) =>
        pipe(
          UserDecoder.decode(result),
          TE.fromEither,
          TE.mapLeft(toUnauthorizedError)
        )
      )
    )
