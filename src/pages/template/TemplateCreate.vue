<template>
 <q-page class="q-pa-md" >
    <q-dialog v-model="dialog.addInventory" persistent>
      <q-card class="q-pa-md" style="width: 700px; max-width: 80vw;">
        <q-form ref="form"
          @submit.prevent="addInventory"
          lazy-validation
          >
        <q-card-section>
          <div class="text-h6 text-weight-light">Add inventory to template</div>
        </q-card-section>
        <q-card-section>
          <q-select
            ref="invObj"
            v-model="invObj"
            :options="UniqueInventories"
            label="Inventory"
            option-label="companyName"
            :rules="[val => !!val || 'Inventory is required']"
            />
        </q-card-section>
        <q-card-actions>
            <q-btn @click="dialog.addInventory = false" color="primary">
              Close
            </q-btn>
          <q-space></q-space>
          <q-btn type="submit" color="primary">Add</q-btn>
        </q-card-actions>
        </q-form>
      </q-card>
    </q-dialog>
      <q-table
        title="Users"
        :data="Bulk"
        :columns="columns"
        :pagination.sync="pagination"
      >
        <template v-slot:top="props">
          <q-btn color="primary" @click="dialog.addInventory = true" class="q-ml-sm q-mt-sm">Add Inventory</q-btn>
            <q-input
              dense
              color="primary"
              label="Template Name"
              v-model="templateName"
              ref='templateName'
              class="q-ml-sm q-mt-sm"
              :rules="[val => !!val  || 'A Template Name is required']"
              >
            </q-input>
          <q-space />
          <q-input
            dense
            debounce="300"
            color="primary"
            v-model="barcode"
            ref='bc'
            @keydown.enter="addBarcode()"
            >
            <template v-slot:append>
              <q-icon name="qr_code_scanner" />
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
            <q-td>
              <q-input
                :value="props.row.transUnits"
                :rules="[val => !!val && Number.isInteger(Number(val))  && Number(val) > 0  || 'Please enter a valid number']"
                @change.native="updateRow($event, props.row)"
                >
              </q-input>
            </q-td>
            <q-td>
              <q-btn flat @click="removeInventory(props.row)">
                <q-tooltip >
                  Remove
                </q-tooltip>
                <q-icon  name="delete"  />
              </q-btn>
            </q-td>
          </tr>
        </template>
        <template v-slot:bottom>
          <q-space />
          <q-btn color="primary" @click="createTemplate" class="q-ml-sm q-mt-sm q-mb-sm">Create Template</q-btn>
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
    this.Bulk = []
    this.focusBarcode()
  },
  data () {
    return {
      templateName: '',
      invObj: '',
      skip: true,
      Locations: [],
      UniqueInventories: [],
      dialog: {
        addInventory: false
      },
      barcode: '',
      Bulk: [],
      locations: [],
      pagination: {
        sortBy: 'v5',
        descending: false,
        page: 2,
        rowsPerPage: -1
      },
      filter: '',
      columns: [
        { label: 'Barcode', align: 'left', field: 'gsi1sk', name: 'gsi1sk', sortable: true },
        {
          label: 'Name',
          align: 'left',
          field: 'v5',
          name: 'v5',
          sortable: true
        },
        { label: 'Transfering Units', align: 'left', field: 'transUnits', name: 'transUnits', sortable: true },
        { label: 'Remove', align: 'left' }
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
    removeInventory (row) {
      this.Bulk = this.Bulk.filter(x => x.pk !== row.pk)
      this.focusBarcode()
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
      // console.log(this.Bulk)
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
    UniqueInventories: {
      query: () => getAll,
      variables () {
        return {
          inventories: true
        }
      },
      update: data => {
        const uniqueIds = []
        const uniqueInventoriesObj = data.getAll.inventories.filter(x => {
          if (uniqueIds.includes(x.v3)) {
            return false
          }
          x.companyName = x.map.v1
          uniqueIds.push(x.v3)
          return true
        })
        return uniqueInventoriesObj
      }
    }

  }
}
</script>
