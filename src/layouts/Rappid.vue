<template>
  <q-layout view="hHh lpR fFf" class="wrapper">
    <AppHeader v-if="$route.name !== 'welcome'" />
    <q-page-container>
      <router-view />
    </q-page-container>
    <AppFooter />
    <!-- <q-footer elevated class="text-white" color="primary">
      <q-toolbar >
            <q-btn stretch flat v-on:click="back()">
              <q-tooltip >
                Back
              </q-tooltip>
              <q-icon name="arrow_back_ios" />
            </q-btn>
          <q-space />
            <q-icon name="home" color="text-white" class="cursor-pointer" style="font-size: 30px;" @click="navigate({ name: 'welcome' })"/>
          <q-space />
            <q-btn stretch flat v-on:click="logout">
              <q-tooltip >
                Logout
              </q-tooltip>
            <q-icon name="exit_to_app" />
        </q-btn>
      </q-toolbar>
    </q-footer> -->
  </q-layout>
</template>

<script>
import AppHeader from 'src/components/shared/AppHeader'
import AppFooter from 'src/components/shared/AppFooter'
export default {
  name: 'RappidLayout',
  components: {
    AppHeader,
    AppFooter
  },
  data () {
    return {
      leftDrawerOpen: false
    }
  },
  methods: {
    navigate (path) {
      this.$router.push(path)
    },
    back () {
      this.$router.go(-1)
    }
  }
}
</script>
<style scoped>

</style>
