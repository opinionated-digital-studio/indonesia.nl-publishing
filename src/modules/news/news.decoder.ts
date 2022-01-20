import * as t from 'io-ts'

export const PostNewsParam = t.keyof({
  id: null,
  en: null
})

export const PostNewsBody = t.intersection([
  t.type({
    title: t.string,
    href: t.string
  }),
  t.partial({
    date: t.number,
    img: t.string
  })
])

export type PostNewsBody = t.TypeOf<typeof PostNewsBody>
