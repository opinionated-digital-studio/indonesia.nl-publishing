import * as t from 'io-ts'

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

export const UpdateNewsBody = t.partial({
  title: t.string,
  href: t.string,
  date: t.number,
  img: t.string
})

export const UpdateNewsParam = t.string
