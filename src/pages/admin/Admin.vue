<template>
  <q-page >
    <div class="row " >
      <div class=" col-xs-12 col-sm-12 col-md-4 col-lg-4 q-pl-sm q-pt-sm " >
        <q-card v-if="getAll" @click="navigate({ name : 'stocktakes' })" class=" col-xs-12 col-sm-12 col-md-12 col-lg-12 cursor-pointer" >
          <q-item>
            <q-item-section avatar>
              <q-avatar size="xl">
                <q-icon name="rule" size="xl"></q-icon>
              </q-avatar>
            </q-item-section>

            <q-item-section>
              <q-item-label>Stocktakes</q-item-label>
              <q-item-label caption>Last stocktake {{new Date()}}</q-item-label>
            </q-item-section>
          </q-item>
          <q-card-section>
            <div>Total Stocktakes completed</div>
            <div>{{getAll.getAll.stocktakes.length }}</div>
          </q-card-section>
        </q-card>
      </div>
      <div class=" col-xs-12 col-sm-12 col-md-4 col-lg-4 q-pl-sm q-pt-sm " >
        <q-card v-if="getAll" @click="navigate({ name : 'locations' })" class=" col-xs-12 col-sm-12 col-md-12 col-lg-12 cursor-pointer" >
          <q-item>
            <q-item-section avatar>
              <q-avatar size="xl">
                <q-icon name="location_on" size="xl"></q-icon>
              </q-avatar>
            </q-item-section>
            <q-item-section>
              <q-item-label>Locations</q-item-label>
              <q-item-label caption>Last stocktake {{new Date()}}</q-item-label>
            </q-item-section>
          </q-item>
          <q-card-section>
            <div>Total Locations</div>
            <div>{{getAll.getAll.locations.length }}</div>
          </q-card-section>
        </q-card>
      </div>
    </div>
  </q-page>
</template>

<script>
import getUsers from '../../graphql/queries/getUsers'
import getAll from '../../graphql/queries/getAll'

export default {
  name: 'PageIndex',
  mounted () {
  },
  data () {
    return {
      getAll: {
        getAll: {
          stocktakes: [],
          locations: []
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
      update: data => {
        return data
      },
      variables () {
        return {
          locations: true,
          supplyAmtech: true,
          supplyOther: true,
          stocktakes: true,
          maps: true,
          orders: true
        }
      }
    },
    users: {
      query: () => getUsers,
      update: data => {
        data.getUsers.map(x => {
          x.admin = x.groups.indexOf('admin') > -1
        })
        return data.getUsers
      }
    }
  }
}
</script>
