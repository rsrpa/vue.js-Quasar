<template>
 <q-page class="q-pa-md" >
    <q-dialog v-model="dialog.locations" persistent>
      <q-card class="q-pa-md" style="width: 700px; max-width: 80vw;">
        <q-form ref="form"
          @submit.prevent="setLocations"
          lazy-validation
          >
        <q-card-section>
          <div class="text-h6 text-weight-light">Bulk transactions of inventory</div>
        </q-card-section>
        <q-card-section>
          <q-select
            ref="locFromObj"
            v-model="locFromObj"
            :options="Locations"
            label="Location From"
            fill-input
            option-label="v1"
            :rules="[val => !!val.pk && val.v1 !== '' || 'Location from is required']"
            />
          <q-select
            ref="locToObj"
            v-model="locToObj"
            :options="LocationsTo"
            label="Location To"
            fill-input
            option-label="v1"
            :rules="[val => !!val || 'Location to is required']"
            />
        </q-card-section>
        <q-card-actions>
            <q-btn :to="{name:'inventory'}" color="primary">
              <q-icon name="arrow_back_ios">
              </q-icon>
              Inventory
            </q-btn>
          <q-space></q-space>
          <q-btn type="submit" color="primary">Save</q-btn>
        </q-card-actions>
        </q-form>
      </q-card>
    </q-dialog>
    <q-dialog v-model="dialog.addInventory" persistent>
      <q-card class="q-pa-md" style="width: 700px; max-width: 80vw;">
        <q-form ref="form"
          @submit.prevent="addInventory"
          lazy-validation
          >
        <q-card-section>
          <div class="text-h6 text-weight-light">Add inventory to bulk transfer</div>
        </q-card-section>
        <q-card-section>
          <q-select
            ref="invObj"
            v-model="invObj"
            :options="Inventories"
            label="Inventory"
            fill-input
            :option-label="getLabel"
            :rules="[val => !!val || 'Inventory is required']"
            />
        </q-card-section>
        <q-card-actions>
            <q-btn @click="dialog.addInventory = false" color="primary">
              Close
            </q-btn>
          <q-space></q-space>
          <q-btn type="submit" color="primary">Save</q-btn>
        </q-card-actions>
        </q-form>
      </q-card>
    </q-dialog>
    <q-dialog v-model="dialog.addTemplate" persistent>
      <q-card class="q-pa-md" style="width: 700px; max-width: 80vw;">
        <q-form ref="form"
          @submit.prevent="addTemplate"
          lazy-validation
          >
        <q-card-section>
          <div class="text-h6 text-weight-light">Add a template to transfer</div>
        </q-card-section>
        <q-card-section>
          <q-select
            ref="templateObj"
            v-model="templateObj"
            :options="Templates"
            label="Template"
            fill-input
            option-label="v2"
            :rules="[val => !!val || 'Template is required']"
            />
        </q-card-section>
        <q-card-actions>
            <q-btn @click="dialog.addTemplate = false" color="primary">
              close
            </q-btn>
          <q-space></q-space>
          <q-btn type="submit" color="primary">Save</q-btn>
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
        <q-btn color="primary" @click="dialog.addTemplate = true" class="q-ml-sm q-mt-sm" >Add Template</q-btn>
        <q-btn color="primary" @click="transact()" class="q-ml-sm q-mt-sm">Transact</q-btn>
        <q-space />
        <span class=" q-ml-sm q-mt-sm text-caption font-weight-light">
          <b>From :</b> {{locFromObj.v1}}
              <br />
          <b>To :</b> {{locToObj.v1}}
        </span>
        <q-space />
        <q-input
          dense
          debounce="300"
          color="primary"
          v-model="barcode"
          ref='bc'
          @change.enter="addBarcode()"
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
          <q-td>{{props.row.location.v1}}</q-td>
          <q-td>{{props.row.v1}}</q-td>
          <q-td>
            <q-input
              :ref="props.row.pk"
              :value="props.row.transUnits"
              :rules="[val => !!val && Number.isInteger(Number(val)) && Number(val) > 0 || 'Please enter a valid number', val => parseInt(val) <= parseInt(props.row.v1) || 'Consuming more than available']"
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
    </q-table>
  </q-page>
</template>

<script>
import getAll from '../../graphql/queries/getAll'
import putInventory from '../../graphql/mutations/putInventory'
import updateInventory from '../../graphql/mutations/updateInventory'
import putTransaction from '../../graphql/mutations/putTransaction'
import createInventory from '../../graphql/mutations/createInventory'

export default {
  name: 'Bulk',
  mounted () {
    this.dialog.locations = true
    this.Bulk = []
  },
  data () {
    return {
      transError: false,
      AllInventories: [],
      LocationsTo: [],
      Locations: [],
      Inventories: [],
      Templates: [],
      templateObj: '',
      locFromObj: {
        v1: ''
      },
      locToObj: {
        v1: ''
      },
      locFrom: {
        v1: ''
      },
      invObj: '',
      dialog: {
        locations: false,
        addInventory: false,
        addTemplate: false
      },
      barcode: '',
      Bulk: [],
      locations: [],
      pagination: {
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
          field: row => {
            return row.map.v1
          },
          name: 'map.v1',
          sortable: true
        },
        { label: 'Location', align: 'left', field: 'v4', name: 'v4', sortable: true },
        { label: 'Units', align: 'left', field: 'v1', name: 'v1', sortable: true },
        { label: 'Transfering Units', align: 'left', field: 'transUnits', name: 'transUnits', sortable: true },
        { label: 'Action', align: 'left' }
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
      this.Bulk = this.Bulk.filter(x => x.pk !== row.pk)
      row.transUnits = newValue
      this.Bulk.push(row)
    },
    getLabel (x) {
      if (!x || x.length === 0) {
        return ''
      }
      return x.map.v1
    },
    setLocations () {
      this.$refs.locFromObj.validate()
      this.$refs.locToObj.validate()
      if (
        this.$refs.locFromObj.hasError ||
        this.$refs.locToObj.hasError
      ) {
        return
      }
      if (this.locFromObj.pk === this.locToObj.pk) {
        this.$q.notify({
          color: 'red',
          multiLine: false,
          message: 'Different locations are required',
          icon: 'error'
        })
        return
      }
      this.locFrom = this.locFromObj.pk
      this.dialog.locations = false
      this.focusBarcode()
    },
    addInventory () {
      const bulkInventory = this.Bulk.filter(x => x.pk === this.invObj.pk)
      if (bulkInventory.length > 0) {
        this.Bulk = this.Bulk.filter(x => x.pk !== this.invObj.pk)
        bulkInventory[0].transUnits = (bulkInventory[0].transUnits === '' || isNaN(bulkInventory[0].transUnits)) ? 1 : parseInt(bulkInventory[0].transUnits) + parseInt(bulkInventory[0].map.v4)
        this.Bulk.splice(0, 0, bulkInventory[0])
      } else {
        this.invObj.transUnits = this.invObj.map.v4
        this.Bulk.splice(0, 0, this.invObj)
      }
      this.invObj = ''
      this.dialog.addInventory = false
      this.focusBarcode()
    },
    removeInventory (row) {
      this.Bulk = this.Bulk.filter(x => x.pk !== row.pk)
      this.focusBarcode()
    },
    addBarcode () {
      if (this.barcode.charAt(0) === '~') {
        this.barcode = this.barcode.substring(1)
      }
      const inventory = this.Inventories.filter(x => x.map.supply.gsi2sk === this.barcode)
      if (inventory.length === 0) {
        this.$q.notify({
          color: 'red',
          multiLine: false,
          message: 'Barcode doesn\'t match any inventory',
          icon: 'error'
        })
        this.barcode = ''
        return
      }
      const bulkInventory = this.Bulk.filter(x => x.map.supply.gsi2sk === this.barcode)
      if (bulkInventory.length > 0) {
        this.Bulk = this.Bulk.filter(x => x.map.supply.gsi2sk !== this.barcode)
        bulkInventory[0].transUnits = parseInt(bulkInventory[0].transUnits) + parseInt(bulkInventory[0].map.v4)
        this.Bulk.splice(0, 0, bulkInventory[0])
      } else {
        inventory[0].transUnits = inventory[0].map.v4
        this.Bulk.splice(0, 0, inventory[0])
      }
      this.barcode = ''
    },
    addTemplate () {
      this.templateObj.items.map(x => {
        const inventory = this.Inventories.filter(i => i.v3 === x.gsi2sk)
        if (inventory.length > 0) {
          const bulkInventory = this.Bulk.filter(b => b.v3 === x.gsi2sk)
          const bulkIndex = this.Bulk.indexOf(this.Bulk.find(b => b.v3 === x.gsi2sk))
          if (bulkInventory.length > 0) {
            bulkInventory[0].transUnits = parseInt(bulkInventory[0].transUnits) + parseInt(x.v1)
            this.Bulk.splice(bulkIndex, 1, bulkInventory[0])
          } else {
            inventory[0].transUnits = parseInt(x.v1)
            this.Bulk.push(inventory[0])
          }
        } else {
          this.$q.notify({
            color: 'orange',
            multiLine: false,
            message: 'An Inventory item on the template was not found in this location',
            icon: 'warning'
          })
        }
      })
      this.templateObj = ''
      this.focusBarcode()
      this.dialog.addTemplate = false
    },
    async transact () {
      if (this.Bulk.length === 0) {
        this.$q.notify({
          color: 'red',
          multiLine: false,
          message: 'No inventory to transact',
          icon: 'error'
        })
        return
      }
      for (let i = 0; i < this.Bulk.length; i++) {
        const pk = this.Bulk[i].pk
        this.$refs[pk].validate()
        if (this.$refs[pk].hasError) {
          this.transError = true
        }
      }
      if (this.transError) {
        this.$q.notify({
          color: 'red',
          multiLine: false,
          message: 'Please make sure all inventory items are correct',
          icon: 'error'
        })
        this.transError = false
        return
      }
      await this.$apollo.queries.AllInventories.refetch()
      if (this.locToObj.v1 === 'Consume') {
        this.Bulk.forEach(x => {
          const inventory = this.AllInventories.filter(y => y.pk === x.pk)
          const units = parseInt(inventory[0].v1) - parseInt(x.transUnits)
          if (parseInt(inventory[0].v1) < parseInt(x.transUnits)) {
            this.$q.notify({
              color: 'red',
              multiLine: false,
              timeout: 100000,
              message: 'Inventory ' + inventory[0].map.v1 + ' was unable to be processed. Please review stock on hand',
              icon: 'error',
              actions: [
                { label: 'Dismiss', color: 'white', handler: () => { /* ... */ } }
              ]
            })
            return
          }
          const input = {
            pk: inventory[0].pk,
            v1: units,
            _version: inventory[0]._version
          }
          this.mutateUpdateInventory(input, 'Inventory consumed')
          const transInput = {
            sk: x.map.pk,
            gsi1pk: this.locFromObj.pk,
            v1: this.$store.getters['auth/isAuthenticated'].signInUserSession.idToken.payload.email,
            v2: 'consume',
            v3: x.transUnits,
            v4: this.locFromObj.pk
          }
          this.mutatePutTransaction(transInput)
        })
      } else {
        this.Bulk.forEach(x => {
          const inventoryTo = this.AllInventories.filter(y => y.gsi2pk === this.locToObj.pk && y.v3 === x.map.pk)
          if (inventoryTo.length === 0) {
            const input = {
              gsi1sk: x.map.gsi2pk,
              gsi2pk: this.locToObj.pk,
              v1: x.transUnits,
              v2: x.v2,
              v3: x.map.pk
            }
            this.mutateCreateInventory(input, 'Created Inventory')
          } else {
            const units = parseInt(inventoryTo[0].v1) + parseInt(x.transUnits)
            const input = {
              pk: inventoryTo[0].pk,
              v1: units,
              _version: inventoryTo[0]._version
            }
            this.mutateUpdateInventory(input, 'Updated Inventory')
          }

          const inventory = this.AllInventories.filter(y => y.pk === x.pk)
          const unitsLeft = parseInt(x.v1) - parseInt(x.transUnits)
          const input = {
            pk: inventory[0].pk,
            v1: unitsLeft,
            _version: inventory[0]._version
          }
          this.mutateUpdateInventory(input, 'Updated Inventory')
          const transInput = {
            sk: x.map.pk,
            gsi1pk: this.locFromObj.pk,
            v1: this.$store.getters['auth/isAuthenticated'].signInUserSession.idToken.payload.email,
            v2: 'consume',
            v3: x.transUnits,
            v4: this.locFromObj.pk
          }
          this.mutatePutTransaction(transInput)
        })
      }
      this.locFromObj = ''
      this.locToObj = {
        pk: 'Consume',
        sk: 'Consume',
        v1: 'Consume'
      }
      this.Bulk = []
      this.dialog.locations = true
      this.$router.push({ name: 'dashboard' })
    },
    mutatePutInventory (input, message) {
      this.$apollo.mutate({
        mutation: putInventory,
        variables: {
          input: input
        }
      }).then(data => {
        this.$q.notify({
          color: 'primary',
          multiLine: false,
          message: message,
          icon: 'info'
        })
      }).catch(e => {
        console.log({ e })
        this.$q.notify({
          color: 'red',
          multiLine: false,
          message: e.graphQLErrors[0].message,
          icon: 'error'
        })
      })
    },
    mutateCreateInventory (input, message) {
      this.$apollo.mutate({
        mutation: createInventory,
        variables: {
          input: input
        }
        // update: (store, { data: { createInventory } }) => {
        //   if (createInventory === undefined) {
        //     return
        //   }
        //   const data = store.readQuery({
        //     query: getAll,
        //     variables: {
        //       inventories: true
        //     }
        //   })
        //   // const dataIndex = data.getAll.inventories.indexOf(data.getAll.inventories.find((x) => x.pk === updateInventory.pk))
        //   // const editedInventory = data.getAll.inventories.find((x) => x.pk === updateInventory.pk)
        //   // editedInventory.v1 = updateInventory.v1
        //   createInventory.map = {}
        //   createInventory.location = {}
        //   createInventory._version = 1
        //   createInventory._lastChangedAt = 0
        //   data.getAll.inventories.push(createInventory)
        //   store.writeQuery({
        //     query: getAll,
        //     variables: {
        //       inventories: true
        //     },
        //     data
        //   })
        // }
      }).then(data => {
        this.$q.notify({
          color: 'primary',
          multiLine: false,
          message: message,
          icon: 'info'
        })
      }).catch(e => {
        console.log({ e })
        this.$q.notify({
          color: 'red',
          multiLine: false,
          message: e.graphQLErrors[0].message,
          icon: 'error'
        })
      })
    },
    mutateUpdateInventory (input, message) {
      this.$apollo.mutate({
        mutation: updateInventory,
        variables: {
          input: input
        }
        // update: (store, { data: { updateInventory } }) => {
        //   if (updateInventory === undefined) {
        //     return
        //   }
        //   const data = store.readQuery({
        //     query: getAll,
        //     variables: {
        //       inventories: true
        //     }
        //   })
        //   const dataIndex = data.getAll.inventories.indexOf(data.getAll.inventories.find((x) => x.pk === updateInventory.pk))
        //   const editedInventory = data.getAll.inventories.find((x) => x.pk === updateInventory.pk)
        //   editedInventory.v1 = updateInventory.v1
        //   data.getAll.inventories.splice(dataIndex, 1, editedInventory)
        //   store.writeQuery({
        //     query: getAll,
        //     variables: {
        //       inventories: true
        //     },
        //     data
        //   })
        // }
      }).then(data => {
        this.$q.notify({
          color: 'primary',
          multiLine: false,
          message: message,
          icon: 'info'
        })
      }).catch(e => {
        console.log({ e })
        this.$q.notify({
          color: 'red',
          multiLine: false,
          message: e.graphQLErrors[0].message,
          icon: 'error'
        })
      })
    },
    mutatePutTransaction (input) {
      this.$apollo.mutate({
        mutation: putTransaction,
        variables: {
          input: input
        }
      }).then(data => {
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
    AllInventories: {
      query: () => getAll,
      variables () {
        return {
          inventories: true
        }
      },
      update: data => {
        return data.getAll.inventories
      }
    },
    Inventories: {
      query: () => getAll,
      variables () {
        let params = {
          inventories: true
        }
        if (this.locFrom !== '') {
          params = {
            inventories: true,
            inventoriesLocation: this.locFrom
          }
        }
        return params
      },
      update: data => {
        return data.getAll.inventories
      }
    },
    Templates: {
      query: () => getAll,
      variables () {
        return {
          templates: true
        }
      },
      update: data => {
        return data.getAll.templates
      }
    },
    Maps: {
      query: () => getAll,
      variables () {
        return {
          maps: true
        }
      },
      update: data => {
        return data.getAll.maps
      }
    },
    Locations: {
      query: () => getAll,
      variables () {
        return {
          locations: true
        }
      },
      update: data => {
        return data.getAll.locations
      },
      result ({ data }) {
        if (data !== undefined) {
          this.LocationsTo = [...data.getAll.locations]
          const consume = {
            pk: 'Consume',
            sk: 'Consume',
            v1: 'Consume'
          }
          this.LocationsTo.push(consume)
          this.locToObj = consume
        }
      }
    }
  }
}
</script>
