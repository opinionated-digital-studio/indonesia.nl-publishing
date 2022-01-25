import { Model } from 'mongoose'
import { News } from './news.model'
import * as TE from 'fp-ts/TaskEither'
import * as O from 'fp-ts/Option'
import { toDbError } from '../../common/errors/DbError'
import { pipe } from 'fp-ts/lib/function'

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

interface NewsItemNotFound {
  _tag: 'NewsItemNotFound'
  message: string
}

const toNewsItemNotFound = (id: string): NewsItemNotFound => ({
  _tag: 'NewsItemNotFound',
  message: `News item with id ${id} not found`
})

export const updateNews =
  (id: string) =>
  (toUpdate: Partial<News>) =>
  ({ newsModel }: NewsServiceDeps) =>
    pipe(
      TE.tryCatch(async () => await newsModel.findById(id), toDbError),
      TE.chainW((maybeDocument) =>
        pipe(
          maybeDocument,
          O.fromNullable,
          TE.fromOption(() => toNewsItemNotFound(id))
        )
      ),
      TE.chainFirstW((existing) =>
        TE.tryCatch(
          async () =>
            await newsModel.updateOne({ _id: existing._id }, toUpdate),
          toDbError
        )
      ),
      TE.map((old) => {
        return {
          ...old.toObject(),
          ...toUpdate
        }
      })
    )
