<template>
 <q-page class="q-pa-md" >
      <q-table
        title="Users"
        :data="Supplies.getAll.supplyTypeR.items"
        :loading="loading"
        :columns="columns"
        :filter="filter"
        :pagination.sync="pagination"
      >
        <template v-slot:top="props">
          <q-btn color="primary" :to="{ name:'createSupply'}" class="q-ml-sm q-mt-sm">Create Managed Supply Unit</q-btn>
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
              <q-btn v-if="!props.row.gsi1pk.startsWith('amtech#')" flat @click="navigate(props.row.pk)">
                <q-tooltip >
                  Edit
                </q-tooltip>
                <q-icon  name="edit"  />
              </q-btn>
              <q-btn v-if="!props.row.gsi1pk.startsWith('amtech#')" flat @click="removeSupply(props.row)">
                <q-tooltip >
                  Delete
                </q-tooltip>
                <q-icon  name="delete"  />
              </q-btn>
            </q-td>
            <q-td>{{props.row.v1}}</q-td>
            <q-td>{{props.row.v2}}</q-td>
            <q-td>{{props.row.gsi2sk}}</q-td>
            <!-- <q-td v-if="gsi1pk === 'amtech#'+$store.getters['auth/isAuthenticated'].signInUserSession.idToken.payload['cognito:groups'].filter(g => g !=='admin')[0]">{{props.row.gsi1pk}}</q-td> -->
            <q-td>{{props.row.v3}}</q-td>
          </tr>
      </template>
      </q-table>
  </q-page>
</template>

<script>
import getAll from '../../../graphql/queries/getAll'
import removeSupply from '../../../graphql/mutations/removeSupply'
export default {
  name: 'Supplies',
  created () {
  },
  mounted () {
    this.$apollo.queries.Supplies.setOptions({
      fetchPolicy: 'network-only'
    })
  },
  data () {
    return {
      loading: true,
      Supplies: {
        getAll: {
          supplyTypeR: {
            items: []
          }
        }
      },
      Slippery: [],
      pagination: {
        sortBy: 'v1',
        descending: false,
        page: 1,
        rowsPerPage: 10
      },
      filter: '',
      columns: [
        { label: 'Action', align: 'left' },
        { label: 'SKU', align: 'left', field: 'v1', name: 'v1', sortable: true },
        { label: 'Product Name', align: 'left', field: 'v2', name: 'v2', sortable: true },
        { label: 'Bar Code', align: 'left', field: 'gsi2sk', name: 'gsi2sk', sortable: true },
        // { label: 'Managed by', align: 'left', field: 'gsi1pk', name: 'gsi1pk', sortable: true },
        { label: 'Supplier', align: 'left', field: 'v3', name: 'v3', sortable: true }
      ]
    }
  },
  methods: {
    navigate (id) {
      this.$router.push({ name: 'editSupply', params: { pk: id } })
    },
    removeSupply (row) {
      this.$apollo.mutate({
        mutation: removeSupply,
        variables: {
          input: {
            pk: row.pk,
            _version: row._version
          }
        },
        update: (store, { data: { removeSupply } }) => {

        }
      }).then(data => {
        this.location = ''
        this.$q.notify({
          color: 'primary',
          multiLine: false,
          message: 'Supply removed',
          icon: 'info'
        })
        this.$apollo.queries.Supplies.refetch()
      }).catch(e => {
        console.log({ e })
        this.$q.notify({
          color: 'red',
          multiLine: false,
          message: e.graphQLErrors[0].message,
          icon: 'error'
        })
      })
    }
  },
  apollo: {
    Supplies: {
      query: () => getAll,
      variables: {
        supplyTypeR: true,
        supplyNextToken: null
      },
      update: data => {
        return data
      },
      async result ({ data, loading }) {
        if (!loading) {
          this.loading = false
          if (data.getAll.supplyTypeR.nextToken !== null) {
            this.loading = true
            // todo https://github.com/apollographql/apollo-client/issues/4114 wrap fetch more in a try catch
            try {
              await this.$apollo.queries.Supplies.fetchMore({
                variables: {
                  supplyTypeR: true,
                  supplyNextToken: data.getAll.supplyTypeR.nextToken
                },
                updateQuery: (previousResult, { fetchMoreResult }) => {
                  return {
                    getAll: {
                      __typename: previousResult.getAll.__typename,
                      supplyTypeR: {
                        __typename: previousResult.getAll.supplyTypeR.__typename,
                        items: [...previousResult.getAll.supplyTypeR.items, ...fetchMoreResult.getAll.supplyTypeR.items],
                        nextToken: fetchMoreResult.getAll.supplyTypeR.nextToken
                      }
                    }
                  }
                }
              })
            } catch (e) {
            }
          }
        }
      }
    }
  }
}
</script>
