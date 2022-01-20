import { pipe } from 'fp-ts/lib/function'
import { model, Schema } from 'mongoose'

export interface News {
  lang: string
  title: string
  href: string
  img?: string
  date?: Number
}

const News = pipe(
  new Schema<News>({
    lang: {
      type: String,
      required: true
    },
    title: {
      type: String,
      required: true
    },
    href: {
      type: String,
      required: true
    },
    img: String,
    date: { type: Date, default: Date.now }
  }),
  (schema) => model('News', schema)
)
