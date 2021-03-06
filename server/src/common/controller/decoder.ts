import { pipe } from 'fp-ts/lib/function'
import * as M from 'hyper-ts/lib/ReaderMiddleware'
import { Type } from 'io-ts'
import { toDecodingError } from '../errors/DecodingError'

export const decodeHeader = <A>(key: string, t: Type<A>) =>
  pipe(M.decodeHeader(key, t.decode), M.mapLeft(toDecodingError))

export const decodeBody = <A>(t: Type<A>) =>
  pipe(M.decodeBody(t.decode), M.mapLeft(toDecodingError))

export const decodeParam = <A>(key: string, t: Type<A>) =>
  pipe(M.decodeParam(key, t.decode), M.mapLeft(toDecodingError))

export const decodeParams = <A>(t: Type<A>) =>
  pipe(M.decodeParams(t.decode), M.mapLeft(toDecodingError))
