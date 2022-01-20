import { Model } from 'mongoose'
import { News } from './news.model'
import * as TE from 'fp-ts/TaskEither'
import { toDbError } from '../common/errors/DbError'

export const addNews =
  (news: News) =>
  ({ model }: { model: Model<News> }) =>
    TE.tryCatch(() => model.create(news), toDbError)
