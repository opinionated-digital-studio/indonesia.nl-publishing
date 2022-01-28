import { Router } from 'express'
import { NewsServiceDeps } from './news.service'
import { toRequestHandler } from 'hyper-ts/lib/express'
import {
  getNewsHandler,
  postNewsHandler,
  updateNewsHandler
} from './news.handlers'
import { UserServiceDeps } from '../users/users.service'

export const registerNewsRoutes = (deps: NewsServiceDeps & UserServiceDeps) => {
  const router = Router()

  router.get('/:lang', toRequestHandler(getNewsHandler(deps)))

  router.patch('/:id', toRequestHandler(updateNewsHandler(deps)))

  router.post('/:lang', toRequestHandler(postNewsHandler(deps)))

  return router
}
