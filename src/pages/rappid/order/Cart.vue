<template>
  <q-page class="row justify-center q-mb-lg">
    <q-dialog v-model="dialog.addy" persistent>

        <q-card contain style="max-width: 80vw;" class="q-pa-md">
          <q-card-section>
            <div class="text-h6">Final Confirmation :</div>
            <div class="text-subtitle1">Your order of {{ cart.length }} items for ${{ subtotalValue.toFixed(2) }}</div>
          </q-card-section>
          <q-card-section class="address-select-text">
            <div class="text-subtitle1">Select your delivery address:</div>
          </q-card-section>
          <q-card-section class="row q-pa-none justify-center">
            <q-card
              class="q-ma-md text-left cursor-pointer address-card"
              v-for="address in addresses"
              :key="address.pk"
              @click="setAddress(address)"
              :class="{'address-active': address.active}"
              >
              <q-radio class="address-checkbox" v-model="radio" :val="address.pk" />

              <q-card-section>
                <div v-html="address.v1"></div>
              </q-card-section>
            </q-card>
          </q-card-section>

          <q-card-actions align="right">
            <q-btn flat color="primary" no-caps label="Back" @click="close" />
            <q-btn class="q-px-md q-mx-md" no-caps text-color="white" color="accent" label="Place Order" @click="confirm"/>
          </q-card-actions>
        </q-card>
    </q-dialog>

    <div class="col-11 col-md-10 col-lg-9">
      <h4 class="text-warning text-weight-bold title">Shopping Cart</h4>
      <div v-if="cart.length > 0">
        <div class="row q-col-gutter-xl">
          <div class="col-md-9 col-12">
            <div :class="AvailabilityText.status" class="rounded-borders q-px-md q-py-sm q-mb-md text-white text-bold">
              {{ AvailabilityText.text }}
            </div>
          </div>
        </div>
        <div class="row q-col-gutter-xl">
          <div class="col-md-9 col-12">
          <q-markup-table
            class="favourite-table q-mb-lg"
            v-for="group in favs.favs"
            :key="group.pk"
            :id="group.pk"
            dense
          >
            <thead>
              <tr class="bg-blue-1 r-cart-tr">
                <th lass="text-center"></th>
                <th class="text-left item-substitute">Product</th>
                <th class="text-centercheck">Availability</th>
                <th class="text-center">Price</th>
                <th class="text-center">Qty</th>
                <th class="text-right">Subtotal</th>
                <th lass="text-center"></th>
              </tr>
            </thead>
            <tbody>
              <q-tr
                v-for="item in cart"
                :key="item.pk"
                clickable
                :id="item.pk"
                class="cursor-pointer"
              >
              <q-td>
                <q-img :src="item.supply.v6" class="r-cart-product-image" contain />
              </q-td>
                <q-td class="text-left r-cart-product-description">
                  {{ item.map.v1 }}
                </q-td>
                <q-td class="text-center">
                  <div v-if="item.supply.soh[0]">
                    <q-icon
                      v-if="item.supply.soh[0].v1 === 'green'"
                      name="fiber_manual_record"
                      color="green-12"
                      size="30px"
                    />
                    <q-icon
                      v-if="item.supply.soh[0].v1 === 'orange'"
                      name="fiber_manual_record"
                      color="orange-3"
                      size="30px"
                    >
                    </q-icon>
                    <q-icon
                      v-if="item.supply.soh[0].v1 === 'red'"
                      name="fiber_manual_record"
                      color="red-3"
                      size="30px"
                    >
                    </q-icon>
                  </div>
                </q-td>
                <q-td class="text-center">${{(Math.round(item.supply.v5 * 100) / 100).toFixed(2)}}</q-td>
                <q-td class="text-center">
                  <div class="row items-center justify-center quantity-input">
                    <q-input
                      class="inputFav"
                      hide-bottom-space
                      standout
                      square
                      outlined
                      dense
                      input-class="text-center col-12"
                      type="number"
                      :disable="item.supply.v4 !== 'true'"
                      :ref="'units#' + item.pk"
                      v-model="item.v5"
                      :rules="[
                        val =>
                          (Number.isInteger(Number(val)) && Number(val) >= 0) ||
                          'Please enter a valid number'
                      ]"
                      @change.native="updateRow($event, item)"
                    >
                    </q-input>
                  </div>
                </q-td>
                <q-td class="text-center">
                  ${{
                    (
                      parseFloat(item.supply.v5) * parseFloat(item.v5)
                    ).toFixed(2)
                  }}
                </q-td>
                <q-td class="text-center">
                    <q-btn dense flat color="black" icon="delete" @click="deleteCartItem(item.pk)"/>
                </q-td>
              </q-tr>
            </tbody>
          </q-markup-table>
            <q-card class="my-card q-mt-md">
              <q-card-section horizontal>
                <q-banner class="bg-blue-1 full-width text-white">
                  <div class="row title-section">
                    <div class="q-mr-auto">
                      <div class="text-capitalize text-weight-bold text-primary">
                        Purchase order reference
                      </div>
                    </div>
                  </div>
                </q-banner>
              </q-card-section>
              <q-card-section horizontal>
                <q-input
                  class="full-width"
                  square
                  flat
                  type="text"
                  color="transparent"
                  @change.native="addCartPORefFunc($event)"
                  :value="poRef"
                  label="Purchase order reference"
                  filled
                  autogrow
                  input-style="{minHeight: 100px, backgroundColor: #fff}"
                />
              </q-card-section>
            </q-card>
              <q-card class="my-card q-mt-md">
              <q-card-section horizontal>
                <q-banner class="bg-blue-1 full-width text-white">
                  <div class="row title-section">
                    <div class="q-mr-auto">
                      <div class="text-capitalize text-weight-bold text-primary">
                        Notes
                      </div>
                    </div>
                  </div>
                </q-banner>
              </q-card-section>
              <q-card-section horizontal>
                <q-input
                  class="full-width"
                  square
                  flat
                  type="textarea"
                  color="transparent"
                  @change.native="addCartNotesFunc($event)"
                  :value="notes"
                  label="Add notes here"
                  filled
                  autogrow
                  input-style="{minHeight: 100px, backgroundColor: #fff}"
                />
              </q-card-section>
            </q-card>
          </div>
          <div
            class="col-md-3 col-12"
            :class="{ 'q-mt-xs': $q.screen.lt.md }"
          >
            <q-card class="my-card">
              <q-card-section horizontal>
                <q-banner class="bg-blue-1 full-width text-white">
                  <div class="row title-section">
                    <div class="q-mr-auto">
                      <div class="text-capitalize text-weight-bold text-primary">
                        Summary
                      </div>
                    </div>
                  </div>
                </q-banner>
              </q-card-section>
              <q-card-section class="column">
                <div class="row justify-between">
                  <p>Subtotal</p>
                  <p>${{ subtotalValue.toFixed(2) }}</p>
                </div>
                <div class="row justify-between">
                  <p>Freight *</p>
                  <p v-if="subtotalValue < 150">$7.50</p>
                  <p v-else>$0.00</p>
                </div>
                <div class="row justify-between">
                  <p>Admin fee</p>
                  <p>$3.91</p>
                </div>
                <div class="row justify-between">
                  <p>GST</p>
                  <p v-if="subtotalValue < 150">
                    ${{ ((subtotalValue + 7.5 + 3.91) * 0.15).toFixed(2) }}
                  </p>
                  <p v-else>${{ ((subtotalValue + 3.91) * 0.15).toFixed(2) }}</p>
                </div>
                <div class="row justify-between">
                  <p>Total</p>
                  <p v-if="subtotalValue < 150">
                    ${{
                      (
                        subtotalValue +
                        (subtotalValue + 7.5 + 3.91) * 0.15
                      ).toFixed(2)
                    }}
                  </p>
                  <p v-else>
                    ${{
                      (subtotalValue + (subtotalValue + 3.91) * 0.15).toFixed(2)
                    }}
                  </p>
                </div>
                <div class="row justify-between">
                  <p class="r-cart-p">
                    * Freight fee of $7.50 + GST applies for orders under $150
                  </p>
                </div>
              </q-card-section>
              <q-card-section class="column">
                <q-btn
                  :to="{ name: 'favourites' }"
                  color="secondary"
                  text-color="white"
                  label="Continue Shopping"
                />
                <q-space class="q-my-sm" />
                <q-btn
                  color="accent"
                  text-color="white"
                  label="Confirm Order"
                  @click="openAddy"
                />
              </q-card-section>
            </q-card>
          </div>
          <div class="col-md-9 col-12">
          </div>
          <div class="col-md-9 col-12">
          </div>
        </div>
      </div>
      <div v-else class="row q-col-gutter-xl">
        <div class="col-12">
          <q-card class="q-pa-lg">
            <q-item>
              <q-item-section avatar>
                <q-icon
                  color="amber"
                  name="production_quantity_limits"
                  size="88px"
                />
              </q-item-section>

              <q-item-section>
                <q-item-label>Your cart is empty</q-item-label>
                <q-item-label caption>
                  Add some items and we will see you back here soon
                </q-item-label>
              </q-item-section>
            </q-item>
            <q-btn
              :to="{ name: 'favourites' }"
              color="secondary"
              text-color="white"
              label="Continue Shopping"
            />
          </q-card>
        </div>
      </div>
    </div>
  </q-page>
</template>

<script>
import createOrder from '../../../graphql/mutations/createOrder'
import getAll from 'src/graphql/queries/getAll'
import { mapGetters, mapMutations, mapActions } from 'vuex'
export default {
  name: 'Mycart',
  components: {},
  props: [],
  data () {
    return {
      radio: '',
      addresses: [],
      address: {},
      edit: false,
      favs: {
        favs: [
          {
            items: []
          }
        ],
        title: ''
      },
      fee: 0,
      supply: [],
      supplyKeys: {
        skipSupply: true,
        pk: ''
      },
      dialog: {
        form: false,
        subs: false,
        addy: false
      },
      text: '',
      positions: ['Top', 'Bottom'],
      form: {
        name: '',
        position: ''
      },
      roundBoxNumber: [],
      items: [],
      groups: [],
      orderPlaced: false
    }
  },
  mounted () {
  },
  computed: {
    ...mapGetters({
      cart: 'cart/getCart',
      notes: 'cart/getCartNotes',
      poRef: 'cart/getCartPORef',
      qty: 'cart/getPKQty'
    }),
    subtotalValue () {
      let total = 0
      this.cart.forEach((el) => {
        // total += parseFloat(el.map.supply.v5) * parseFloat(el.v5)
        total += parseFloat(el.supply.v5) * parseFloat(el.v5)
      })
      return total
    },
    itemAvailability () {
      const status = {
        orange: 0,
        red: 0
      }
      for (let i = 0; i < this.cart.length; i++) {
        if (this.cart[i].supply.soh[0] !== undefined) {
          if (this.cart[i].supply.soh[0].v1 === 'orange') {
            status.orange += parseInt(this.cart[i].v5)
          } else if (this.cart[i].supply.soh !== undefined && this.cart[i].supply.soh[0].v1 === 'red') {
            status.red += parseInt(this.cart[i].v5)
          }
        } else {
          status.red = parseInt(this.cart[i].v5)
        }
      }
      return status
    },
    AvailabilityText () {
      const message = {}
      if (this.itemAvailability.red > 0) {
        message.text =
          this.itemAvailability.red +
          ' items are unavailable - these will be placed on backorder!'
        message.status = 'bg-red-3'
      } else if (this.itemAvailability.orange > 0) {
        message.text =
          this.itemAvailability.orange + ' Items may be low on stock!'
        message.status = 'bg-orange-3'
      } else {
        message.text = 'Congratulations, all items are in stock!'
        message.status = 'bg-green-3'
      }
      return message
    }
  },
  methods: {
    ...mapMutations({
      CartItemDelete: 'cart/deleteItem'
    }),
    ...mapActions({
      addCartNotes: 'cart/actionAddNotes',
      addCartPORef: 'cart/actionAddPORef'
    }),
    addCartNotesFunc (event) {
      this.addCartNotes(event.target.value)
    },
    addCartPORefFunc (event) {
      this.addCartPORef(event.target.value)
    },
    close () {
      this.dialog.addy = false
      this.orderPlaced = false
    },
    setAddress (address) {
      this.address = address
      this.radio = address.pk
      address.active = true
      this.addresses = this.addresses.map(x => {
        if (address.pk === x.pk) {
          x.active = true
        } else {
          x.active = false
        }
        return x
      })
    },
    deleteCartItem (id) {
      this.CartItemDelete(id)
    },
    uuidv4 () {
      return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(
        /[xy]/g,
        function (c) {
          var r = (Math.random() * 16) | 0
          var v = c === 'x' ? r : (r & 0x3) | 0x8
          return v.toString(16)
        }
      )
    },
    // addToCart (item) {
    //   this.$store.dispatch('cart/actionUpdateCart', { ...item })
    // },
    navigate (path) {
      this.$router.push(path)
    },
    roundBoxInput (item) {
      const calcBox = Math.ceil(item.v5 / 12) * 12
      let cartItem
      if (item.v7 === 12) {
        cartItem = Object.assign(item, { v5: calcBox })
        if (this.$q.screen.lt.lg && item.v7 !== 12) {
          this.$q.notify({
            group: false,
            multiLine: true,
            message: `Buy this product in ${item.v7} size box to save packaging & wast`,
            color: 'accent',
            timeout: 300
          })
        }
      } else {
        cartItem = Object.assign(item, { v7: 12 })
      }
      // this.updateItem(cartItem)
      this.$store.dispatch('cart/actionUpdateCart', cartItem)
    },
    updateRow (event, row) {
      const newValue = event.target.value
      const cartItem = { ...this.cart.filter((x) => x.pk === row.pk)[0] }
      cartItem.v1 = true
      cartItem.v5 = newValue
      this.$store.dispatch('cart/actionUpdateCart', cartItem)
    },
    createGroup () {
      this.dialog.form = true
    },
    showSubs (item) {
      this.dialog.subs = true
      this.supplyKeys.pk = item.supply.pk
    },
    openAddy () {
      this.orderPlaced = true
      let error = false
      this.cart.forEach((x) => {
        if (x.v1 === true) {
          const unitsRef = 'units#' + x.pk
          this.$refs[unitsRef][0].validate()
          if (this.$refs[unitsRef][0].hasError) {
            error = true
          }
        }
      })
      if (error) {
        this.$q.notify({
          color: 'primary',
          multiLine: false,
          message: 'Please fix errors before placing order',
          icon: 'info'
        })
        return
      }
      this.dialog.addy = true
    },
    confirm () {
      const obj = this.address
      if (obj && Object.keys(obj).length === 0 && obj.constructor === Object) {
        this.$q.notify({
          color: 'red',
          multiLine: false,
          position: 'top',
          // message: e.graphQLErrors[0].message,
          message: 'Please select a shipping address',
          icon: 'error'
        })
      } else {
        // console.log(this.address.v1)
        this.placeOrder()
        this.dialog.addy = false
      }
    },
    placeOrder () {
      this.orderPlaced = true
      const items = []
      let total = 0
      let units = 0
      this.cart.forEach((x) => {
        if (x.v1 === true) {
          // total = total + x.v5 * x.map.supply.v5
          total = total + x.v5 * x.supply.v5
          units = parseInt(units) + parseInt(x.v5)
          items.push({
            gsi2sk: String(x.map.pk),
            pk: false, // this is just a place holder for the backend lambda to put order item recieved to false
            v1: x.v5,
            v2: x.supply.v2,
            v3: x.supply.v1,
            v4: x.supply.v3,
            v5: x.v5
          })
        }
      })
      this.dialog.addy = true
      // this.$store.dispatch('cart/actionDeleteCart')
      const input = {
        v1: this.$store.getters['auth/isAuthenticated'].signInUserSession.idToken.payload.email,
        v2: this.poRef,
        v3: this.address.v1,
        items: items,
        gsi2pk: this.notes
      }
      this.$apollo
        .mutate({
          mutation: createOrder,
          variables: {
            input: input
          }
        })
        .then((data) => {
          this.$q.notify({
            color: 'primary',
            multiLine: false,
            message: 'Order placed',
            icon: 'info',
            position: 'top'
          })
          // this.$apollo.queries.favs.refetch()
          this.$store.dispatch('cart/actionDeleteCart')
          // this.$router.push({ name: 'orders' })
        })
        .catch((e) => {
          console.log({ e })
          this.$q.notify({
            color: 'red',
            multiLine: false,
            // message: e.graphQLErrors[0].message,
            message: e,
            icon: 'error'
          })
        })
    }
  },
  apollo: {
    addresses: {
      query: () => getAll,
      variables () {
        return {
          company: true
        }
      },
      update: data => {
        const y = data.getAll.company[0].addresses.map(x => {
          x.v1 = x.v1.replace(/\n/g, '<br>')
          x.active = false
          return x
        })
        return y
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.title {
  text-shadow: 1px 1px 6px #29314833;
  &-section_end div:not(:last-child) {
    min-width: 85px;
  }
}
.overflowCard {
  display: block;
  overflow-x: auto;
}
.price,
.input {
  min-width: 85px;
}
.subtotal {
  min-width: 75px;
}
.quantity {
  width: 75px;
  div {
    width: 50%;
  }
  .q-field--dense {
    height: 30px !important;
  }
  .q-field--with-bottom {
    padding-bottom: 0;
  }
}

.address-select-text {
  padding-bottom: 0;
}

.address-checkbox {
  opacity: 0;
  top: 0;
  position: absolute;
}
.address-card {
  display: flex;
  width: 188px;
}
.address-active {
  border: 3px solid #72c6ef;
  border-radius: .52rem;
}
.inputCart{
  width: 48px;
}
.quantity-input {
  .q-field__control {
    height: 30px;
    width: 45px;
  }
  .q-field__append {
    display: none;
  }
}
.r-cart-product-image{
  max-height: 40px;
  min-width: 40px;
  max-width: 50px;
}
.r-cart-product-description{
  vertical-align:middle;
  width:400px;
  white-space: initial;
}
.r-cart-tr{
  min-height: 50px;
}
.r-cart-p{
  font-size: 10px;
}

</style>
