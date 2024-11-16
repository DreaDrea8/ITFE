import { Middleware } from '@reduxjs/toolkit'

import { RootState } from '../store'

const localStorageMiddleware: Middleware<{}, RootState> = store => next => action => {
  const result = next(action)

  const state = store.getState()
  localStorage.setItem('State', JSON.stringify(state))

  return result
}

export default localStorageMiddleware