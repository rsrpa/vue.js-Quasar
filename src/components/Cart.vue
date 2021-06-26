<template>
  <q-btn dense label="Cart" flat color="amber" icon="shopping_cart" :to="{name: 'cart'} ">
    <q-badge color="cyan" floating transparent>
      {{items}}
    </q-badge>
  </q-btn>
</template>

<script>
export default {
  name: 'cart',
  computed: {
    items: function () {
      return this.$store.getters['cart/getCart'].length
    }
  },
  data () {
    return {
    }
  }
}
</script>

<style>
</style>
