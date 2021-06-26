export function actionUpdateCart (context, item) {
  context.commit('updateCart', item)
}
export function actionUpdateCartPage (context, item) {
  context.commit('updateCartPage', item)
}
export function actionDeleteCart (context) {
  context.commit('deleteCart')
  context.commit('deleteNotes')
  context.commit('deletePORef')
}
export function actionAddNotes (context, noteText) {
  context.commit('addCartNotes', noteText)
}

export function actionAddPORef (context, poText) {
  context.commit('addCartPORef', poText)
}
