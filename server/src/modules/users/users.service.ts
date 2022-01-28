import { Axios } from 'axios'
import { pipe } from 'fp-ts/lib/function'
import * as TE from 'fp-ts/TaskEither'
import { toUnauthorizedError } from '../../common/errors/UnauthorizedError'
import { OAuthConfig } from '../../config'
import { UserDecoder } from './users.decoder'
import { toRemoteError } from '../../common/errors/RemoteError'

export interface UserServiceDeps {
  axios: Axios
}

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
        toRemoteError
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
