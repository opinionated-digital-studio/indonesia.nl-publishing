import * as M from 'hyper-ts/lib/ReaderMiddleware'
import { flow, pipe } from 'fp-ts/lib/function'
import { decodeBody, decodeParam } from '../../common/controller/decoder'
import { LangParam } from '../../common/decoders'
import { addNews, getNews, updateNews } from './news.service'
import {
  badRequest,
  internalServerError,
  json,
  notFound,
  unauthorized
} from '../../common/controller/http-response'
import { PostNewsBody, UpdateNewsBody, UpdateNewsParam } from './news.decoder'
import { requireAuth } from '../users/users.handlers'

export const getNewsHandler = pipe(
  requireAuth,
  M.ichainW(() => decodeParam('lang', LangParam)),
  M.ichainW(flow(getNews, M.fromReaderTaskEither)),
  M.ichainW(json),
  M.orElseW((error) => {
    switch (error._tag) {
      case 'DbError':
        return internalServerError()
      case 'DecodingError':
        return badRequest(error.errors)
      case 'UnauthorizedError':
        return unauthorized()
      default:
        return internalServerError()
    }
  })
)

export const postNewsHandler = pipe(
  requireAuth,
  M.ichainW(() =>
    pipe(
      M.bindTo('body')(decodeBody(PostNewsBody)),
      M.bind('lang', () => decodeParam('lang', LangParam)),
      M.ichainW((decoded) =>
        pipe(
          addNews({
            ...decoded.body,
            lang: decoded.lang
          }),
          M.fromReaderTaskEither
        )
      )
    )
  ),
  M.ichainW(json),
  M.orElseW((error) => {
    switch (error._tag) {
      case 'UnauthorizedError':
        return unauthorized()
      case 'DecodingError':
        return badRequest(error.errors)
      default:
        return internalServerError()
    }
  })
)

export const updateNewsHandler = pipe(
  requireAuth,
  M.ichainW(() =>
    pipe(
      M.bindTo('id')(decodeParam('id', UpdateNewsParam)),
      M.bind('body', () => decodeBody(UpdateNewsBody)),
      M.ichainW((decoded) =>
        pipe(decoded.body, updateNews(decoded.id), M.fromReaderTaskEither)
      )
    )
  ),
  M.ichainW(json),
  M.orElseW((error) => {
    switch (error._tag) {
      case 'NewsItemNotFound':
        return notFound('News item with ID not found')
      case 'UnauthorizedError':
        return unauthorized()
      case 'DecodingError':
        return badRequest(error.errors)
      default:
        return internalServerError()
    }
  })
)
