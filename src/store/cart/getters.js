
export function getCart (state) {
  return state.cart
}

export function getPKQty (state) {
  return pk => {
    if (state.cart.filter(x => x.pk === pk).length > 0) {
      return state.cart.filter(x => x.pk === pk)[0].v5
    } else {
      return ''
    }
  }
}
export function getCartNotes (state) {
  return state.notes
}

export function getCartPORef (state) {
  return state.PORef
}
