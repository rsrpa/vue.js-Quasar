<template>
    <div class="q-pa-md">
      <q-breadcrumbs gutter="md"  separator="/">
        <q-breadcrumbs-el class="text-white"  label="HOME" :to="{name:'dashboard'}" />
        <q-breadcrumbs-el class="text-white"  v-for="(crumb, index) in crumbs" v-bind:key="crumb.text" :label="crumb.text.toUpperCase()" :to="{name:crumb.text}" v-bind:id="(index === crumbs.length - 1) ? lastCrumbClass : ''"  />
      </q-breadcrumbs>
    </div>
</template>

<script>
export default {
  name: 'Breadcrumb',
  computed: {
    crumbs: function () {
      return this.$route.matched.filter((route) => route.name || route.meta.label).map((route) => {
        let name = route.name
        if (route.meta.label) {
          name = route.meta.label
        }
        const items = {
          to: route.path,
          text: name
        }
        return items
      })
    }
  },
  data () {
    return {
      lastCrumbClass: 'crumb'
    }
  }
}
</script>

<style>
</style>
