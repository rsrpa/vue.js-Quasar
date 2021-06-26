<template>
 <q-page class="q-pa-md" >
      <q-table
        v-if="transactions"
        title="Transactions"
        :data="transactions"
        :columns="columns"
        :filter="filter"
        :pagination.sync="pagination"
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
          <tr >
            <q-td>{{new Date(parseInt(props.row.gsi2sk))}}</q-td>
            <q-td>{{props.row.v1}}</q-td>
            <q-td>{{props.row.map.v1}}</q-td>
            <q-td>{{props.row.v2}}</q-td>
            <q-td>{{props.row.v3}}</q-td>
            <q-td>{{props.row.locationFrom.v1}}</q-td>
            <q-td>{{ props.row.locationTo ? props.row.locationTo.v1 : ''}}</q-td>

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
      transactions: [],
      pagination: {
        sortBy: 'gsi2sk',
        descending: true,
        page: 1,
        rowsPerPage: 10
      },
      filter: '',
      columns: [
        { label: 'Date', align: 'left', field: 'gsi2sk', name: 'gsi2sk', sortable: true },
        { label: 'User', align: 'left', field: 'v1', name: 'v1', sortable: true },
        {
          label: 'Inventory',
          align: 'left',
          field: row => {
            return row.map.v1
          },
          name: 'map.v1',
          sortable: true
        },
        { label: 'Transaction Type', align: 'left', field: 'v2', name: 'v2', sortable: true },
        { label: 'Units', align: 'left', field: 'v3', name: 'v3', sortable: true },
        {
          label: 'Location',
          align: 'left',
          field: row => {
            return row.locationFrom.v1
          },
          name: 'locationFrom.v1',
          sortable: true
        },
        {
          label: 'Transfer Location',
          align: 'left',
          field: row => {
            return row.locationTo ? row.locationTo.v1 : ''
          },
          name: 'locationTo.v1'
        }
      ]
    }
  },
  apollo: {
    transactions: {
      query: () => getAll,
      variables () {
        return {
          transactions: true,
          transactionsLimit: 2500
        }
      },
      update: data => {
        return data.getAll.transactions
      }
    }
  }
}
</script>
