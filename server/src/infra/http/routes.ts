import axios from 'axios'
import { Router } from 'express'
import { News } from '../../modules/news/news.model'
import { registerNewsRoutes } from '../../modules/news/news.routes'
import { registerUsersRoutes } from '../../modules/users/users.routes'

const router = Router()

router.use('/users', registerUsersRoutes({ axios: axios }))

router.use(
  '/news',
  registerNewsRoutes({
    newsModel: News,
    axios: axios
  })
)

export { router }
