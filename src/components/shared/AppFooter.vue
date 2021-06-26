<template>
    <q-footer elevated class="text-white" color="primary">
      <q-toolbar >
            <q-img
              height="30px"
              width="30px"
              :src="require('assets/r.png')"
              spinner-color="white"
              contain
              class="cursor-pointer home"
              @click="navigate({ name: 'welcome' })"
            />
            <!-- <q-btn stretch flat v-on:click="back()">
              <q-tooltip >
                Back
              </q-tooltip>
              <q-icon name="arrow_back_ios" />
            </q-btn> -->
          <q-space />
            <q-icon name="home" color="text-white" class="cursor-pointer home" style="font-size: 30px;" @click="navigate({ name: 'welcome' })"/>
          <q-space />
            <q-btn  stretch  flat v-on:click="logout">
              <q-tooltip >
                Logout
              </q-tooltip>
            <q-icon name="exit_to_app" />
        </q-btn>
      </q-toolbar>
    </q-footer>
  <!-- <q-footer
    class="text-white q-py-md"
    :class="[$q.screen.lt.md ? 'bg-primary' : 'bg-transparent']"
  >
    <div class="row justify-center">
      <div class="col-11">
        <div class="row justify-between items-end">
          <div :class="[$q.screen.lt.sm ? 'w-100' : 'w-200']">
            <q-img
              :src="require('assets/logo-transparent.svg')"
              spinner-color="white"
              :ratio="16 / 9"
              contain
              :style="computedLeftImageStyles"
            />
          </div>
          <q-space />
          <q-btn
            size="20px"
            flat
            color="white"
            icon="home"
            @click="navigate({ name: 'welcome' })"
          />
          <q-space />
          <q-img
            :src="require('assets/footer-logo.png')"
            spinner-color="white"
            :ratio="16 / 9"
            contain
            :style="computedRightImageStyles"
          />
        </div>
      </div>
    </div>
  </q-footer> -->
</template>

<script>
export default {
  computed: {
    computedLeftImageStyles () {
      if (this.$q.screen.lt.sm) {
        return {
          height: '60px',
          'max-width': '100px'
        }
      }
      return {
        height: '30px',
        'max-width': '154px'
      }
    },
    computedRightImageStyles () {
      if (this.$q.screen.lt.sm) {
        return {
          height: '60px',
          'max-width': '100px'
        }
      }
      return {
        height: '30px',
        'max-width': '200px'
      }
    }
  },
  methods: {
    navigate (path) {
      if (this.$route.name !== 'welcome') {
        this.$router.push(path)
      }
    },
    async logout () {
      await this.$Auth.signOut()
      this.$AmplifyEventBus.$emit('authState', 'signedOut')
    }
  }
}
</script>

<style lang="scss" scoped>
.home {
  transform: translateX(15px);
}
.w-200 {
  width: 200px;
}
.w-100 {
  width: 100px;
}
</style>
