import { config } from 'dotenv'
import { isLeft, map } from 'fp-ts/lib/Either'
import { pipe } from 'fp-ts/lib/function'
import * as t from 'io-ts'

config()

const dbEnvDecoder = t.type({
  username: t.string,
  password: t.string,
  host: t.string,
  port: t.string
})

const makeMongoConnectionString = (config: {
  username: string
  password: string
  host: string
  port: string
}) => `mongodb://${config.username}:${config.password}@localhost:${config.port}`

export const makeDbConfig = () => {
  const parsed = pipe(
    dbEnvDecoder.decode({
      username: process.env.MONGO_ROOT_USERNAME,
      password: process.env.MONGO_ROOT_PASSWORD,
      host: process.env.MONGO_HOST,
      port: process.env.MONGO_PORT
    }),
    map(makeMongoConnectionString)
  )

  if (isLeft(parsed)) {
    throw new Error('Mongo env is missing params')
  }

  return parsed.right
}

export const dbConnectionString = makeDbConfig()
