
export function isAuthenticated (state) {
  return state.user
}

export function getTempUser (state) {
  return state.temp
}

export function getRoles (state) {
  return state.roles
}
