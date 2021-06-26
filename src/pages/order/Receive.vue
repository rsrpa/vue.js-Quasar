<template>
 <q-page class="q-pa-md" >
      <q-dialog v-model="dialog.barcode" persistent>
      <q-card class="q-pa-md" style="width: 700px; max-width: 80vw;">
        <q-form ref="form"
          lazy-validation
          >
        <q-card-section>
          <div class="text-h6 text-weight-light">{{bcform.inventory.map.v1}}</div>
          <div class="muted">Amount ordered: <b>{{bcform.inventory.v1}}</b> </div>
        </q-card-section>
        <q-card-section style="overflow: auto;" >
          <q-form lazy-validation v-on:submit.prevent="receiveItem()">
            <q-input label="Received Amount" ref='bcformNumber' type="number" v-model="bcform.number"  ></q-input>
          </q-form>
        </q-card-section>
        <q-card-actions>
          <q-btn  @click="closeBarcodeDialog()" color="primary">close</q-btn>
          <q-space></q-space>
          <q-btn @click="receiveItem()" color="primary">Receive</q-btn>
        </q-card-actions>
        </q-form>
      </q-card>
    </q-dialog>
    <q-table
      title="Users"
      :data="Orders.items"
      :columns="columns"
      :loading="loading"
      :pagination.sync="pagination"
      :filter="filter"
      >
      <template v-slot:top="props">
        <q-select
          ref="locObj"
          v-model="locObj"
          :options="Locations"
          label="Location"
          fill-input
          option-label="v1"
          :rules="[val => !!val || 'Location from is required']"
          style="min-width:125px"
          />
          <q-btn color="primary" @click="setAll()" class="q-ml-sm q-mt-sm" >Set All</q-btn>
          <q-btn color="primary" @click="receiveAll()" class="q-ml-sm q-mt-sm" >Receive All</q-btn>
        <q-space />
        <q-input
          dense
          debounce="300"
          color="primary"
          v-model="barcode"
          ref='bc'
          @change.enter="receiveBarcode()"
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
        <tr :class="props.row.v2 === 'true' ? 'bg-green-1':''" >
          <q-td>{{props.row.map.supply.gsi2sk}}</q-td>
          <q-td>{{props.row.map.v1}}</q-td>
          <q-td>
            <q-select
              v-if="props.row.v2 !== 'true'"
              :ref="'loc#'+props.row.pk"
              v-model="props.row.v5"
              :options="Locations"
              label="Location"
              fill-input
              option-label="v1"
              :rules="[val => !!val || 'Location from is required']"
              />
          </q-td>
          <q-td>{{props.row.v1}}</q-td>
          <q-td>
            <q-input
              v-if="props.row.v2 !== 'true'"
              :ref="'units#'+props.row.pk"
              :value="props.row.unitsReceived"
              :rules="[val => !!val && Number.isInteger(Number(val)) && Number(val) > 0 || 'Please enter a valid number']"
              @change.native="updateRow($event, props.row)"
              >
            </q-input>
            <span v-if="props.row.v2 === 'true'">
              {{props.row.v3 }}
            </span>
          </q-td>
          <q-td>
            <q-btn v-if="props.row.v2 !== 'true'" flat @click="receiveIndividual(props.row)">
              <q-tooltip >
                Receive
              </q-tooltip>
            <q-icon  name="check"  />
            </q-btn>
          </q-td>
        </tr>
      </template>
    </q-table>
  </q-page>
</template>

<script>
import getAll from '../../graphql/queries/getAll'
import updateInventory from '../../graphql/mutations/updateInventory'
import putTransaction from '../../graphql/mutations/putTransaction'
import createInventory from '../../graphql/mutations/createInventory'
import updateOrderItem from '../../graphql/mutations/updateOrderItem'
import receiveOrder from '../../graphql/mutations/receiveOrder'

export default {
  name: 'Receive',
  mounted () {
    this.focusBarcode()
  },
  props: [
    'pk'
  ],
  data () {
    return {
      barcode: '',
      bcform: {
        number: '',
        inventory: {
          map: {
            v1: ''
          },
          location: {
            v1: ''
          },
          v1: ''
        }
      },
      loading: false,
      errors: false,
      Locations: [],
      Orders: {},
      locObj: '',
      Inventories: [],
      dialog: {
        locations: false,
        addInventory: false,
        addTemplate: false,
        barcode: false
      },
      pagination: {
        sortBy: 'map.v1',
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
          name: 'gsi2sk',
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
        {
          label: 'Location',
          align: 'left',
          sortable: true
        },
        { label: 'Order Units', align: 'left', field: 'v1', name: 'v1', sortable: true },
        { label: 'Received Units', align: 'left', field: 'v3', name: 'v3', sortable: true },
        { label: 'Action', align: 'left' }
      ]
    }
  },
  methods: {
    focusBarcodeNumber () {
      this.$nextTick(() => {
        this.$refs.bcformNumber.focus()
      })
    },
    focusBarcode () {
      this.$nextTick(() => {
        this.$refs.bc.focus()
      })
    },
    closeBarcodeDialog () {
      this.bcform.number = ''
      this.bcform.inventory = {
        map: {
          v1: ''
        },
        location: {
          v1: ''
        },
        v1: ''
      }
      this.dialog.barcode = false
    },
    receiveItem () {
      this.bcform.inventory.unitsReceived = this.bcform.number
      this.receiveIndividual(this.bcform.inventory)
      this.closeBarcodeDialog()
      // console.log(this.bcform.inventory)
    },
    receiveBarcode () {
      if (this.barcode.charAt(0) === '~') {
        this.barcode = this.barcode.substring(1)
      }
      const barcodeFilter = this.Orders.items.filter(x => x.map.supply.gsi2sk.toLowerCase() === this.barcode.toLowerCase())
      if (barcodeFilter.length === 0) {
        this.$q.notify({
          color: 'red',
          multiLine: false,
          message: 'Barcode doesn\'t match any inventory on this order',
          icon: 'error'
        })
        this.barcode = ''
        return
      }
      if (barcodeFilter[0].v5 === null) {
        this.$q.dialog({
          title: 'Select location',
          message: 'No location set to receive product, please select location.',
          options: {
            type: 'radio',
            model: 'opt1',
            items: this.Locations.map(x => {
              return {
                label: x.v1,
                value: x
              }
            })
          },
          cancel: true,
          persistent: true
        }).onOk(data => {
          barcodeFilter[0].v5 = data
          this.bcform.inventory = barcodeFilter[0]
          this.bcform.number = this.bcform.inventory.v1
          this.dialog.barcode = true
          this.focusBarcodeNumber()
        })
      } else {
        this.bcform.inventory = barcodeFilter[0]
        this.bcform.number = this.bcform.inventory.v1
        this.dialog.barcode = true
        this.focusBarcodeNumber()
      }
      this.barcode = ''
    },
    updateRow (event, row) {
      const newValue = event.target.value
      const IndexItem = this.Orders.items.indexOf(this.Orders.items.find((x) => x.pk === row.pk))
      const editedInventory = this.Orders.items.find((x) => x.pk === row.pk)
      this.$set(editedInventory, 'unitsReceived', newValue)
      this.Orders.items.splice(IndexItem, 1, editedInventory)
    },
    getLabel (x) {
      if (!x.map || x.length === 0) {
        return ''
      }
      return x.map.v1
    },
    setAll () {
      this.$refs.locObj.validate()
      if (
        this.$refs.locObj.hasError
      ) {
        return
      }
      this.Orders.items = this.Orders.items.map(x => {
        this.$set(x, 'v5', this.locObj)
        this.$set(x, 'unitsReceived', x.v1)
        return x
      })
    },
    async receiveAll () {
      this.$q.loading.show()
      await this.$apollo.queries.Inventories.refetch()
      const OrderItems = this.Orders.items.filter(x => {
        if (x.v2 === 'true') {
          return false
        }
        const locRef = 'loc#' + x.pk
        const unitsRef = 'units#' + x.pk
        this.$refs[locRef].validate()
        this.$refs[unitsRef].validate()
        if (
          this.$refs[locRef].hasError ||
          this.$refs[unitsRef].hasError
        ) {
          this.error = true
        }
        return true
      })
      if (this.error) {
        this.$q.notify({
          color: 'red',
          multiLine: false,
          message: 'Please fix the errors before receipting all inventory',
          icon: 'error'
        })
        this.error = false
        this.$q.loading.hide()
        return
      }

      const items = []

      OrderItems.map((row, i, arr) => {
        const inventory = this.Inventories.filter(i => i.gsi2pk === row.v5.pk && i.v3 === row.gsi2sk)
        if (inventory.length === 0) {
          items.push({
            pk: row.pk,
            v1: row.v5.pk, // Location
            v2: false, // Inventory
            v3: row.unitsReceived, // Units received
            v4: row.map.pk, //  Map
            v5: this.$store.getters['auth/isAuthenticated'].signInUserSession.idToken.payload.email,
            _version: row._version
          })
        } else {
          items.push({
            pk: row.pk, // OrderItem id
            v1: row.v5.pk, // Location
            v2: inventory[0].pk, // Inventory
            v3: row.unitsReceived, // Units received
            v4: row.map.pk, // Map
            v5: this.$store.getters['auth/isAuthenticated'].signInUserSession.idToken.payload.email,
            _version: row._version
          })
        }
      })
      const receiveOrderInput = {
        pk: this.Orders.pk,
        _version: this.Orders._version,
        items: items
      }
      await this.mutateReceiveOrder(receiveOrderInput)
      this.$q.loading.hide()
    },
    async receiveIndividual (row) {
      await this.$apollo.queries.Inventories.refetch()
      const locRef = 'loc#' + row.pk
      const unitsRef = 'units#' + row.pk
      this.$refs[locRef].validate()
      this.$refs[unitsRef].validate()
      if (
        this.$refs[locRef].hasError ||
        this.$refs[unitsRef].hasError
      ) {
        this.$q.notify({
          color: 'red',
          multiLine: false,
          message: 'Please fix the errors before receipting inventory',
          icon: 'error'
        })
        return
      }
      const inventory = this.Inventories.filter(i => i.gsi2pk === row.v5.pk && i.v3 === row.gsi2sk)
      const items = []
      if (inventory.length === 0) {
        items.push({
          pk: row.pk,
          v1: row.v5.pk, // Location
          v2: false, // Inventory
          v3: row.unitsReceived, // Units received
          v4: row.map.pk, //  Map
          v5: this.$store.getters['auth/isAuthenticated'].signInUserSession.idToken.payload.email,
          _version: row._version
        })
      } else {
        items.push({
          pk: row.pk, // OrderItem id
          v1: row.v5.pk, // Location
          v2: inventory[0].pk, // Inventory
          v3: row.unitsReceived, // Units received
          v4: row.map.pk, // Map
          v5: this.$store.getters['auth/isAuthenticated'].signInUserSession.idToken.payload.email,
          _version: row._version
        })
      }
      const receiveOrderInput = {
        pk: this.Orders.pk,
        _version: this.Orders._version,
        items: items
      }
      await this.mutateReceiveOrder(receiveOrderInput)
    },
    async mutateReceiveOrder (input) {
      await this.$apollo.mutate({
        mutation: receiveOrder,
        variables: {
          input: input
        }
      }).then(data => {
        this.$q.notify({
          color: 'primary',
          multiLine: false,
          message: 'Received order item/items',
          icon: 'info'
        })
        this.$apollo.queries.OrdersQuery.refetch()
        return data
      }).catch(e => {
        console.log({ e })
        this.$q.notify({
          color: 'red',
          multiLine: false,
          message: e.graphQLErrors[0].message,
          icon: 'error'
        })
        return e
      })
    },
    async mutateCreateInventory (input, message) {
      await this.$apollo.mutate({
        mutation: createInventory,
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
        return data
      }).catch(e => {
        console.log({ e })
        this.$q.notify({
          color: 'red',
          multiLine: false,
          message: e.graphQLErrors[0].message,
          icon: 'error'
        })
        return e
      })
    },
    async mutateUpdateInventory (input, message) {
      await this.$apollo.mutate({
        mutation: updateInventory,
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
        return data
      }).catch(e => {
        console.log({ e })
        this.$q.notify({
          color: 'red',
          multiLine: false,
          message: e.graphQLErrors[0].message,
          icon: 'error'
        })
        return e
      })
    },
    async mutateUpdateOrderItem (input, message) {
      await this.$apollo.mutate({
        mutation: updateOrderItem,
        variables: {
          input: input
        },
        update: (store, { data: { updateOrderItem } }) => {
          if (updateOrderItem !== undefined) {
            const infeed = store.readQuery({
              query: getAll,
              variables: {
                orders: true,
                orderId: this.pk
              }
            })
            const data = { ...infeed }
            const dataIndex = data.getAll.orders[0].items.indexOf(data.getAll.orders[0].items.find((x) => x.pk === updateOrderItem.pk))
            const orderItem = data.getAll.orders[0].items.find((x) => x.pk === updateOrderItem.pk)
            orderItem.v2 = updateOrderItem.v2
            orderItem.v3 = updateOrderItem.v3
            data.getAll.orders[0].items.splice(dataIndex, 1, orderItem)
            store.writeQuery({
              query: getAll,
              variables: {
                orders: true,
                orderId: this.pk
              },
              data
            })
          }
        }
      }).then(data => {
        this.$q.notify({
          color: 'primary',
          multiLine: false,
          message: message,
          icon: 'info'
        })
        return data
      }).catch(e => {
        console.log({ e })
        this.$q.notify({
          color: 'red',
          multiLine: false,
          message: e.graphQLErrors[0].message,
          icon: 'error'
        })
        return e
      })
    },
    async mutateUpdateOrder (input, message) {
      await this.$apollo.mutate({
        mutation: updateOrderItem,
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
        this.$apollo.queries.OrdersQuery.refetch()
        return data
      }).catch(e => {
        console.log({ e })
        this.$q.notify({
          color: 'red',
          multiLine: false,
          message: e.graphQLErrors[0].message,
          icon: 'error'
        })
        return e
      })
    },
    async mutatePutTransaction (input) {
      await this.$apollo.mutate({
        mutation: putTransaction,
        variables: {
          input: input
        }
      }).then(data => {
        return data
      }).catch(e => {
        console.log({ e })
        this.$q.notify({
          color: 'red',
          multiLine: false,
          message: e.graphQLErrors[0].message,
          icon: 'error'
        })
        return e
      })
    }
  },
  apollo: {
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
    OrdersQuery: {
      query: () => getAll,
      variables () {
        return {
          orders: true,
          orderId: this.pk
        }
      },
      update: data => {
      },
      result ({ data }) {
        if (data !== undefined) {
          this.Orders = data.getAll.orders[0]
          this.Orders.items = this.Orders.items.map(x => {
            if (!x.v3) {
              x.v3 = x.v1
            }
            return ({ ...x })
          })
        }
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
      }
    }
  }
}
</script>
