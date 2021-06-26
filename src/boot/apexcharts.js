// import something here
// import ApexCharts from 'apexcharts'
import VueApexCharts from 'vue-apexcharts'
// "async" is optional;
// more info on params: https://quasar.dev/quasar-cli/cli-documentation/boot-files#Anatomy-of-a-boot-file
export default async ({ Vue }) => {
  Vue.use(VueApexCharts)
  Vue.component('apexchart', VueApexCharts)
  // something to do
}
