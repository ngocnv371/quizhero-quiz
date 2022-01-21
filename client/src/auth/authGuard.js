import { getInstance } from './authWrapper'

export const authGuard = (to, from, next) => {
  const authService = getInstance()

  const fn = () => {
    if (authService.isAuthenticated) {
      authService.getTokenSilently().then((token) => {
        authService.handleAfterAuthenticated(token)
        next()
      })

      return
    }

    authService.loginWithRedirect({ appState: { targetUrl: to.fullPath } })
    return next(false)
  }

  if (!authService.loading) {
    return fn()
  }

  authService.$watch('loading', (loading) => {
    if (loading === false) {
      return fn()
    }

    return next(false)
  })
}
