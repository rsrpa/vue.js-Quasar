<template>
 <q-page class="q-pa-md" >
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
            :options="combinedInventories"
            label="Inventory"
            :option-label="getLabel"
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
      :data="order.items"
      :columns="columns"
      :pagination.sync="pagination"
      >
      <template v-slot:top="props">
        <q-btn color="primary" @click="dialog.addInventory = true" class="q-ml-sm q-mt-sm">Add Inventory</q-btn>
        <q-input
          dense
          color="primary"
          label="Order Reference"
          v-model="order.v2"
          ref='orderNum'
          class="q-ml-sm q-mt-sm"
          :rules="[val => !!val  || 'A Order reference is required']"
          >
        </q-input>
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
          <!-- <q-td>{{props.row.location.v1}}</q-td> -->
          <q-td>{{props.row.v1}}</q-td>
          <q-td>{{props.row.map.v2}}</q-td>
          <q-td>{{props.row.map.v3}}</q-td>
          <q-td>{{props.row.uom}}</q-td>
          <q-td>
              <q-btn  color="red lighten-1"   flat @click="dec(props.row)">
                <q-icon name="keyboard_arrow_down"></q-icon>
              </q-btn>
              <span>
                  {{props.row.orderUnits}}
              </span>
              <q-btn  color="green lighten-1" flat @click="inc(props.row)">
                <q-icon name="keyboard_arrow_up"></q-icon>
              </q-btn>
            <!-- <q-input
              :ref="props.row.pk"
              :value="props.row.orderUnits"
              :rules="[val => !!val && Number.isInteger(Number(val)) && Number(val) > 0 || 'Please enter a valid number', val => parseInt(val) <= parseInt(props.row.v1) || 'Consuming more than available']"
              @change.native="updateRow($event, props.row)"
              >
            </q-input> -->
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
        <q-btn color="primary" :loading="orderPlaced" @click.prevent="placeOrder()" class="q-ml-sm q-mt-sm q-mb-sm">
          <template v-slot:loading>
          <q-spinner-facebook />
        </template>
          Place Order</q-btn>
      </template>
    </q-table>
  </q-page>
</template>

<script>
import getAll from '../../graphql/queries/getAll'
import createOrder from '../../graphql/mutations/createOrder'

export default {
  name: 'Order',
  mounted () {
    this.dialog.locations = false
    this.Bulk = []
    this.focusBarcode()
  },
  data () {
    return {
      orderPlaced: false,
      invObj: {},
      combinedInventories: [],
      transError: false,
      AllInventories: [],
      LocationsTo: [],
      Locations: [],
      Inventories: [],
      Templates: [],
      templateObj: '',
      dialog: {
        locations: false,
        addInventory: false,
        addTemplate: false
      },
      barcode: '',
      order: {
        v2: '',
        items: []
      },
      locations: [],
      pagination: {
        sortBy: 'map.v1',
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
        { label: 'Stocked Units', align: 'left', field: 'v1', name: 'v1', sortable: true },
        {
          label: 'Min Units',
          align: 'left',
          field: row => {
            return row.map.v2
          },
          name: 'map.v2',
          sortable: true
        },
        {
          label: 'Max Units',
          align: 'left',
          field: row => {
            return row.map.v3
          },
          name: 'map.v3',
          sortable: true
        },
        {
          label: 'Supplier UoM Units Requested',
          align: 'left',
          field: row => {
            return row.uom
          },
          name: 'supplyUoM',
          sortable: true
        },
        { label: 'Ordering Units', align: 'left', field: 'orderUnits', name: 'orderUnits', sortable: true },
        { label: 'Action', align: 'left' }
      ]
    }
  },
  methods: {
    inc (row) {
      const inventoryIndex = this.order.items.indexOf(this.order.items.find((x) => x.pk === row.pk))
      const editedInventory = this.order.items.find((x) => x.pk === row.pk)
      if (editedInventory.orderUnits >= editedInventory.map.v3) {
        this.$q.notify({
          color: 'primary',
          multiLine: false,
          message: 'Maximum stock for this product set to ' + editedInventory.map.v3,
          icon: 'info'
        })
        return
      }
      editedInventory.orderUnits = editedInventory.orderUnits + parseInt(editedInventory.map.v5)
      editedInventory.uom = Math.round(parseInt(editedInventory.orderUnits) / parseInt(editedInventory.map.v5))
      this.order.items.splice(inventoryIndex, 1, editedInventory)
    },
    dec (row) {
      const inventoryIndex = this.order.items.indexOf(this.order.items.find((x) => x.pk === row.pk))
      const editedInventory = this.order.items.find((x) => x.pk === row.pk)
      if (editedInventory.orderUnits <= editedInventory.map.v2) {
        this.$q.notify({
          color: 'primary',
          multiLine: false,
          message: 'Minimum stock for this product set to ' + editedInventory.map.v2,
          icon: 'info'
        })
        return
      }
      editedInventory.orderUnits = editedInventory.orderUnits - parseInt(editedInventory.map.v5)
      editedInventory.uom = Math.round(parseInt(editedInventory.orderUnits) / parseInt(editedInventory.map.v5))
      this.order.items.splice(inventoryIndex, 1, editedInventory)
    },
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
      if (x === undefined) {
        return ''
      }
      if (!x.map || x.length === 0) {
        return ''
      }
      return x.map.v1
    },
    addInventory () {
      if ((parseInt(this.invObj.map.v3) % parseInt(this.invObj.map.v5)) === 0) {
        this.invObj.orderUnits = parseInt(this.invObj.map.v3)
        this.invObj.uom = Math.round(parseInt(this.invObj.orderUnits) / parseInt(this.invObj.map.v5))
      } else {
        this.invObj.orderUnits = Math.floor(parseInt(this.invObj.map.v3) / parseInt(this.invObj.map.v5)) * parseInt(this.invObj.map.v5)
        this.invObj.uom = Math.round(parseInt(this.invObj.orderUnits) / parseInt(this.invObj.map.v5))
      }
      this.order.items.push(this.invObj)
      this.combinedInventories = this.combinedInventories.filter(x => x.pk !== this.invObj.pk)
      this.invObj.transUnits = this.invObj.map.v4
      this.invObj = ''
      this.dialog.addInventory = false
      this.focusBarcode()
    },
    removeInventory (row) {
      this.order.items = this.order.items.filter(x => x.pk !== row.pk)
      this.combinedInventories.push(row)
      this.focusBarcode()
    },
    addBarcode () {
      if (this.barcode.charAt(0) === '~') {
        this.barcode = this.barcode.substring(1)
      }
      const totalInventory = this.Inventories.filter(x => x.map.supply.gsi2sk.toLowerCase() === this.barcode.toLowerCase())
      if (totalInventory.length === 0) {
        this.$q.notify({
          color: 'red',
          multiLine: false,
          message: 'Barcode doesn\'t match any inventory',
          icon: 'error'
        })
        this.barcode = ''
        return
      }
      const inventoryInOrder = this.order.items.filter(x => x.map.supply.gsi2sk.toLowerCase() === this.barcode.toLowerCase())
      if (inventoryInOrder.length > 0) {
        this.$q.notify({
          color: 'red',
          multiLine: false,
          message: 'Inventory already on order',
          icon: 'error'
        })
        this.barcode = ''
        return
      }
      if (totalInventory.length === 1) {
        totalInventory[0].orderUnits = (parseInt(totalInventory[0].map.v3) - parseInt(totalInventory[0].v1)) > 0 ? (parseInt(totalInventory[0].map.v3) - parseInt(totalInventory[0].v1)) : parseInt(totalInventory[0].map.v3)
        totalInventory[0].uom = Math.round(parseInt(totalInventory[0].orderUnits) / parseInt(totalInventory[0].map.v5))
        this.order.items.push(totalInventory[0])
      } else {
        totalInventory[0].orderUnits = (parseInt(totalInventory[0].map.v3) - parseInt(totalInventory[0].v1)) > 0 ? (parseInt(totalInventory[0].map.v3) - parseInt(totalInventory[0].v1)) : parseInt(totalInventory[0].map.v3)
        totalInventory[0].uom = Math.round(parseInt(totalInventory[0].orderUnits) / parseInt(totalInventory[0].map.v5))
        this.order.items.push(totalInventory[0])
      }
      this.barcode = ''
    },
    placeOrder () {
      this.orderPlaced = true
      this.$refs.orderNum.validate()
      if (
        this.$refs.orderNum.hasError
      ) {
        this.orderPlaced = false
        return
      }
      if (this.order.items.length === 0) {
        this.$q.notify({
          color: 'red',
          multiLine: false,
          message: 'No inventory on order',
          icon: 'error'
        })
        this.orderPlaced = false
        return
      }
      const items = []
      this.order.items.forEach(x => {
        items.push({
          gsi2sk: x.v3,
          pk: false, // this is just a place holder for the backend lambda to put order item recieved to false
          v1: x.orderUnits,
          v2: x.map.supply.v2,
          v3: x.map.supply.v1,
          v4: x.map.supply.v3,
          v5: Math.round(parseInt(x.orderUnits) / parseInt(x.map.v5))
        })
      })
      const input = {
        v1: this.$store.getters['auth/isAuthenticated'].signInUserSession.idToken.payload.email,
        v2: this.order.v2,
        items: items
      }
      this.$apollo.mutate({
        mutation: createOrder,
        variables: {
          input: input
        }
      }).then(data => {
        this.$q.notify({
          color: 'primary',
          multiLine: false,
          message: 'Order placed',
          icon: 'info'
        })
        this.$router.push({ name: 'orders' })
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
    ComputedInventory: {
      query: () => getAll,
      variables () {
        return {
          inventories: true
        }
      },
      update: data => {
        return data.getAll.inventories
      },
      result ({ data }) {
        if (data !== undefined) {
          const temp = data.getAll.inventories.map(x => ({ ...x }))
          const combinedInventoryUnits = temp.reduce((prev, curr) => {
            prev.get(curr.v3) === undefined ? curr.v1 = parseInt(curr.v1) : curr.v1 = parseInt(curr.v1) + parseInt(prev.get(curr.v3).v1)
            prev.set(curr.v3, curr)
            return prev
          }, new Map())
          // then, map your counts object back to an array
          const reducedObjArr = [...combinedInventoryUnits].map(([key, value]) => {
            return value
          })
          if (reducedObjArr.length > 0) {
            this.combinedInventories = reducedObjArr
            this.order.items = []
            this.combinedInventories = this.combinedInventories.filter(x => {
              if (parseInt(x.v1) < parseInt(x.map.v2)) {
                if ((parseInt(x.map.v3) % parseInt(x.map.v5)) === 0) {
                  x.orderUnits = (parseInt(x.map.v3) - parseInt(x.v1)) > 0 ? (parseInt(x.map.v3) - parseInt(x.v1)) : parseInt(x.map.v3)
                  x.uom = Math.round(parseInt(x.orderUnits) / parseInt(x.map.v5))
                } else {
                  x.orderUnits = Math.floor((parseInt(x.map.v3) - parseInt(x.v1)) / parseInt(x.map.v5)) * parseInt(x.map.v5)
                  x.uom = Math.round(parseInt(x.orderUnits) / parseInt(x.map.v5))
                }
                this.order.items.push(x)
                return false
              }
              return true
            })
          }
        }
      }
    },
    Inventories: {
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
    }
  }
}
</script>
