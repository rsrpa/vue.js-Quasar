
<template>
  <q-page class="column justify-center">
    <div class="row justify-center items-start">
      <h1 class="title text-white text-h4 text-center">
        Welcome to <span class="text-secondary">Rappid</span>
      </h1>
    </div>
    <div class="row justify-center q-pb-100">
      <div class="col-xl-9 col-lg-10 col-xs-11">
        <div class="row q-col-gutter-xl q-mb-md-none q-mb-lg">
          <div
            class="col-md-4 col-sm-6 col-xs-12"
            v-for="card in cards"
            :key="card.id"
          >
            <nav-card :card="card" />
          </div>
        </div>
      </div>
    </div>
    <!-- <div class="row full-width items-center ">
        <div class="col-sm-4 col-xs-6 q-pa-sm q-pb-lg cursor-pointer" >
          <q-card class="my-card text-nt-orange shadow-13" style="text-align:center" @click="navigate({name: 'search'})"   >
            <q-card-section>
              <q-icon name="search" class="text-nt-orange" style="font-size: 95px;" />
            </q-card-section>
            <q-card-section class="text-h6 text-center">
             Search Products
            </q-card-section>
          </q-card>
        </div>
        <div class="col-sm-4 col-xs-6 q-pa-sm q-pb-lg cursor-pointer">
          <q-card class="my-card text-nt-orange shadow-13" style="text-align:center" @click="navigate({name: 'favourites'})" >
            <q-card-section>
             <q-icon name="star" class="text-nt-orange" style="font-size: 95px;" />
            </q-card-section>
            <q-card-section class="text-h6 text-center">
              Favourites
            </q-card-section>
          </q-card>
        </div>
    </div>
    <div class="full-width row  justify-evenly items-center ">
    </div>
    <div class="full-width row  justify-evenly items-center ">
    </div> -->
  </q-page>
</template>

<script>
import NavCard from 'components/NavCard.vue'
export default {
  name: 'EntryPage',
  components: {
    NavCard
  },
  mounted () {
    this.$nextTick(() => {
      // this.createDonunt('doughnut-chart')
      // this.createChart('line-chart')
    })
  },
  data () {
    return {
      cards: [
        {
          id: 1,
          text: 'Search Products',
          icon: 'search',
          path: { name: 'search' }
        },
        {
          id: 2,
          text: 'Favourites Lists',
          img: require('assets/inventory.png'),
          path: { name: 'favourites' }
        },
        {
          id: 3,
          text: 'Amtech Account',
          img: require('assets/tasks.png'),
          path: { name: 'rappidorders' }
        }
      ]
    }
  },
  methods: {
    navigate (path) {
      this.$router.push(path)
    }
  },
  apollo: {
  }
}
</script>
<style lang="scss" scoped>
.title {
  max-width: 350px;
  margin: -120px 0 120px 0;
}
</style>
