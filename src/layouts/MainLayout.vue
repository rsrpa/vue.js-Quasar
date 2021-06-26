<template>
  <q-layout view="hHh Lpr lFf">
    <q-header elevated>
      <q-toolbar>
        <q-btn
          flat
          dense
          round
          icon="menu"
          aria-label="Menu"
          @click="leftDrawerOpen = !leftDrawerOpen"
        />

        <q-toolbar-title>
          {{$store.getters['auth/isAuthenticated'].signInUserSession.idToken.payload['cognito:groups'].filter(g => g !=='admin')[0]}}
        </q-toolbar-title>

        <!-- <div>Quasar v{{ $q.version }}</div> -->
        <!-- <div>Logout</div> -->
        <q-btn stretch flat v-on:click="logout">
          <q-tooltip >
            Logout
          </q-tooltip>
          <q-icon name="exit_to_app" />
        </q-btn>
      </q-toolbar>
    </q-header>

    <q-drawer
      v-model="leftDrawerOpen"
      show-if-above
      bordered
      content-class="bg-grey-2"
    >
      <!-- <q-list>
        <q-item-label
          header
          class="text-grey-8"
        >
          Essential Links
        </q-item-label>
        <EssentialLink
          v-for="link in essentialLinks"
          :key="link.title"
          v-bind="link"
        />
      </q-list> -->
      <navlist />
    </q-drawer>

    <q-page-container padding class="bg-image" >
       <breadcrumb  />
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script>
import Navlist from '../components/Navlist'
import Breadcrumb from '../components/Breadcrumb'

export default {
  name: 'MainLayout',
  components: {
    Breadcrumb,
    Navlist
  },
  data () {
    return {
      leftDrawerOpen: false
    }
  },
  methods: {
    async logout () {
      await this.$Auth.signOut()
      this.$AmplifyEventBus.$emit('authState', 'signedOut')
    }
  }
}
</script>
<style>
</style>
