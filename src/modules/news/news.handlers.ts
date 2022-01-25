import * as M from 'hyper-ts/lib/ReaderMiddleware'
import { flow, pipe } from 'fp-ts/lib/function'
import { decodeBody, decodeParam } from '../../common/controller/decoder'
import { LangParam } from '../../common/decoders'
import { addNews, getNews, updateNews } from './news.service'
import {
  badRequest,
  internalServerError,
  json,
  notFound
} from '../../common/controller/http-response'
import { PostNewsBody, UpdateNewsBody, UpdateNewsParam } from './news.decoder'

export const getNewsHandler = pipe(
  decodeParam('lang', LangParam),
  M.ichainW(flow(getNews, M.fromReaderTaskEither)),
  M.ichainW(json),
  M.orElseW((error) => {
    switch (error._tag) {
      case 'DbError':
        return internalServerError()
      case 'DecodingError':
        return badRequest(error.errors)
      default:
        return internalServerError()
    }
  })
)

export const postNewsHandler = pipe(
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
  ),
  M.ichainW(json),
  M.orElseW((error) => {
    switch (error._tag) {
      case 'DbError':
        return internalServerError()
      case 'DecodingError':
        return badRequest(error.errors)
      default:
        return internalServerError()
    }
  })
)

export const updateNewsHandler = pipe(
  M.bindTo('id')(decodeParam('id', UpdateNewsParam)),
  M.bind('body', () => decodeBody(UpdateNewsBody)),
  M.ichainW((decoded) =>
    pipe(decoded.body, updateNews(decoded.id), M.fromReaderTaskEither)
  ),
  M.ichainW(json),
  M.orElseW((error) => {
    switch (error._tag) {
      case 'NewsItemNotFound':
        return notFound('News item with ID not found')
      case 'DecodingError':
        return badRequest(error.errors)
      default:
        return internalServerError()
    }
  })
)
