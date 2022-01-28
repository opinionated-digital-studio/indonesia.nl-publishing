import { Router } from 'express'
import { toRequestHandler } from 'hyper-ts/lib/express'
import { getCurrentUserHandler } from './users.handlers'
import { UserServiceDeps } from './users.service'

export const registerUsersRoutes = (deps: UserServiceDeps) => {
  const router = Router()

  router.get('/', toRequestHandler(getCurrentUserHandler(deps)))

  return router
}
