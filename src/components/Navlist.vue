<template>
  <q-list>
    <q-item :to="{name:'dashboard'}" class="q-pt-md">
      <q-item-section avatar >
        <q-icon name="dashboard"/>
      </q-item-section>
      <q-item-section>
        <q-item-label >Home</q-item-label>
        <q-item-label caption>Overview</q-item-label>
      </q-item-section>
    </q-item>
    <q-item :to="{name:'welcome'}" :exact="false"  >
      <q-item-section avatar >
        <q-icon name="av_timer"/>
      </q-item-section>
      <q-item-section>
        <q-item-label >Rappid</q-item-label>
        <q-item-label caption>Rappid orders</q-item-label>
      </q-item-section>
    </q-item>
    <q-item :to="{name:'inventory'}" :exact="false"  >
      <q-item-section avatar >
        <q-icon name="store"/>
      </q-item-section>
      <q-item-section>
        <q-item-label >Inventory</q-item-label>
        <q-item-label caption>Your inventory</q-item-label>
      </q-item-section>
    </q-item>
    <q-item :to="{name:'bulk'}" >
      <q-item-section avatar >
        <q-icon name="fas fa-sign-out-alt"/>
      </q-item-section>
      <q-item-section>
        <q-item-label >Outgoing</q-item-label>
        <q-item-label caption>Outgoing stock</q-item-label>
      </q-item-section>
    </q-item>

    <q-item :to="{name:'template'}" >
      <q-item-section avatar >
        <q-icon name="architecture"/>
      </q-item-section>
      <q-item-section>
        <q-item-label >Template</q-item-label>
        <q-item-label caption>Templates of inventory</q-item-label>
      </q-item-section>
    </q-item>

    <q-item :to="{name:'stocktake'}" >
      <q-item-section avatar >
        <q-icon name="rule"/>
      </q-item-section>
      <q-item-section>
        <q-item-label >Stocktake</q-item-label>
        <q-item-label caption>Keep track of inventory</q-item-label>
      </q-item-section>
    </q-item>

    <q-item :to="{name:'orders'}" >
      <q-item-section avatar >
        <q-icon name="shopping_cart"/>
      </q-item-section>
      <q-item-section>
        <q-item-label >Orders</q-item-label>
        <q-item-label caption>Receive and create orders</q-item-label>
      </q-item-section>
    </q-item>

    <q-item-label header v-if="admin">Admin</q-item-label>
    <q-item :to="{name:'admin'}" :exact="true" v-if="admin">
      <q-item-section avatar>
        <q-icon name="lock" />
      </q-item-section>
      <q-item-section>
        <q-item-label>Admin</q-item-label>
        <q-item-label caption>Admin dashboard</q-item-label>
      </q-item-section>
    </q-item>
    <q-item :to="{name:'transactions'}" :exact="false" v-if="admin">
      <q-item-section avatar>
        <q-icon name="insights" />
      </q-item-section>
      <q-item-section>
        <q-item-label>Transactions</q-item-label>
        <q-item-label caption>Inventory use</q-item-label>
      </q-item-section>
    </q-item>
    <q-item :to="{name:'stocktakes'}" :exact="false" v-if="admin">
      <q-item-section avatar>
        <q-icon name="rule" />
      </q-item-section>
      <q-item-section>
        <q-item-label>Stocktakes</q-item-label>
        <q-item-label caption>View completed stocktakes</q-item-label>
      </q-item-section>
    </q-item>
    <q-item :to="{name:'locations'}" :exact="false" v-if="admin">
      <q-item-section avatar>
        <q-icon name="location_on" />
      </q-item-section>
      <q-item-section>
        <q-item-label>Location</q-item-label>
        <q-item-label caption>Locations for inventory</q-item-label>
      </q-item-section>
    </q-item>
    <q-item :to="{name:'maps'}" :exact="false" v-if="admin">
      <q-item-section avatar>
        <q-icon name="transform" />
      </q-item-section>
      <q-item-section>
        <q-item-label>Map</q-item-label>
        <q-item-label caption>Map supply to inventory</q-item-label>
      </q-item-section>
    </q-item>
    <q-item :to="{name:'supply'}" :exact="false" v-if="admin">
      <q-item-section avatar>
        <q-icon name="directions_boat" />
      </q-item-section>
      <q-item-section>
        <q-item-label>Supply</q-item-label>
        <q-item-label caption>Manage supply</q-item-label>
      </q-item-section>
    </q-item>
    <q-item :to="{name:'users'}" :exact="false" v-if="admin">
      <q-item-section avatar>
        <q-icon name="group" />
      </q-item-section>
      <q-item-section>
        <q-item-label>Users</q-item-label>
        <q-item-label caption>Manage users</q-item-label>
      </q-item-section>
    </q-item>
  </q-list>
</template>

<script>

export default {
  name: 'Navlist',
  mounted () {
    this.admin = this.$store.getters['auth/getRoles'].includes('admin')
  },
  data () {
    return {
      admin: false
    }
  }
}
</script>

<style>
</style>
