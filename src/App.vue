<template>
  <div id="q-app"  >
    <router-view />
  </div>
</template>
<script>
export default {
  name: 'App'
}
</script>
<style lang="scss">
  // .bg-image {
  //   background-image: url('../assets/BGblue.png');
  //   background-repeat: no-repeat;
  //   background-size: cover;
  //   background-attachment: fixed;
  // }
  .q-page-container {
    background-image: url('./assets/BGblue.png');
    background-repeat: no-repeat;
    background-attachment: fixed;
    background-size: cover;
    // background-position: center right;
  }
  .q-layout {
    background-color: #E1F0FB;
  }
</style>
