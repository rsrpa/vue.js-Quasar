<template>
  <q-header :class="'bg-primary'">
    <q-toolbar class="row justify-center q-pt-md q-pb-sm">
      <div class="col-11">
        <div
          class="row"
          :class="[welcomePage ? 'justify-between' : 'justify-end']"
        >
          <q-btn
            v-if="welcomePage"
            @click="back()"
            flat
            dense
            label="back"
            color="white"
            icon="arrow_back"
          />
          <q-space />
          <!-- NOTE this part probably will need update (no logaut in design) -->
          <cart v-if="welcomePage" />
          <!-- <q-btn
            flat
            dense
            color="accent"
            v-on="welcomePage ? {} : { click: logout }"
            :label="rigthIcon.name"
            :icon="rigthIcon.icon"
          /> -->
        </div>
      </div>
    </q-toolbar>
  </q-header>
</template>

<script>
import cart from 'src/components/Cart'
export default {
  components: {
    cart
  },
  computed: {
    welcomePage () {
      if (this.$route.name === 'welcome') {
        return false
      }
      return true
    },
    rigthIcon () {
      if (this.welcomePage) {
        return {
          icon: 'shopping_cart',
          name: 'Cart'
        }
      }
      return {
        icon: 'logout',
        name: ''
      }
    }
  },
  methods: {
    back () {
      this.$router.go(-1)
    },
    async logout () {
      await this.$Auth.signOut()
      this.$AmplifyEventBus.$emit('authState', 'signedOut')
    }
  }
}
</script>

<style lang="scss" scoped></style>
