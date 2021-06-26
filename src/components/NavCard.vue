<template>
  <!-- disable welcome page siling for now -->
  <q-card
    class="my-card flex justify-center items-center cursor-pointer q-hoverable"
    v-ripple
    :class="{ 'bg-grey-5 cursor-not-allowed': card.path === '' &&  this.$route.name === 'welcome'}"
    :style="computedPaddings"
    @click="navigate(card.path, card.id)"
  >
    <q-ribbon v-if="card.ribbonText" position="top-left" type="corner" glow>{{card.ribbonText}}</q-ribbon>
    <q-card-section class="column justify-center items-center">
      <q-icon v-if="!card.img && card.icon" :name="card.icon" color="nt-orange" size="68px" />
      <q-img
        v-if="!card.icon && card.img"
        width="68px"
        height="64px"
        img-class="my-card_img"
        :src="card.img"
        contain
      />
      <p class="q-pt-md text-brand text-body1 text-capitalize">
        {{ card.text }}
      </p>
    </q-card-section>
  </q-card>
</template>

<script>
export default {
  props: {
    card: {
      type: [Array, Object],
      required: true
    }
  },
  computed: {
    computedPaddings () {
      if (this.$q.screen.lt.lg) {
        return {
          padding: '18px 0'
        }
      }
      return {
        padding: '30px 0'
      }
    }
  },
  methods: {
    navigate (path, id) {
      // disable welcome paga routes for now
      this.$router.push(path)
    }
  }
}
</script>

<style lang="scss" scoped>
.my-card {
  border-top-left-radius: 50px !important;
  border-bottom-right-radius: 50px !important;
  box-shadow: -9px 11px 1px 0px hsla(225, 23%, 37%, 0.7);
  max-width: 310px;
  min-height: 130px;
  margin-left: auto;
  margin-right: auto;
  text-align: center;
  border-radius: 60px 4px 60px 4px;
}
</style>
