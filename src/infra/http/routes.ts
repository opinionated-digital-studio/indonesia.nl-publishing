import { Router } from 'express'
import { News } from '../../modules/news/news.model'
import { registerNewsRoutes } from '../../modules/news/news.routes'

const router = Router()

router.use(
  '/news',
  registerNewsRoutes({
    newsModel: News
  })
)

export { router }
