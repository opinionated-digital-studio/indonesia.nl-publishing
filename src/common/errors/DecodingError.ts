import { Errors } from 'io-ts'

interface DecodingError {
  _tag: 'DecodingError'
  errors: string
}

export const toDecodingError = (errors: Errors): DecodingError => ({
  _tag: 'DecodingError',
  errors: errors.map((error) => error.message).join('\n')
})
