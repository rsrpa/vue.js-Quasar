<template>
 <q-page class="q-pa-md" >
   <q-dialog v-model="dialog.locations" persistent>
      <q-card class="q-pa-md" style="width: 700px; max-width: 80vw;">
        <q-form ref="form"
          lazy-validation
          >
        <q-card-section>
          <div class="text-h6 text-weight-light">Stock transactions of inventory</div>
        </q-card-section>
        <q-card-section>
          <q-select
            ref="locObj"
            v-model="locObj"
            :options="Locations"
            label="Location"
            fill-input
            option-label="v1"
            :rules="[val => !!val || 'Location from is required']"
            />
        </q-card-section>
        <q-card-actions>
          <q-btn @click="reset()" color="primary">Reset</q-btn>
          <q-space></q-space>
          <q-btn @click="closeDialog()" color="primary">Save</q-btn>
        </q-card-actions>
        </q-form>
      </q-card>
    </q-dialog>
   <q-dialog v-model="dialog.barcode" persistent>
      <q-card class="q-pa-md" style="width: 700px; max-width: 80vw;">
        <q-card-section>
          <div class="text-h6 text-weight-light">{{bcform.inventory.map.v1}} @{{bcform.inventory.location.v1}}</div>
          <div class="muted">SOH: <b>{{bcform.inventory.v1}}</b> </div>
        </q-card-section>
        <q-card-section style="" >
          <q-form lazy-validation v-on:submit.prevent="stocktakeItem()">
          <q-input  type="number" ref='bcformNumber' v-model="bcform.number"  ></q-input>
          </q-form>
        </q-card-section>
        <q-card-actions>
          <q-btn  @click="closeBarcodeDialog()" color="primary">close</q-btn>
          <q-space></q-space>
          <q-btn @click="stocktakeItem()" color="primary">Done</q-btn>
        </q-card-actions>
      </q-card>
    </q-dialog>
    <q-table
      title="Stocktake"
      :data="stock"
      :columns="columns"
      :filter="filter"
      :pagination.sync="pagination"
      >
      <template v-slot:top="props">
        <q-btn color="primary" @click="dialog.locations = true" class="q-ml-sm q-mt-sm">By Area</q-btn>
        <q-btn color="primary" @click="reset()"  class="q-ml-sm q-mt-sm">Reset</q-btn>
        <q-btn color="primary" @click="stocktake()" :disabled="isDisabled" class="q-ml-sm q-mt-sm">Complete Stocktake</q-btn>
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
        <tr :class="props.row.checked ? 'bg-green-1':''">
          <q-td>{{props.row.map.supply.gsi2sk}}</q-td>
          <q-td>{{props.row.map.v1}}</q-td>
          <q-td>{{props.row.location.v1}}</q-td>
          <q-td>{{props.row.v1}}</q-td>

          <q-td>
            <q-input
              :ref="'units#'+props.row.pk"
              :value="props.row.stockedUnits"
              :rules="[val => !!val && Number.isInteger(Number(val))  && Number(val) >= 0  || 'Please enter a valid number']"
              @change.native="updateRow($event, props.row)"
              >
            </q-input>
          </q-td>
          <q-td>
            <q-btn flat @click="checkInventory(props.row)">
              <q-tooltip >
                Checked
              </q-tooltip>
              <q-icon name="check" />
            </q-btn>
            <q-btn flat @click="removeInventory(props.row)">
              <q-tooltip >
                Remove
              </q-tooltip>
              <q-icon name="delete" />
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
import createStocktake from '../../graphql/mutations/createStocktake'
import createStocktakeItem from '../../graphql/mutations/createStocktakeItem'
import putTransaction from '../../graphql/mutations/putTransaction'
export default {
  name: 'Stock',
  mounted () {
    this.focusBarcode()
  },

  data () {
    return {
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
      isDisabled: false,
      error: false,
      stock: [],
      barcode: '',
      locObj: '',
      invObj: '',
      Locations: [],
      Inventories: [],
      dialog: {
        addInventory: false,
        locations: false,
        barcode: false
      },
      pagination: {
        sortBy: 'v5',
        descending: false,
        page: 2,
        rowsPerPage: -1
      },
      filter: '',
      columns: [
        { label: 'Barcode', align: 'left', field: 'gsi1sk', name: 'gsi1sk', sortable: true },
        { label: 'Name', align: 'left', field: 'v5', name: 'v5', sortable: true },
        {
          label: 'Location',
          align: 'left',
          field: row => {
            return row.location.v1
          },
          name: 'row.location.v1',
          sortable: true
        },
        { label: 'Stated Units', align: 'left', field: 'v1', name: 'v1', sortable: true },
        { label: 'Actual Units', align: 'left', field: 'stockedUnits', name: 'stockedUnits', sortable: true },
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
    focusBarcodeNumber () {
      this.$nextTick(() => {
        this.$refs.bcformNumber.focus()
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
    stocktakeItem () {
      this.stock = this.stock.filter(x => x.pk !== this.bcform.inventory.pk)
      this.bcform.inventory.checked = true
      this.bcform.inventory.stockedUnits = this.bcform.number
      this.stock.unshift(this.bcform.inventory)
      this.closeBarcodeDialog()
      this.focusBarcode()
    },
    addBarcode () {
      if (this.barcode.charAt(0) === '~') {
        this.barcode = this.barcode.substring(1)
      }
      const barcodeFilter = this.stock.filter(x => x.map.supply.gsi2sk.toLowerCase() === this.barcode.toLowerCase())
      if (barcodeFilter.length === 0) {
        this.$q.notify({
          color: 'red',
          multiLine: false,
          message: 'Barcode doesn\'t match any inventory',
          icon: 'error'
        })
        this.barcode = ''
        return
      }
      if (barcodeFilter.length > 1) {
        this.$q.dialog({
          title: 'Select location',
          message: 'Stock barcode in more than one location, please select location.',
          options: {
            type: 'radio',
            model: 'opt1',
            items: barcodeFilter.map(x => {
              return {
                label: x.location.v1,
                value: x.pk
              }
            })
          },
          cancel: true,
          persistent: true
        }).onOk(data => {
          this.bcform.inventory = this.stock.filter(x => x.pk === data)[0]
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
    closeDialog () {
      this.dialog.locations = false
      this.focusBarcode()
    },
    async reset () {
      this.locObj = ''
      this.dialog.locations = false
      this.focusBarcode()
      await this.$apollo.queries.Inventories.refetch()
    },
    getLabel (x) {
      if (!x.map || x.length === 0) {
        return ''
      }
      return x.map.v1
    },
    updateRow (event, row) {
      const newValue = event.target.value
      const stockIndex = this.stock.indexOf(this.stock.find((x) => x.pk === row.pk))
      const editedInventory = this.stock.find((x) => x.pk === row.pk)
      editedInventory.stockedUnits = newValue
      this.stock.splice(stockIndex, 1, editedInventory)
    },
    removeInventory (row) {
      this.stock = this.stock.filter(x => x.pk !== row.pk)
    },
    checkInventory (row) {
      // const stockIndex = this.stock.indexOf(this.stock.find((x) => x.pk === row.pk))
      // const editedInventory = this.stock.find((x) => x.pk === row.pk)
      // editedInventory.checked = true
      this.stock = this.stock.filter(x => x.pk !== row.pk)
      row.checked = true
      this.stock.unshift(row)
      // this.stock.splice(stockIndex, 1, editedInventory)
      this.focusBarcode()
    },
    stocktake () {
      this.$q.loading.show()
      this.stock.filter(x => {
        const unitsRef = 'units#' + x.pk
        this.$refs[unitsRef].validate()
        if (
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

      this.isDisabled = true
      let isItems = this.stock.filter(x => {
        if (x.checked) {
          return true
        }
        return false
      })
      console.log(isItems)
      if (isItems.length === 0) {
        this.$q.notify({
          color: 'red',
          multiLine: false,
          message: 'No items check',
          icon: 'error'
        })
        isItems = []
        this.isDisabled = false
        this.$q.loading.hide()
        return
      }

      const items = []
      isItems.map(x => {
        items.push({
          gsi2sk: x.v3,
          v1: x.v1,
          v2: x.stockedUnits,
          v3: x.location.pk,
          v4: x.pk
        })
      })
      const input = {
        v1: this.$store.getters['auth/isAuthenticated'].signInUserSession.idToken.payload.email,
        items: items
      }
      this.$apollo.mutate({
        mutation: createStocktake,
        variables: {
          input: input
        }
      }).then(data => {
        this.$q.notify({
          color: 'primary',
          multiLine: false,
          message: 'Stocktake created',
          icon: 'info'
        })
        this.$q.loading.hide()
        this.$router.push({ name: 'dashboard' })
      }).catch(e => {
        this.$q.loading.hide()
        console.log({ e })
        this.$q.notify({
          color: 'red',
          multiLine: false,
          message: e.graphQLErrors[0].message,
          icon: 'error'
        })
      })
    },
    async mutateCreateStocktake (input, message) {
      return await this.$apollo.mutate({
        mutation: createStocktake,
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
        return data.data.createStocktake
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
    async mutateCreateStocktakeItem (input, message, last) {
      await this.$apollo.mutate({
        mutation: createStocktakeItem,
        variables: {
          input: input
        }
      }).then(async data => {
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
    async mutateUpdateInventory (input, message) {
      await this.$apollo.mutate({
        mutation: updateInventory,
        variables: {
          input: input
        },
        update: (store, { data: { updateInventory } }) => {
          if (updateInventory === undefined) {
            return
          }
          const data = store.readQuery({
            query: getAll,
            variables: {
              inventories: true
            }
          })
          const dataIndex = data.getAll.inventories.indexOf(data.getAll.inventories.find((x) => x.pk === updateInventory.pk))
          const editedInventory = data.getAll.inventories.find((x) => x.pk === updateInventory.pk)
          editedInventory.v1 = updateInventory.v1
          data.getAll.inventories.splice(dataIndex, 1, editedInventory)
          store.writeQuery({
            query: getAll,
            variables: {
              inventories: true
            },
            data
          })
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
    async mutatePutTransaction (input) {
      await this.$apollo.mutate({
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
    },
    Inventories: {
      query: () => getAll,
      variables () {
        let params = {
          inventories: true
        }
        if (this.locObj !== '') {
          params = {
            inventories: true,
            inventoriesLocation: this.locObj.pk
          }
        }
        return params
      },
      update: data => {
        return data.getAll.inventories
      },
      result ({ data }) {
        if (data !== undefined) {
          this.stock = data.getAll.inventories.map(x => {
            x.stockedUnits = x.v1
            x.checked = false
            return ({ ...x })
          })
        }
      }
    }
  }
}
</script>
