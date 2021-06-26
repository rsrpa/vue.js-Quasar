<template>
 <q-page class="q-pa-md" >
    <q-table
      title="Users"
      :data="Stocktakes"
      :columns="columns"
      :pagination.sync="pagination"
      :filter="filter"
      >
      <template v-slot:top="props">
        <!-- <q-btn color="primary" :to="{name: 'create'}" class="q-ml-sm q-mt-sm">Create Order</q-btn> -->
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
        <tr >
          <q-td>{{new Date(props.row.gsi1sk)}}</q-td>
          <!-- <q-td>{{props.row.location.v1}}</q-td> -->
          <q-td>{{props.row.v1}}</q-td>
          <q-td>{{props.row.items.length}}</q-td>
          <q-td>
            <q-btn flat :to="{name:'viewstocktake',params:{ pk: props.row.pk }}">
              <q-tooltip >
                Receipt
              </q-tooltip>
            <q-icon  name="search"  />
            </q-btn>
          </q-td>
        </tr>
      </template>
    </q-table>
  </q-page>
</template>

<script>
import getAll from '../../../graphql/queries/getAll'

export default {
  name: 'Stocktakes',
  mounted () {
    this.dialog.locations = false
    this.Bulk = []
  },
  data () {
    return {
      Stocktakes: [],
      Inventories: [],
      dialog: {
        locations: false,
        addInventory: false,
        addTemplate: false
      },
      pagination: {
        sortBy: 'gsi1sk',
        descending: true,
        page: 1,
        rowsPerPage: 10
      },
      filter: '',
      columns: [
        { label: 'Date', align: 'left', field: 'gsi1sk', name: 'gsi1sk', sortable: true },
        {
          label: 'Completed By',
          align: 'left',
          field: 'v1',
          name: 'v1',
          sortable: true
        },
        { label: 'Stocktake items', align: 'left', field: 'items.length', name: 'items.length', sortable: true },
        { label: 'Veiw', align: 'left' }
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
          stocktakes: true
        }
      },
      update: data => {
        return data.getAll.stocktakes
      }
    }
  }
}
</script>
