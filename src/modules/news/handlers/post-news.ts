import { pipe } from 'fp-ts/lib/function'
import * as M from 'hyper-ts/lib/ReaderMiddleware'
import { decodeBody, decodeParam } from '../../../common/controller/decoder'
import {
  badRequest,
  internalServerError,
  json
} from '../../../common/controller/http-response'
import { PostNewsBody, PostNewsParam } from '../news.decoder'
import { addNews } from '../news.service'

export const postNewsHandler = pipe(
  M.bindTo('body')(decodeBody(PostNewsBody)),
  M.bind('lang', () => decodeParam('lang', PostNewsParam)),
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
