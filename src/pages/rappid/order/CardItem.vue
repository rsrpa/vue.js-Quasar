<template>
  <q-card
    class="my-card flex justify-center items-center cursor-pointer q-hoverable relative-position  q-mb-lg"
    :style="computedPaddings"
    :class="[best? 'bg-blue-2' : 'bg-grey-2']"
    @click="closeSwap()"
    v-ripple
  >
      <div class="absolute fixed-ribbon">
        <q-ribbon v-if="best && !current" position="left"  decoration="point-in" glow>Recommended</q-ribbon>
        <q-ribbon v-else-if="current" position="left" decoration="point-in">Current</q-ribbon>
        <q-ribbon v-else position="left" decoration="point-in">Alternative {{ index + 1 }}</q-ribbon>
      </div>
    <q-card-section>
      <q-item-label class="product-name q-my-md" caption>{{ item.v2 }}</q-item-label>
      <q-img
        class="product-img"
        contain
        :src="item.v6 !== 'false' ? item.v6 : require('assets/placeholder.png')"
      />
      <q-item-label class="product-sku" caption lines="1">SKU: {{ item.v1 }}</q-item-label>
      <q-item-label caption class="product-price text-h5">${{ item.v5 }} <sup class="sup-gst">+ GST</sup></q-item-label>
      <!--NOTE subs prop doesn't provide `soh` key therefor I added v-if for not render icon coz. getting error  -->
      <!-- <q-item-label class="q-my-sm">
        <q-icon
          v-if="item.soh"
          name="fiber_manual_record"
          :color="computedIconColor"
          size="15px"
        />
        Availability
      </q-item-label> -->
       <!--<q-btn
        no-caps
        color="cyan-6"
        type="a"
        target="_blank"
        :href="'https://amtech.co.nz/'+ item.v1"
      >
        <span class="text-h6">view online</span>
      </q-btn> -->
    </q-card-section>
  </q-card>
</template>

<script>
export default {
  name: 'CardItem',
  props: ['item', 'best', 'current', 'index'],
  computed: {
    computedPaddings () {
      if (this.$q.screen.lt.lg) {
        return {
          padding: '12px 0'
        }
      }
      return {
        padding: '20px 0'
      }
    },
    computedIconColor () {
      return this.item.soh[0].v1 + '-3'
    }
  },
  methods: {
    mouseOver () {
      this.hovering = !this.hovering
    },
    closeSwap () {
      if (this.current) {
        this.$emit('close')
      } else {
        this.$emit('swap', this.item)
      }
    }
  },
  data () {
    return {
      hovering: false,
      quantity: null
    }
  }
}
</script>

<style lang="scss" scoped>
.my-card {
  border-top-right-radius: 50px !important;
  border-bottom-left-radius: 50px !important;
  box-shadow: -9px 11px 1px 0px hsla(225, 23%, 37%, 0.7);
  max-width: 310px;
  min-width: 250px;
  min-height: 130px;
  text-align: center;
  border-radius: 4px;
  &:hover {
    background: #bbdefb !important;
  }
}
.fixed-ribbon {
  left: 0;
  top: 5px;
}
</style>

<style scoped lang="scss">
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
  font-size: .95rem;
  font-weight: 400;
}
.product-img {
  height: 110px;
  max-width: 130px;
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
  .sup-gst {
    font-size: 0.85rem;
    font-weight: 400;
  }
}
.fav-btn {
  /*width: 4rem;*/
}
.my-card {
  &:hover {
    background-color: #72c6ef;
  }
  // background-color: $teal-11;
}
</style>
