<template>
  <q-page >
    <div class="row">
      <div class="col-xs-12 col-sm-12 col-md-9 col-lg-9 q-pr-sm">
        <div class="row">
          <div class="col-xs-12 col-sm-6 col-md-4 col-lg-4 q-pl-sm q-pt-sm">
            <q-card v-if="getAll" @click="navigate({ name : 'inventory' })" class=" col-xs-12 col-sm-12 col-md-12 col-lg-12 cursor-pointer bg-nt-blue text-white" >
              <q-item>
                <q-item-section avatar>
                  <q-avatar size="xl">
                    <q-icon name="store" size="xl"></q-icon>
                  </q-avatar>
                </q-item-section>
                <q-item-section>
                  <q-item-label>Inventories</q-item-label>
                  <q-item-label caption>Local time {{new Date()}}</q-item-label>
                </q-item-section>
              </q-item>
              <q-card-section>
                <div>Total inventory items</div>
                <div>{{getAll.data.getAll.inventories.length }}</div>
              </q-card-section>
            </q-card>
          </div>
          <div class="col-xs-12 col-sm-6 col-md-4 col-lg-4 q-pl-sm q-pt-sm">
            <q-card v-if="getAll" @click="navigate({ name : 'orders' })" class=" col-xs-12 col-sm-12 col-md-12 col-lg-12 cursor-pointer bg-nt-orange text-white" >
              <q-item>
                <q-item-section avatar>
                  <q-avatar size="xl">
                    <q-icon name="shopping_cart" size="xl"></q-icon>
                  </q-avatar>
                </q-item-section>
                <q-item-section>
                  <q-item-label>Total orders</q-item-label>
                  <q-item-label caption>As of {{new Date()}}</q-item-label>
                </q-item-section>
              </q-item>
              <q-card-section>
                <div>Total orders</div>
                <div>{{getAll.data.getAll.orders.length }}</div>
              </q-card-section>
            </q-card>
          </div>
          <div class="col-xs-12 col-sm-6 col-md-4 col-lg-4 q-pl-sm q-pt-sm">
            <q-card v-if="getAll" @click="navigate({ name : 'orders' })" class=" col-xs-12 col-sm-12 col-md-12 col-lg-12 cursor-pointer bg-nt-yellow text-white" >
              <q-item>
                <q-item-section avatar>
                  <q-avatar size="xl">
                    <q-icon name="local_shipping" size="xl"></q-icon>
                  </q-avatar>
                </q-item-section>
                <q-item-section>
                  <q-item-label>Orders Receivable</q-item-label>
                  <q-item-label caption>{{graphing.ordersPartial.length}} Partial Received</q-item-label>
                </q-item-section>
              </q-item>
              <q-card-section>
                <div>Total Orders Receivable</div>
                <div>{{graphing.ordersReceivable.length }}</div>
                <!-- <q-list dense>
                  <q-item v-for="order in getAll.data.getAll.orders" :key="order.pk">
                    <q-item-section>
                      <q-item-label>Reference : {{order.v2}}</q-item-label>
                      <q-item-label caption>Items on order {{order.items.length}}</q-item-label>
                    </q-item-section>
                  </q-item>
                </q-list> -->
              </q-card-section>
            </q-card>
          </div>
        </div>
        <div class="row">
          <div class="col-xs-12 col-sm-6 col-md-4 col-lg-4 q-pl-sm q-pt-sm">
            <q-card v-if="getAll" class=" col-xs-12 col-sm-12 col-md-12 col-lg-12 cursor-pointer" >
              <q-item>
                <q-item-section avatar>
                  <q-avatar size="xl">
                    <q-icon name="location_on" size="xl"></q-icon>
                  </q-avatar>
                </q-item-section>
                <q-item-section>
                  <q-item-label>Inventory count by location</q-item-label>
                  <q-item-label caption>{{new Date()}}</q-item-label>
                </q-item-section>
              </q-item>
              <q-card-section >
                <apexchart type="donut" :options="graphing.optionsDonut" :series="graphing.seriesDonut"></apexchart>
                <!-- <canvas id="doughnut-chart"></canvas> -->
              </q-card-section>
            </q-card>
          </div>
          <div class="col-xs-12 col-sm-6 col-md-4 col-lg-4 q-pl-sm q-pt-sm">
            <q-card v-if="getAll" class=" col-xs-12 col-sm-12 col-md-12 col-lg-12 cursor-pointer" >
              <q-item>
                <q-item-section avatar>
                  <q-avatar size="xl">
                    <q-icon name="compare_arrows" size="xl"></q-icon>
                  </q-avatar>
                </q-item-section>
                <q-item-section>
                  <q-item-label>Transactions</q-item-label>
                  <q-item-label caption>{{new Date()}}</q-item-label>
                </q-item-section>
              </q-item>
              <q-card-section >
                <apexchart  type="scatter" :options="graphing.options" :series="graphing.series"></apexchart>
                <!-- <canvas id="line-chart"></canvas> -->
              </q-card-section>
            </q-card>
          </div>
        </div>
      </div>
      <div class="col-xs-12 col-sm-12 col-md-3 col-lg-3">
        <div class="row">
          <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12">
            <t-timeline :id="'amtech_medical'" :sourceType="'profile'" :options="{ tweetLimit: '3', theme: 'light' }" />
          </div>
        </div>
      </div>
    </div>
  </q-page>
</template>

<script>
import { Timeline } from 'vue-tweet-embed'
import getUsers from '../graphql/queries/getUsers'
import getAll from '../graphql/queries/getAll'
export default {
  name: 'PageIndex',
  components: {
    't-timeline': Timeline
  },
  mounted () {
    this.$nextTick(() => {
      // this.createDonunt('doughnut-chart')
      // this.createChart('line-chart')
    })
  },
  data () {
    return {
      graphing: {
        ordersPartial: [],
        ordersReceivable: [],
        optionsDonut: {
          chart: {
            type: 'donut'
          },
          labels: [],
          xaxis: {
            categories: []
          }
        },
        seriesDonut: [],
        options: {
          chart: {
            id: 'vuechart-example'
          },
          xaxis: {
            categories: []
          }
        },
        series: [{
          name: 'Transactions',
          data: []
        }]
      },
      graphData: {
        labels: [],
        data: [],
        transData: [],
        ordersPartial: [],
        ordersReceivable: []
      },
      getAll: {
        data: {
          getAll: {
            locations: [],
            inventories: [],
            maps: [],
            orders: [],
            transactions: [],
            supplyOther: []
          }
        }
      }
    }
  },
  methods: {
    navigate (path) {
      this.$router.push(path)
    }
  },
  apollo: {
    getAll: {
      query: () => getAll,
      variables () {
        return {
          locations: true,
          supplyAmtech: true,
          supplyOther: true,
          stocktakes: true,
          inventories: true,
          transactions: true,
          transactionsLimit: 10,
          maps: true,
          orders: true,
          ordersLimit: 15
        }
      },
      update: data => {
        return {
          data: data
        }
      }
    },
    // Thu Nov 12 2020 16:17:17 GMT+1300 (New Zealand Daylight Time)
    users: {
      query: () => getUsers,
      update: data => {
        data.getUsers.map(x => {
          x.admin = x.groups.indexOf('admin') > -1
        })
        return data.getUsers
      }
    },
    graphing: {
      query: () => getAll,
      variables () {
        return {
          locations: true,
          supplyAmtech: true,
          supplyOther: true,
          stocktakes: true,
          inventories: true,
          transactions: true,
          transactionsLimit: 10,
          maps: true,
          orders: true,
          ordersLimit: 15
        }
      },
      update: data => {
        const locObject = {}
        const labels = data.getAll.locations.map(x => {
          locObject[x.pk] = 0
          return x.v1
        })
        data.getAll.inventories.forEach(x => {
          locObject[x.location.pk] = locObject[x.location.pk] + parseInt(x.v1)
        })
        const transLabels = []
        const transData = []
        const ordersReceivable = data.getAll.orders.filter(x => x.v3 === 'none')
        const ordersPartial = data.getAll.orders.filter(x => x.v3 === 'partial')
        data.getAll.transactions.map(tran => {
          // transLabels.push(new Date(parseInt(tran.gsi2sk)))
          // transLabels.push(tran.gsi2sk)
          // transData.push(parseInt(tran.v3))
          // transData.push(parseInt(tran.v3))
          transData.push({
            x: new Date(parseInt(tran.gsi2sk)).toLocaleDateString(),
            y: parseInt(tran.v3)
          })
        })
        transData.reverse()
        transLabels.reverse()
        const dataPoints = Object.values(locObject)
        return {
          options: {
            xaxis: {
              categories: transLabels
            }
          },
          series: [{
            data: transData
          }],
          seriesDonut: dataPoints,
          optionsDonut: {
            labels: labels
          },
          // labels: labels,
          // data: dataPoints,
          // transData: transData,
          // transLabels: transLabels,
          ordersReceivable: ordersReceivable,
          ordersPartial: ordersPartial
        }
      }
    }
  }
}
</script>
