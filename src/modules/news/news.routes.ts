import { Router } from 'express'
import { NewsServiceDeps } from './news.service'
import { toRequestHandler } from 'hyper-ts/lib/express'
import { postNewsHandler } from './handlers/post-news'
import { getNewsHandler } from './handlers/get-news'

export const registerNewsRoutes = (deps: NewsServiceDeps) => {
  const router = Router()

  router.get('/:lang', toRequestHandler(getNewsHandler(deps)))

  router.post('/:lang', toRequestHandler(postNewsHandler(deps)))

  return router
}
