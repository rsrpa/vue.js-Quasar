<template>
 <q-page class="q-pa-md" >
      <q-table
        title="Maps"
        :data="templates"
        :columns="columns"
        :filter="filter"
        :pagination.sync="pagination"
      >
        <template v-slot:top="props">
          <q-btn color="primary" :to="{ name:'createTemplate'}" class="q-ml-sm q-mt-sm">Create Template</q-btn>
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
            <q-td>{{props.row.v2}}</q-td>
            <q-td>{{props.row.v1}}</q-td>
            <q-td>{{props.row.items.length}}</q-td>
            <q-td>
              <q-btn :to="{ name: 'viewTemplate', params: {pk:props.row.pk}}" flat>
                <q-tooltip >
                  View
                </q-tooltip>
                <q-icon name="search" />
              </q-btn>
              <q-btn flat :to="{ name: 'editTemplate', params: {pk:props.row.pk}}">
                <q-tooltip >
                  Edit
                </q-tooltip>
                <q-icon  name="edit"  />
              </q-btn>
              <q-btn flat @click="deleteTemplate(props.row)">
                <q-tooltip >
                  Delete
                </q-tooltip>
                <q-icon  name="delete"  />
              </q-btn>
            </q-td>
          </tr>
      </template>
      </q-table>
  </q-page>
</template>

<script>
import getAll from '../../graphql/queries/getAll'
import removeTemplate from '../../graphql/mutations/removeTemplate'

export default {
  name: 'Locations',
  mounted () {
  },
  data () {
    return {
      templates: [],
      pagination: {
        sortBy: 'v2',
        descending: false,
        page: 2,
        rowsPerPage: -1
      },
      filter: '',
      columns: [
        {
          label: 'Template Name',
          align: 'left',
          field: 'v2',
          name: 'v2',
          sortable: true
        },
        {
          label: 'Created By',
          align: 'left',
          field: 'v1',
          name: 'v1',
          sortable: true
        },
        {
          label: 'Inventory Items',
          align: 'left',
          field: row => {
            return row.items.length
          },
          name: 'items.length',
          sortable: true
        },
        { label: 'Action', align: 'left' }
      ]
    }
  },
  methods: {
    deleteTemplate (row) {
      this.$q.dialog({
        title: 'Confirm',
        message: 'Please confirm you wish to remove this template?',
        cancel: true
      }).onOk(() => {
        this.$apollo.mutate({
          mutation: removeTemplate,
          variables: {
            pk: row.pk
          }
        }).then(data => {
          this.$q.notify({
            color: 'primary',
            multiLine: false,
            message: 'Template removed',
            icon: 'info'
          })
          this.$apollo.queries.templates.refetch()
        }).catch(e => {
          console.log({ e })
          this.$q.notify({
            color: 'red',
            multiLine: false,
            message: e.graphQLErrors[0].message,
            icon: 'error'
          })
        })
      })
    }
  },
  apollo: {
    templates: {
      query: () => getAll,
      variables () {
        return {
          templates: true
        }
      },
      update: data => {
        return data.getAll.templates
      }
    }
  }
}
</script>
