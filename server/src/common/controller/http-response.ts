import { pipe } from 'fp-ts/lib/function'
import * as H from 'hyper-ts'
import * as M from 'hyper-ts/lib/ReaderMiddleware'
import { toJsonError } from '../errors/JsonError'

export const json = <T>(json: T) =>
  pipe(
    M.status(H.Status.OK),
    M.ichain(() => M.json(json, toJsonError))
  )

export const badRequest = (msg?: string) =>
  pipe(
    M.status(H.Status.BadRequest),
    M.ichain(() => M.closeHeaders()),
    M.ichainW(() => M.send(msg || 'Bad request'))
  )

export const internalServerError = (msg?: string) =>
  pipe(
    M.status(H.Status.InternalServerError),
    M.ichain(() => M.closeHeaders()),
    M.ichainW(() => M.send(msg || 'Internal server error'))
  )

export const notFound = (msg?: string) =>
  pipe(
    M.status(H.Status.NotFound),
    M.ichain(() => M.closeHeaders()),
    M.ichainW(() => M.send(msg || 'Not found'))
  )

export const unauthorized = (msg?: string) =>
  pipe(
    M.status(H.Status.Unauthorized),
    M.ichain(() => M.closeHeaders()),
    M.ichainW(() => M.send(msg || 'Unauthorized'))
  )
