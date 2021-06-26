<template>
 <q-page class="q-pa-md" >
    <q-table
      v-if="Stocktakes[0]"
      title="Users"
      :data="Stocktakes[0].items"
      :columns="columns"
      :pagination.sync="pagination"
      :filter="filter"
      >
      <template v-slot:top="props">
        <q-space />
        <q-input dense debounce="300" color="primary" v-model="filter">
          <template v-slot:append>
            <q-icon name="search" />
          </template>
        </q-input>
        <q-btn
          flat round dense
          :icon="props.inFullscreen ? 'fullscreen_exit' : 'fullscreen'"
          @click="props.toggleFullscreen"
          class="q-ml-md"
        />
      </template>
      <template v-slot:body="props">
        <tr :class="props.row.v1 !== props.row.v2  ? 'bg-yellow-1':''">
        <!-- <tr :class="props.row.v1 !== props.row.v2 ? 'yellow-1' : ''" class="yellow-1"> -->
          <q-td>{{props.row.map.v1}}</q-td>
          <q-td>{{props.row.location.v1}}</q-td>
          <!-- <q-td>{{props.row.location.v1}}</q-td> -->
          <q-td>{{props.row.v1}}</q-td>
          <q-td>{{props.row.v2}}</q-td>
          <q-td>{{ parseInt(props.row.v2) - parseInt(props.row.v1) }}</q-td>
          <!-- <q-td>{{props.row.items.length}}</q-td> -->
          <!-- <q-td>
            <q-btn flat :to="{name:'receive',params:{ pk: props.row.pk }}">
              <q-tooltip >
                Receipt
              </q-tooltip>
            <q-icon  name="done_all"  />
            </q-btn>
          </q-td> -->
        </tr>
      </template>
    </q-table>
  </q-page>
</template>

<script>
import getAll from '../../../graphql/queries/getAll'

export default {
  name: 'Stocktake',
  props: [
    'pk'
  ],
  mounted () {
    this.dialog.locations = false
    this.Bulk = []
  },
  data () {
    return {
      Stocktakes: [],
      Orders: [],
      Inventories: [],
      dialog: {
        locations: false,
        addInventory: false,
        addTemplate: false
      },
      pagination: {
        sortBy: 'gsi1sk',
        descending: true,
        page: 2,
        rowsPerPage: -1
      },
      filter: '',
      columns: [
        {
          label: 'Name',
          align: 'left',
          field: row => {
            return row.map.v1
          },
          name: 'map.v1',
          sortable: true
        },
        {
          label: 'Name',
          align: 'left',
          field: row => {
            return row.location.v1
          },
          name: 'location.v1',
          sortable: true
        },
        {
          label: 'Inventory Stated',
          align: 'left',
          field: 'v1',
          name: 'v1',
          sortable: true
        },
        { label: 'Inventory Actual', align: 'left', field: 'v2', name: 'v2', sortable: true },
        { label: 'Adjustment', align: 'left', sortable: true }
        // { label: 'Order Items', align: 'left', field: 'items.length', name: 'items.length', sortable: true },
        // { label: 'Receipt', align: 'left' }
      ]
    }
  },
  methods: {

  },
  apollo: {
    Stocktakes: {
      query: () => getAll,
      variables () {
        return {
          stocktakes: true,
          stocktakeId: this.pk
        }
      },
      update: data => {
        return data.getAll.stocktakes
      }
    }
  }
}
</script>
