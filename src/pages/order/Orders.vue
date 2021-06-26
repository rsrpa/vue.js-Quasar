<template>
 <q-page class="q-pa-md" >
    <q-table
      title="Users"
      :data="Orders"
      :columns="columns"
      :pagination.sync="pagination"
      >
      <template v-slot:top="props">
        <q-btn color="primary" :to="{name: 'create'}" class="q-ml-sm q-mt-sm">Create Order</q-btn>
        <q-space />

        <q-btn
          flat round dense
          :icon="props.inFullscreen ? 'fullscreen_exit' : 'fullscreen'"
          @click="props.toggleFullscreen"
          class="q-ml-md"
        />
      </template>
      <template v-slot:body="props">
        <tr :class="status(props.row)">
          <q-td>{{new Date(props.row.gsi1sk)}}</q-td>
          <!-- <q-td>{{props.row.location.v1}}</q-td> -->
          <q-td>{{props.row.v1}}</q-td>
          <q-td>{{props.row.v2}}</q-td>
          <q-td>{{props.row.items.length}}</q-td>
          <q-td>
            <q-btn flat :to="{name:'receive',params:{ pk: props.row.pk }}">
              <q-tooltip >
                Receive
              </q-tooltip>
            <q-icon  name="local_shipping"  />
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

export default {
  name: 'Orders',
  mounted () {
    this.dialog.locations = false
    this.Bulk = []
  },
  data () {
    return {
      Orders: [],
      Inventories: [],
      dialog: {
        locations: false,
        addInventory: false,
        addTemplate: false
      },
      pagination: {
        sortBy: 'gsi1sk',
        descending: true,
        page: 2,
        rowsPerPage: -1
      },
      filter: '',
      columns: [
        { label: 'Ordered', align: 'left', field: 'gsi1sk', name: 'gsi1sk', sortable: true },
        {
          label: 'Ordered By',
          align: 'left',
          field: 'v1',
          name: 'v1',
          sortable: true
        },
        { label: 'Order Reference', align: 'left', field: 'v2', name: 'v2', sortable: true },
        { label: 'Order Items', align: 'left', field: 'items.length', name: 'items.length', sortable: true },
        { label: 'Receive', align: 'left' }
      ]
    }
  },
  methods: {
    status (row) {
      let bgColor = ''
      if (row.v3 === 'partial') {
        bgColor = 'bg-yellow-1'
      }
      if (row.v3 === 'received') {
        bgColor = 'bg-green-1'
      }
      return bgColor
    },
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
      if (!x.map || x.length === 0) {
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
      this.invObj.orderUnits = parseInt(this.invObj.map.v3)
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
        this.Bulk.push(bulkInventory[0])
      } else {
        inventory[0].transUnits = inventory[0].map.v4
        this.Bulk.push(inventory[0])
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
    placeOrder () {
      if (this.order.items.length === 0) {
        this.$q.notify({
          color: 'red',
          multiLine: false,
          message: 'No inventory on order',
          icon: 'error'
        })
      }
      // this.order.items.forEach(x => {
      //   const input = {
      //     pk: x.pk,
      //     v1: -parseInt(x.transUnits)
      //   }
      //   this.mutateUpdateInventory(input, 'Inventory consumed')
      //   const transInput = {
      //     sk: new Date().toString(),
      //     gsi1pk: this.locFromObj.pk,
      //     gsi2sk: x.map.pk,
      //     v1: this.$store.getters['auth/isAuthenticated'].signInUserSession.idToken.payload.email,
      //     v2: 'consume',
      //     v3: x.transUnits,
      //     v6: this.locFromObj.pk
      //   }
      //   this.mutatePutTransaction(transInput)
      // })

      // this.order.items = []
      // this.$router.push({ name: 'receive' })
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
    mutateUpdateInventory (input, message) {
      this.$apollo.mutate({
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
    Orders: {
      query: () => getAll,
      variables () {
        return {
          orders: true
        }
      },
      update: data => {
        return data.getAll.orders
      }
    }
  }
}
</script>
