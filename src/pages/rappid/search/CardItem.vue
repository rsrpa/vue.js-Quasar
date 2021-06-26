<template>
  <q-card
    class="q-card-item text-center cursor-pointer"
    v-if="item.v4 === 'true'"
    @click="modal = true"
  >
    <q-card-section>
      <q-item-label class="product-name" caption>
        {{ item.v2 }}
      </q-item-label>
      <q-img
        class="product-img"
        contain
        :src="item.v6 !== 'false' ? item.v6 : require('assets/placeholder.png')"
      />
      <q-item-label class="product-sku" caption lines="1">
        Code: {{ item.v1 }}
      </q-item-label>
      <q-item-label caption class="product-price text-h5 q-mb-lg">
        ${{ item.v5 }}
        <sup class="sup-gst">+ GST</sup>
      </q-item-label>
      <q-item-label class="q-mb-lg product-sku text-h5">
        Availability:
        <q-icon name="fiber_manual_record" :color="computedIconColor" size="15px" />
      </q-item-label>
      <q-item-label class="flex column">
        <div class="row items-center">
          <q-input
            class="col-8"
            v-model.number="quantity"
            type="number"
            placeholder="Quantity"
            outlined
            dense
            @click.stop
          />
          <q-btn
            color="grey-5"
            outline
            class="q-ml-sm fav-btn col-3"
            icon="fas fa-heart"
            @click.stop="$emit('add-favourite', item)"
            padding="sm"
          />
        </div>
        <q-btn
          color="blue-5"
          class="full-width q-mt-sm"
          :disable="!quantity"
          @click.stop="addtoCart(item)"
          label="Add to cart"
        />
      </q-item-label>
    </q-card-section>
    <q-dialog
      v-model="modal"
      full-width
      :maximized="$q.screen.lt.sm"
    >
      <div class="row justify-center" :class="{ 'w-90': !$q.screen.lt.sm }">
        <div class="col-12">
          <q-card class="my-card row relative-position">
            <q-space v-if="$q.screen.lt.sm" />
            <div :class="{ 'absolute btn-close': !$q.screen.lt.sm }">
              <q-btn
                :round="!$q.screen.lt.sm"
                :flat="$q.screen.lt.sm"
                color="grey-3"
                text-color="red"
                icon="close"
                v-close-popup
              >
                <q-tooltip content-class="bg-primary text-white text-bold">
                  Close
                </q-tooltip>
              </q-btn>
            </div>
            <q-card-section
              class="col-sm-6 col-12 img-box"
              :style="computedImagePadding"
              horizontal
            >
              <div class="flex column full-width">
                <q-img
                  :src="item.v6 !== 'false' ? item.v6 : require('assets/placeholder.png')"
                  spinner-color="grey"
                />
              </div>
            </q-card-section>
            <q-card-section
              :style="computedContentPadding"
              class="col-sm-6 col-12 bg-grey-2"
            >
              <h2 class="q-ma-none text-h5 text-primary text-capitalize text-bold">
                {{ item.v2 }}
              </h2>
              <q-item-label caption class="q-my-sm">
                <span class="text-subtitle1 text-uppercase">SKU: {{ item.v1 }}</span>
              </q-item-label>
              <div caption class="text-h5 text-bold text-primary">
                ${{ item.v5 }}
                <sup class="text-subtitle2">+ GST</sup>
              </div>
              <div class="text-h5 text-bold text-primary text-capitalize q-pt-xl">
                Description & Features
              </div>
              <q-item-label caption class="q-pt-md"></q-item-label>
              <q-item-label caption class="q-py-md"></q-item-label>
              <q-item-label caption class="q-pb-md"></q-item-label>
              <q-item-label caption></q-item-label>
              <div class="flex full-width q-mt-lg q-gutter-md">
                <div class="col q-ml-none row">
                  <q-input
                    class="col input-border"
                    v-model.number="quantity"
                    type="number"
                    placeholder="Quantity"
                    outlined
                    dense
                  />
                  <div class="flex column">
                    <q-btn
                      size="sm"
                      class="btn-up"
                      padding="2px 20px"
                      dense
                      unelevated
                      color="grey-4"
                      text-color="black"
                      icon="expand_less"
                      @click="quantityUpdate('up')"
                    />
                    <q-btn
                      size="sm"
                      class="btn-down"
                      padding="2px 20px"
                      dense
                      unelevated
                      color="grey-4"
                      text-color="black"
                      icon="expand_more"
                      @click="quantityUpdate('down')"
                    />
                  </div>
                </div>
                <q-btn
                  color="grey-5"
                  outline
                  class="fav-btn col-1"
                  :text-color="hoverColor"
                  @mouseenter.native="hovered = true"
                  @mouseleave.native="hovered = false"
                  icon="fas fa-heart"
                  @click="$emit('add-favourite', item)"
                  padding="sm"
                />
              </div>
              <q-btn
                color="blue-5"
                class="full-width q-mt-md"
                :disable="!quantity"
                @click="addtoCart(item)"
                label="Add to cart"
              />
            </q-card-section>
          </q-card>
        </div>
      </div>
    </q-dialog>
  </q-card>
</template>

<script>
export default {
  name: 'CardItem',
  props: ['item'],
  data () {
    return {
      quantity: null,
      modal: false,
      hovered: false
    }
  },
  computed: {
    computedIconColor () {
      let color
      if (this.item.soh[0]) {
        color = this.item.soh[0].v1
      } else if (!this.item.soh[0]) {
        color = 'red'
      }
      return color
    },
    computedImagePadding () {
      return this.$q.screen.gt.sm ? { padding: '35px 70px' } : { padding: '25px 50px' }
    },
    computedContentPadding () {
      return this.$q.screen.gt.sm ? { padding: '35px 70px' } : { padding: '25px 50px' }
    },
    hoverColor () {
      return this.hovered ? 'grey-7' : ''
    }
  },
  methods: {
    quantityUpdate (val) {
      if (val === 'up') {
        this.quantity++
      } else {
        this.quantity === 0 ? (this.quantity = 0) : this.quantity--
      }
    },
    uuidv4 () {
      return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        var r = (Math.random() * 16) | 0
        var v = c === 'x' ? r : (r & 0x3) | 0x8
        return v.toString(16)
      })
    },
    addtoCart (item) {
      const itemToAdd = {
        pk: this.uuidv4(),
        map: {
          v1: item.v2
        },
        v5: this.quantity,
        supply: item
      }
      this.$store.dispatch('cart/actionUpdateCart', itemToAdd)
      this.$q.notify({
        color: 'primary',
        multiLine: false,
        message: item.v1 + ' - ' + item.v2 + ' added to cart',
        icon: 'info',
        position: 'top'
      })
      this.quantity = null
    }
  }
}
</script>

<style>
.input-border div:first-child {
  border-top-right-radius: 0px !important;
  border-bottom-right-radius: 0px !important;
}
</style>

<style scoped lang="scss">
.w-90 {
  width: 90% !important;
  max-width: 1200px !important;
  overflow: inherit;
}
.btn {
  &-up {
    border-bottom-left-radius: 0px;
    border-bottom-right-radius: 0px;
    border-top-left-radius: 0px;
  }
  &-down {
    border-bottom-left-radius: 0px;
    border-top-left-radius: 0px;
    border-top-right-radius: 0px;
  }
  &-close {
    right: 0;
    transform: translate(50%, -50%);
    z-index: 90;
  }
}
.my-card {
  .img-box {
    padding: 90px 110px;
  }
}
.q-dialog__inner > div {
  box-shadow: none;
}
body.screen--xs {
  .q-card-item {
    width: 20.5rem;
    margin: 0.75rem;
  }
}
body.screen--sm {
  .q-card-item {
    width: 13.5rem;
    margin: 0.75rem;
  }
}
body.screen--md {
  .q-card-item {
    width: 13.5rem;
    margin: 0.75rem;
  }
}
body.screen--lg {
  .q-card-item {
    width: 13.5rem;
    margin: 0.75rem;
  }
}
body.screen--xl {
  .q-card-item {
    width: 13.5rem;
    margin: 0.75rem;
  }
}
/* .q-card-item {
  width: 13.5rem;
  margin: .75rem;
} */
.card-fav-tab {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin: 1.5rem 0 0.5rem 0;
}
.product-name {
  font-size: 1rem;
  font-weight: 400;
  height: 5rem;
  /*text-transform: uppercase;*/
}
.product-img {
  height: 150px;
  margin: 1rem 0;
}
.product-desc {
  margin: 0.3rem 0;
}
.product-sku {
  font-size: 0.9rem;
  margin: 0.5rem 0;
  font-weight: 300;
}
.product-price {
  font-weight: 600;
  font-size: 1.25rem;
  margin-bottom: 0;
  .sup-gst {
    font-size: 0.85rem;
    font-weight: 400;
  }
}
.fav-btn {
  /*width: 4rem;*/
}
</style>
