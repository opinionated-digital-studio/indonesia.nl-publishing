import * as M from 'hyper-ts/lib/ReaderMiddleware'
import { flow, pipe } from 'fp-ts/lib/function'
import { decodeParam } from '../../../common/controller/decoder'
import { LangParam } from '../../../common/decoders'
import { getNews } from '../news.service'
import {
  badRequest,
  internalServerError,
  json
} from '../../../common/controller/http-response'

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
