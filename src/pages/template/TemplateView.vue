<template>
 <q-page class="q-pa-md" >
      <q-table
        title="Users"
        :data="template[0].items"
        :columns="columns"
        :pagination.sync="pagination"
        :filter="filter"
      >
        <template v-slot:top="props">
          <span class="text-weight-thin text-h5">Template : {{template[0].v2}}</span>
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
            <q-td>{{props.row.map.supply.gsi2sk}}</q-td>
            <q-td>{{props.row.map.v1}}</q-td>
            <q-td>{{props.row.v1}}</q-td>
          </tr>
      </template>
      </q-table>
  </q-page>
</template>

<script>
import getAll from '../../graphql/queries/getAll'
import createTemplate from '../../graphql/mutations/createTemplate'
export default {
  name: 'Bulk',
  mounted () {
  },
  props: [
    'pk'
  ],
  data () {
    return {
      template: [{}],
      Locations: [],
      pagination: {
        sortBy: 'v5',
        descending: false,
        page: 2,
        rowsPerPage: -1
      },
      filter: '',
      columns: [
        {
          label: 'Barcode',
          align: 'left',
          field: row => {
            return row.map.supply.gsi2sk
          },
          name: 'gsi1sk',
          sortable: true
        },
        {
          label: 'Name',
          align: 'left',
          field: row => {
            return row.map.v1
          },
          name: 'v5',
          sortable: true
        },
        { label: 'Transfering Units', align: 'left', field: 'transUnits', name: 'transUnits', sortable: true }
      ]
    }
  },
  methods: {
    focusBarcode () {
      this.$nextTick(() => {
        this.$refs.bc.focus()
      })
    },
    updateRow (event, row) {
      const newValue = event.target.value
      const bulkIndex = this.Bulk.indexOf(this.Bulk.find((x) => x.pk === row.pk))
      const editedInventory = this.Bulk.find((x) => x.pk === row.pk)
      editedInventory.transUnits = newValue
      this.Bulk.splice(bulkIndex, 1, editedInventory)
    },
    addInventory () {
      const bulkInventory = this.Bulk.filter(x => x.pk === this.invObj.pk)
      if (bulkInventory.length > 0) {
        this.Bulk = this.Bulk.filter(x => x.pk !== this.invObj.pk)
        bulkInventory[0].transUnits = (bulkInventory[0].transUnits === '' || isNaN(bulkInventory[0].transUnits)) ? 1 : parseInt(bulkInventory[0].transUnits) + parseInt(bulkInventory[0].map.v4)
        this.Bulk.push(bulkInventory[0])
      } else {
        this.invObj.transUnits = this.invObj.map.v4
        this.Bulk.push(this.invObj)
      }
      this.invObj = ''
      this.dialog.addInventory = false
    },
    addBarcode () {
      if (this.barcode.charAt(0) === '~') {
        this.barcode = this.barcode.substring(1)
      }
      const inventory = this.UniqueInventories.filter(x => x.map.supply.gsi2sk === this.barcode)
      if (inventory.length === 0) {
        this.$q.notify({
          color: 'red',
          multiLine: false,
          message: 'Barcode doesn\'t match any inventory',
          icon: 'error'
        })
        return
      }
      const bulkInventory = this.Bulk.filter(x => x.map.supply.gsi2sk === this.barcode)
      if (bulkInventory.length > 0) {
        this.Bulk = this.Bulk.filter(x => x.map.supply.gsi2sk !== this.barcode)
        bulkInventory[0].transUnits = (bulkInventory[0].transUnits === '' || isNaN(bulkInventory[0].transUnits)) ? 1 : parseInt(bulkInventory[0].transUnits) + parseInt(bulkInventory[0].map.v4)
        this.Bulk.push(bulkInventory[0])
      } else {
        inventory[0].transUnits = inventory[0].map.v4
        this.Bulk.push(inventory[0])
      }
    },
    createTemplate () {
      this.$refs.templateName.validate()
      if (
        this.$refs.templateName.hasError
      ) {
        return
      }
      if (this.Bulk.length === 0) {
        this.$q.notify({
          color: 'red',
          multiLine: false,
          message: 'Add inventory before creating template',
          icon: 'error'
        })
        return
      }
      const items = []
      this.Bulk.map(x => {
        items.push({
          gsi2sk: x.v3,
          v1: x.transUnits
        })
      })
      const input = {
        v2: this.templateName,
        v1: this.$store.getters['auth/isAuthenticated'].signInUserSession.idToken.payload.email,
        items: items
      }
      this.$apollo.mutate({
        mutation: createTemplate,
        variables: {
          input: input
        }
      }).then(data => {
        this.$q.notify({
          color: 'primary',
          multiLine: false,
          message: 'Template created',
          icon: 'info'
        })
        this.$router.push({ name: 'template' })
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
    template: {
      query: () => getAll,
      variables () {
        return {
          templates: true,
          templateId: this.pk
        }
      },
      update: data => {
        return data.getAll.templates
      }
    }

  }
}
</script>
