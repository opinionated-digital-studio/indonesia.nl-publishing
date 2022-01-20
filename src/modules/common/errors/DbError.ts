interface DbError {
  _tag: 'DbError'
}

export const toDbError = (error: unknown): DbError => {
  console.error(error)

  return {
    _tag: 'DbError'
  }
}
