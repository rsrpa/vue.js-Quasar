
export function updateCartPage (state, item) {
  const cartItem = state.cart.filter(x => x.supply.v1 === item.supply.v1)
  if (cartItem.length > 0) {
    const itemIndex = state.cart.indexOf(state.cart.find((x) => x.supply.v1 === item.supply.v1))
    cartItem[0].v5 = parseInt(cartItem[0].v5) + parseInt(item.v5)
    state.cart.splice(itemIndex, 1, cartItem[0])
  } else {
    state.cart.push(item)
  }
}

export function updateCart (state, item) {
  const cartItem = state.cart.filter(x => x.supply.v1 === item.supply.v1)
  if (cartItem.length > 0) {
    const itemIndex = state.cart.indexOf(state.cart.find((x) => x.supply.v1 === item.supply.v1))
    cartItem[0].v5 = item.v5
    state.cart.splice(itemIndex, 1, cartItem[0])
  } else {
    state.cart.push(item)
  }
}
export function deleteItem (state, itemId) {
  const id = state.cart.findIndex(x => x.pk === itemId)
  state.cart.splice(id, 1)
}
export function deleteCart (state) {
  state.cart = []
}

export function deleteNotes (state) {
  state.notes = ''
}
export function addCartNotes (state, noteText) {
  state.notes = noteText
}
export function deletePORef (state) {
  state.PORef = ''
}
export function addCartPORef (state, poText) {
  state.PORef = poText
}
