import { pipe } from 'fp-ts/lib/function'
import * as O from 'fp-ts/Option'
import axios from 'axios'

export const parseAxiosError = (e: unknown) =>
  pipe(
    e,
    O.fromPredicate(axios.isAxiosError),
    O.chain((axiosError) => O.fromNullable(axiosError.response))
  )
