<template>
 <q-page class="q-pa-md" >
      <q-table
        v-if="maps"
        title="Maps"
        :data="maps"
        :columns="columns"
        :filter="filter"
        :pagination.sync="pagination"
      >
        <template v-slot:top="props">
          <q-btn color="primary" :to="{ name:'createMap'}" class="q-ml-sm q-mt-sm">Create Map</q-btn>
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
            <q-td>
              <q-btn :to="{ name: 'editMap', params: {pk:props.row.pk}}" flat>
                <q-tooltip >
                  Edit
                </q-tooltip>
                <q-icon name="edit" />
              </q-btn>
            </q-td>
            <q-td>{{props.row.v1}}</q-td>
            <q-td>
              {{props.row.supply.v2}}
            </q-td>
            <q-td>{{props.row.supply.gsi2sk}}</q-td>
            <q-td>{{props.row.v5}}</q-td>
            <q-td>{{props.row.v4}}</q-td>
            <q-td>{{props.row.v2}}</q-td>
            <q-td>{{props.row.v3}}</q-td>

          </tr>
      </template>
      </q-table>
  </q-page>
</template>

<script>
import getAll from '../../../graphql/queries/getAll'
export default {
  name: 'Maps',
  mounted () {
  },
  data () {
    return {
      maps: [],
      pagination: {
        sortBy: 'v1',
        descending: false,
        rowsPerPage: 10
      },
      filter: '',
      columns: [
        { label: 'Action', align: 'left' },
        { label: 'Company Name', align: 'left', field: 'v1', name: 'v1', sortable: true },
        {
          label: 'Supply Name',
          align: 'left',
          field: row => {
            return row.supply.v2
          },
          name: 'supply.v2',
          sortable: true
        },
        {
          label: 'Barcode',
          align: 'left',
          field: row => {
            return row.supply.gsi2sk
          },
          name: 'supply.gsi2pk',
          sortable: true
        },
        { label: 'Stocked UOM', align: 'left', field: 'v5', name: 'v5', sortable: true },
        { label: 'Consume Rate', align: 'left', field: 'v4', name: 'v4', sortable: true },
        { label: 'Min stock', align: 'left', field: 'v2', name: 'v2', sortable: true },
        { label: 'Max stock', align: 'left', field: 'v3', name: 'v3', sortable: true }
      ]
    }
  },
  apollo: {
    maps: {
      query: () => getAll,
      variables () {
        return {
          mapsTypeR: true
        }
      },
      update: data => {
        data.getAll.mapsTypeR.items.map(x => {
          if (x.supply === null) {
            console.log(x)
          }
        })
        return data.getAll.mapsTypeR.items
      }
    }
  }
}
</script>
