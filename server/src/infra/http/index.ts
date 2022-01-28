import express from 'express'
import { appConfig } from '../../config'
import { router } from './routes'
import cors from 'cors'
import helmet from 'helmet'

const app = express()
const port = appConfig.port

app.use(helmet())
app.use(
  cors({
    allowedHeaders: ['Authorization', 'Content-Type'],
    origin: ['http://localhost:3000']
  })
)

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use('/api', router)

app.listen(port, () => {
  console.log('App listening on port ' + port)
})
