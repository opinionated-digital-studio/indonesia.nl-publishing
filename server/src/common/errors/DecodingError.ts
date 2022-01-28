import { Errors } from 'io-ts'
import { formatValidationErrors } from 'io-ts-reporters'

interface DecodingError {
  _tag: 'DecodingError'
  errors: string
}

export const toDecodingError = (errors: Errors): DecodingError => {
  return {
    _tag: 'DecodingError',
    errors: formatValidationErrors(errors).join('\n')
  }
}
