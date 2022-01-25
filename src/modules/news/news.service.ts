import { Model } from 'mongoose'
import { News } from './news.model'
import * as TE from 'fp-ts/TaskEither'
import { toDbError } from '../../common/errors/DbError'

export interface NewsServiceDeps {
  newsModel: Model<News>
}

export const addNews =
  (news: News) =>
  ({ newsModel }: NewsServiceDeps) =>
    TE.tryCatch(() => newsModel.create(news), toDbError)

export const getNews =
  (lang: 'id' | 'en') =>
  ({ newsModel }: NewsServiceDeps) =>
    TE.tryCatch(
      async () => newsModel.find({ lang }).sort({ date: 'desc' }),
      toDbError
    )
