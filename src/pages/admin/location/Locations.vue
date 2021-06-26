<template>
 <q-page class="q-pa-md" >
      <q-table
        v-if="locations"
        title="Users"
        :data="locations"
        :columns="columns"
        :filter="filter"
        :pagination.sync="pagination"
      >
        <template v-slot:top="props">
          <q-btn color="primary" :to="{ name:'createLocation'}" class="q-ml-sm q-mt-sm">Create Location</q-btn>
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
            <q-td>{{props.row.v1}}</q-td>
            <q-td>
              <q-btn :to="{ name: 'editLocation', params: {pk:props.row.pk}}" flat>
                <q-tooltip >
                  Edit
                </q-tooltip>
                <q-icon name="edit" />
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
  name: 'Locations',
  mounted () {
  },
  data () {
    return {
      locations: [],
      pagination: {
        sortBy: 'v1',
        descending: false,
        page: 2,
        rowsPerPage: -1
      },
      filter: '',
      columns: [
        { label: 'Location', align: 'left', field: 'v1', name: 'v1', sortable: true },
        { label: 'Action', align: 'left' }
      ]
    }
  },
  apollo: {
    locations: {
      query: () => getAll,
      variables () {
        return {
          locations: true,
          supplyAmtech: false
        }
      },
      update: data => {
        return data.getAll.locations
      }
    }
  }
}
</script>
