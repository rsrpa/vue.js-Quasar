<template>
  <q-page class="column justify-center welcome-page">
    <!-- <div class="row justify-center q-pb-100" v-if="$q.screen.gt.md">
      <div class="col-lg-11 col-xs-11">
        <div class="row justify-between">
          <q-img
            src="~/assets/logo-transparent.svg"
            style="max-width: 200px; height: 100px"
            contain
          />
          <q-img
            src="~/assets/footer-logo.png"
            style="max-width: 200px; height: 100px"
            contain
          />
        </div>
      </div>
    </div> -->
    <div class="row justify-center q-pt-lg">
      <h1 class="title text-white text-h4 text-center q-mx-lg">
        Welcome
        <span class="text-secondary">{{
          $store.getters['auth/isAuthenticated'].signInUserSession.idToken
            .payload.name
        }}</span
        ><span class="gt-xs">, What would you like to do first today?</span>
      </h1>
    </div>
    <div class="row justify-center q-pb-100" style="margin-bottom: 50px;">
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
    <div class="row justify-center fixed-footer-btns">
      <div class="col-11 col-xs-11 gt-sm">
        <div class="row">
          <q-btn
            color="primary"
            text-color="black"
            flat
            type="a"
            href="tel:0800268324"
          >
            <div class="round-icon q-mr-md bg-accent">
              <q-icon size="16px" name="call" color="white" />
            </div>
            <span class="text-white">0800 268 324</span>
          </q-btn>
          <q-btn
            color="primary"
            text-color="black"
            flat
            type="a"
            href="mailto:sales@amtech.co.nz"
          >
            <div class="round-icon q-mr-md bg-accent">
              <q-icon size="16px" name="email" color="white" />
            </div>
            <span class="text-white text-lowercase">sales@amtech.co.nz</span>
          </q-btn>
          <q-space></q-space>
          <q-btn
            color="primary"
            text-color="black"
            flat
          >
            <div class="round-icon q-mr-md bg-accent">
              <q-icon size="16px" name="business" color="white" />
            </div>
            <span class="text-white text-capitalize">{{company[0].v1}}</span>
          </q-btn>
          <q-btn
            color="primary"
            text-color="black"
            flat
            >
            <div class="round-icon q-mr-md bg-accent">
              <q-icon size="16px" name="contact_mail" color="white" />
            </div>
            <span class="text-white text-capitalize">{{company[0].v2}}</span>
          </q-btn>
        </div>
      </div>
    </div>
  </q-page>
</template>

<script>
import NavCard from 'components/NavCard.vue'
import getAll from 'src/graphql/queries/getAll'
export default {
  components: {
    NavCard
  },
  data () {
    const userRoles = this.$store.getters['auth/getRoles']
    console.log(userRoles)
    return {
      company: {
        v1: '',
        v2: ''
      },
      cards: [
        {
          id: 1,
          text: 'Amtech Order',
          icon: 'add_shopping_cart',
          path: { name: 'rappid' }
        },
        {
          id: 2,
          text: 'inventory',
          img: require('assets/inventory.png'),
          path: userRoles.includes('advance') ? { name: 'inventory' } : '',
          ribbonText: userRoles.includes('advance') ? '' : 'upgrade'
        },
        {
          id: 3,
          text: 'stocktake',
          img: require('assets/tasks.png'),
          path: '',
          // ribbonText: userRoles.includes('advance') ? '' : 'upgrade'
          ribbonText: 'upgrade'
        },
        {
          id: 4,
          text: 'administer',
          img: require('assets/id-card.png'),
          path: '',
          ribbonText: 'upgrade'
          // ribbonText: userRoles.includes('advance') ? '' : 'upgrade'
        },
        {
          id: 5,
          text: 'reporting',
          img: require('assets/chart-bar.png'),
          path: '',
          ribbonText: 'upgrade'
          // ribbonText: userRoles.includes('advance') ? '' : 'upgrade'
        },
        {
          id: 6,
          text: 'user account',
          img: require('assets/users-cog.png'),
          path: userRoles.includes('admin') ? { name: 'users' } : '',
          ribbonText: userRoles.includes('admin') ? '' : 'Admin'
        }
      ]
    }
  },
  apollo: {
    company: {
      query: () => getAll,
      variables () {
        return {
          company: true
        }
      },
      update: data => {
        console.log(data.getAll)
        return data.getAll.company
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.title {
  max-width: 650px;
  @media screen and (min-width: 1450px) {
    margin: 0 0 60px 0;
  }
}
.round-icon {
  border-radius: 100%;
  padding: 4px 8px;
}
.fixed-footer-btns {
  position: fixed;
  bottom: 60px;
  display: flex;
  align-items: center;
  width: 100%;
}
</style>
