<template>
  <q-page class="q-pa-md" >
    <q-dialog v-model="dialog.create" persistent>
      <q-card class="q-pa-md" style="width: 700px; max-width: 80vw;">
        <q-form ref="form"
          @submit.prevent="createInventory"
          lazy-validation
          >
        <q-card-section>
          <div class="text-h6 text-weight-light">Create inventory</div>
        </q-card-section>
        <q-card-section>
          <q-select
            ref="mapObj"
            v-model="form.mapObj"
            :options="mapOptions"
            label="Inventory"
            fill-input
            use-input
            hide-selected
            input-debounce="0"
            @filter="filterFn"
            option-label="v1"
            :rules="[val => !!val || 'Inventory is required']"
            />
          <q-select
            ref="locObj"
            v-model="form.locObj"
            :options="Locations"
            label="Location"
            fill-input
            option-label="v1"
            :rules="[val => !!val || 'Location is required']"
            />
          <q-input
            label="Units *"
            v-model="form.units"
            ref="units"
            required
            lazy-rules
            :rules="[val => !!val && Number.isInteger(Number(val)) && Number(val) >= 0 || 'Please enter a valid number']"
            >
          </q-input>
        </q-card-section>
        <q-card-actions>
            <q-btn @click="dialog.create = false" color="primary">close</q-btn>
            <q-btn @click="reset" color="primary">reset</q-btn>
          <q-space></q-space>
          <q-btn type="submit" color="primary">Save</q-btn>
        </q-card-actions>
        </q-form>
      </q-card>
    </q-dialog>
    <q-dialog v-model="dialog.consume" persistent>
      <q-card class="q-pa-md" style="width: 700px; max-width: 80vw;">
        <q-form ref="form"
          @submit.prevent="consumeInventory"
          lazy-validation
          >
        <q-card-section>
          <div class="text-h6 text-weight-light">Consume Inventory</div>
        </q-card-section>
        <q-card-section>
          <q-select
            ref="consumeMapObj"
            v-model="consume.mapObj"
            :options="mapOptions"
            label="Inventory"
            :disable="true"
            option-label="v1"
            :rules="[val => !!val || 'Inventory is required']"
            />
          <q-select
            ref="consumeLocObj"
            v-model="consume.locObj"
            :options="Locations"
            label="Location"
            :disable="true"
            option-label="v1"
            :rules="[val => !!val || 'Location is required']"
            />
          <q-input
            label="Units *"
            v-model="consume.units"
            ref="consumeUnits"
            required
            lazy-rules
            :rules="[val => !!val && Number.isInteger(Number(val)) && Number(val) > 0 || 'Please enter a valid number']"
            >
          </q-input>
        </q-card-section>
        <q-card-actions>
            <q-btn @click="dialog.consume = false" color="primary">close</q-btn>
          <q-space></q-space>
          <q-btn type="submit" color="primary">Save</q-btn>
        </q-card-actions>
        </q-form>
      </q-card>
    </q-dialog>
    <q-dialog v-model="dialog.replenish" persistent>
      <q-card class="q-pa-md" style="width: 700px; max-width: 80vw;">
        <q-form ref="form"
          @submit.prevent="replenishInventory"
          lazy-validation
          >
        <q-card-section>
          <div class="text-h6 text-weight-light">Replenish Inventory</div>
        </q-card-section>
        <q-card-section>
          <q-select
            ref="replenishMapObj"
            v-model="replenish.mapObj"
            :options="mapOptions"
            label="Inventory"
            :disable="true"
            option-label="v1"
            :rules="[val => !!val || 'Inventory is required']"
            />
          <q-select
            ref="replenishLocObj"
            v-model="replenish.locObj"
            :options="Locations"
            label="Location"
            :disable="true"
            option-label="v1"
            :rules="[val => !!val || 'Location is required']"
            />
          <q-input
            label="Units *"
            v-model="replenish.units"
            ref="replenishUnits"
            required
            lazy-rules
            :rules="[val => !!val && Number.isInteger(Number(val)) && Number(val) > 0 || 'Please enter a valid number']"
            >
          </q-input>
        </q-card-section>
        <q-card-actions>
            <q-btn @click="dialog.replenish = false" color="primary">close</q-btn>
          <q-space></q-space>
          <q-btn type="submit" color="primary">Save</q-btn>
        </q-card-actions>
        </q-form>
      </q-card>
    </q-dialog>
    <q-dialog v-model="dialog.transfer" persistent>
      <q-card class="q-pa-md" style="width: 700px; max-width: 80vw;">
        <q-form ref="form"
          @submit.prevent="transferInventory"
          lazy-validation
          >
        <q-card-section>
          <div class="text-h6 text-weight-light">Transfer Inventory</div>
        </q-card-section>
        <q-card-section>
          <q-select
            ref="transferMapObj"
            v-model="transfer.mapObj"
            :options="mapOptions"
            label="Inventory"
            :disable="true"
            option-label="v1"
            :rules="[val => !!val || 'Inventory is required']"
            />
          <q-select
            ref="transferLocObjFrom"
            v-model="transfer.locObjFrom"
            :options="Locations"
            label="Location"
            :disable="true"
            option-label="v1"
            :rules="[val => !!val || 'Location from is required']"
            />
          <q-select
            ref="transferLocObjTo"
            v-model="transfer.locObjTo"
            :options="Locations"
            label="Location"
            fill-input
            option-label="v1"
            :rules="[val => !!val || 'Location to is required']"
            />
          <q-input
            label="Units *"
            v-model="transfer.units"
            ref="transferUnits"
            required
            lazy-rules
            :rules="[val => !!val && Number.isInteger(Number(val)) && Number(val) > 0 || 'Please enter a valid number']"
            >
          </q-input>
        </q-card-section>
        <q-card-actions>
            <q-btn @click="dialog.transfer = false" color="primary">close</q-btn>
          <q-space></q-space>
          <q-btn type="submit" color="primary">Save</q-btn>
        </q-card-actions>
        </q-form>
      </q-card>
    </q-dialog>
    <q-table
      v-if="Inventories"
      title="Users"
      :data="Inventories"
      :columns="columns"
      :filter="filter"
      :pagination.sync="pagination"
      >
      <template v-slot:top="props">
        <q-btn color="primary" @click="dialog.create = true" class="q-ml-sm q-mt-sm">Create Inventory</q-btn>
        <q-space />
        <q-input dense debounce="300" color="primary" v-model="filter">
          <template v-slot:append>
            <q-icon name="search" />
          </template>
        </q-input>
        <q-space />
        <q-input
          dense
          debounce="300"
          color="primary"
          v-model="barcode"
          ref='bc'
          @change.enter="searchBarcode()"
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
          <!-- <q-td>
            <q-icon v-if="props.row.v2 === 'true'" name="send">
            </q-icon>
          </q-td> -->
          <q-td>
            <q-btn flat  @click="openReplenish(props.row)">
              <q-tooltip >
                Replenish
              </q-tooltip>
              <q-icon  name="system_update_alt"  />
            </q-btn>
            <q-btn flat @click="openTransfer(props.row)">
              <q-tooltip >
                Transfer
              </q-tooltip>
              <q-icon  name="compare_arrows"  />
            </q-btn>
            <q-btn flat  @click="openConsume(props.row)">
              <q-tooltip >
                Consume
              </q-tooltip>
              <q-icon  name="launch"  />
            </q-btn>
            <q-btn flat @click="removeInventory(props.row)">
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
import updateInventory from '../../graphql/mutations/updateInventory'
import putTransaction from '../../graphql/mutations/putTransaction'
import createInventory from '../../graphql/mutations/createInventory'
import removeInventory from '../../graphql/mutations/removeInventory'

export default {
  name: 'Inventories',
  mounted () {
    this.$apollo.queries.Inventories.refetch()
    this.focusBarcode()
  },
  data () {
    return {
      barcode: '',
      Locations: [],
      mapOptions: [],
      dialog: {
        create: false,
        transfer: false,
        consume: false,
        replenish: false
      },
      transfer: {
        pk: '',
        units: '',
        mapObj: '',
        locObjFrom: '',
        locObjTo: ''
      },
      consume: {
        pk: '',
        units: '',
        mapObj: '',
        locObj: ''
      },
      replenish: {
        pk: '',
        units: '',
        mapObj: '',
        locObj: ''
      },
      form: {
        units: '',
        mapObj: '',
        locObj: ''
      },
      Inventories: [],
      pagination: {
        sortBy: 'map.v1',
        descending: false,
        page: 1,
        rowsPerPage: 15
      },
      filter: '',
      columns: [
        {
          label: 'Bar Code',
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
          name: 'map.v1',
          sortable: true
        },
        {
          label: 'Location',
          align: 'left',
          field: row => {
            return row.location.v1
          },
          name: 'v4',
          sortable: true
        },
        { label: 'Units', align: 'left', field: 'v1', name: 'v1', sortable: true },
        // { label: 'On Order', align: 'left', field: 'v2', name: 'v2', sortable: true },
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
    searchBarcode () {
      this.filter = ''
      if (this.barcode.charAt(0) === '~') {
        this.barcode = this.barcode.substring(1)
      }
      this.filter = this.barcode
      this.barcode = ''
      this.focusBarcode()
    },
    navigate (id) {
      this.$router.push({ name: 'editSupply', params: { pk: id } })
    },
    filterFn (val, update, abort) {
      update(() => {
        const needle = val.toLowerCase()
        this.mapOptions = this.Maps.filter(v => v.v1.toLowerCase().indexOf(needle) > -1)
      })
    },
    reset () {
      this.form.units = ''
      this.form.mapObj = ''
      this.form.locObj = ''
      this.$refs.units.resetValidation()
      this.$refs.mapObj.resetValidation()
      this.$refs.locObj.resetValidation()
    },
    createInventory () {
      this.$refs.units.validate()
      this.$refs.mapObj.validate()
      this.$refs.locObj.validate()
      if (
        this.$refs.units.hasError ||
        this.$refs.mapObj.hasError ||
        this.$refs.locObj.hasError
      ) {
        return
      }
      const input = {
        gsi2pk: this.form.locObj.pk,
        v1: this.form.units,
        v2: false,
        v3: this.form.mapObj.pk
      }
      const inventory = this.Inventories.filter(x => x.gsi2pk === this.form.locObj.pk && x.v3 === this.form.mapObj.pk)
      if (inventory.length > 0) {
        this.$q.notify({
          color: 'red',
          multiLine: false,
          message: 'Inventory in location already exists',
          icon: 'error'
        })
        return
      }
      this.mutateCreateInventory(input, 'Inventory created')
      const transInput = {
        sk: this.form.mapObj.pk,
        gsi1pk: this.form.locObj.pk,
        v1: this.$store.getters['auth/isAuthenticated'].signInUserSession.idToken.payload.email,
        v2: 'create',
        v3: this.form.units,
        v4: this.form.locObj.pk
      }
      this.mutatePutTransaction(transInput)
      this.reset()
      this.dialog.create = false
    },
    removeInventory (row) {
      this.$q.dialog({
        title: 'Confirm',
        message: 'Please confirm you wish to remove this inventory?',
        cancel: true
      }).onOk(() => {
        this.$apollo.mutate({
          mutation: removeInventory,
          variables: {
            input: {
              pk: row.pk,
              _version: row._version
            }
          },
          update: (store, { data: { removeInventory } }) => {

          }
        }).then(data => {
          this.$q.notify({
            color: 'primary',
            multiLine: false,
            message: 'Inventory removed',
            icon: 'info'
          })
          this.$apollo.queries.Inventories.refetch()
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
    },
    openConsume (row) {
      this.dialog.consume = true
      this.consume.pk = row.pk
      this.consume.units = ''
      this.consume.mapObj = row.map
      this.consume.locObj = this.Locations.filter(x => x.pk === row.gsi2pk)[0]
    },
    async consumeInventory () {
      await this.$apollo.queries.Inventories.refetch()
      const inventory = this.Inventories.filter(x => x.pk === this.consume.pk)[0]
      if (parseInt(this.consume.units) > parseInt(inventory.v1)) {
        this.$q.notify({
          color: 'red',
          multiLine: false,
          message: 'Cannot consume more than in stock',
          icon: 'error'
        })
        return
      }
      const units = parseInt(inventory.v1) - parseInt(this.consume.units)
      const input = {
        pk: this.consume.pk,
        v1: units,
        _version: inventory._version
      }
      this.mutateUpdateInventory(input, 'Inventory consumed')
      const transInput = {
        sk: this.consume.mapObj.pk,
        gsi1pk: this.consume.locObj.pk,
        v1: this.$store.getters['auth/isAuthenticated'].signInUserSession.idToken.payload.email,
        v2: 'consume',
        v3: this.consume.units,
        v4: this.consume.locObj.pk
      }
      this.mutatePutTransaction(transInput)
      this.consume.units = ''
      this.dialog.consume = false
    },
    openReplenish (row) {
      this.dialog.replenish = true
      this.replenish.pk = row.pk
      this.replenish.units = ''
      this.replenish.mapObj = row.map
      this.replenish.locObj = this.Locations.filter(x => x.pk === row.gsi2pk)[0]
    },
    async replenishInventory () {
      await this.$apollo.queries.Inventories.refetch()
      const inventory = this.Inventories.filter(x => x.pk === this.replenish.pk)[0]
      const units = parseInt(this.replenish.units) + parseInt(inventory.v1)
      const input = {
        pk: this.replenish.pk,
        v1: units,
        _version: inventory._version
      }
      this.mutateUpdateInventory(input, 'Inventory replenished')
      const transInput = {
        sk: this.replenish.mapObj.pk,
        gsi1pk: this.replenish.locObj.pk,
        v1: this.$store.getters['auth/isAuthenticated'].signInUserSession.idToken.payload.email,
        v2: 'replenish',
        v3: this.replenish.units,
        v4: this.replenish.locObj.pk
      }
      this.mutatePutTransaction(transInput)
      this.replenish.units = ''
      this.dialog.replenish = false
    },
    openTransfer (row) {
      this.dialog.transfer = true
      this.transfer.pk = row.pk
      this.transfer.units = ''
      this.transfer.mapObj = row.map
      this.transfer.locObjFrom = this.Locations.filter(x => x.pk === row.gsi2pk)[0]
    },
    async transferInventory () {
      this.$refs.transferUnits.validate()
      this.$refs.transferMapObj.validate()
      this.$refs.transferLocObjTo.validate()
      this.$refs.transferLocObjFrom.validate()
      if (
        this.$refs.transferUnits.hasError ||
        this.$refs.transferMapObj.hasError ||
        this.$refs.transferLocObjTo.hasError ||
        this.$refs.transferLocObjFrom.hasError
      ) {
        return
      }
      if (this.transfer.locObjTo.pk === this.transfer.locObjFrom.pk) {
        this.$q.notify({
          color: 'red',
          multiLine: false,
          message: 'Locations must differ',
          icon: 'error'
        })
        return
      }
      await this.$apollo.queries.Inventories.refetch()
      const inventoryFrom = this.Inventories.filter(x => x.pk === this.transfer.pk)
      const inventoryTo = this.Inventories.filter(x => x.gsi2pk === this.transfer.locObjTo.pk && x.v3 === this.transfer.mapObj.pk)
      if (parseInt(inventoryFrom[0].v1) < parseInt(this.transfer.units)) {
        this.$q.notify({
          color: 'red',
          multiLine: false,
          message: 'Cannot consume more than in stock',
          icon: 'error'
        })
        return
      }
      if (inventoryTo.length === 0) {
        const input = {
          gsi2pk: this.transfer.locObjTo.pk,
          v1: this.transfer.units,
          v2: inventoryFrom[0].v2,
          v3: this.transfer.mapObj.pk
        }
        this.mutateCreateInventory(input, 'Created Inventory')
      } else {
        const unitsTo = parseInt(inventoryTo[0].v1) + parseInt(this.transfer.units)
        const input = {
          pk: inventoryTo[0].pk,
          v1: unitsTo,
          _version: inventoryTo[0]._version
        }
        this.mutateUpdateInventory(input, 'Updated Inventory')
      }
      const unitsFrom = parseInt(inventoryFrom[0].v1) - parseInt(this.transfer.units)
      const input = {
        pk: inventoryFrom[0].pk,
        v1: unitsFrom,
        _version: inventoryFrom[0]._version
      }
      this.mutateUpdateInventory(input, 'Updated Inventory')
      const transInput = {
        sk: this.transfer.mapObj.pk,
        gsi1pk: this.transfer.locObjFrom.pk,
        v1: this.$store.getters['auth/isAuthenticated'].signInUserSession.idToken.payload.email,
        v2: 'transfer',
        v3: this.transfer.units,
        v4: this.transfer.locObjFrom.pk,
        v5: this.transfer.locObjTo.pk
      }
      this.mutatePutTransaction(transInput)
      this.transfer.locObjTo = ''
      this.$refs.transferUnits.resetValidation()
      this.$refs.transferMapObj.resetValidation()
      this.$refs.transferLocObjTo.resetValidation()
      this.$refs.transferLocObjFrom.resetValidation()
      this.dialog.transfer = false
    },
    mutateCreateInventory (input, message) {
      this.$apollo.mutate({
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
        // this.$router.push({ name: 'maps' })
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
        this.$apollo.queries.Inventories.refetch()
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
    Inventories: {
      query: () => getAll,
      variables () {
        return {
          inventories: true
        }
      },
      update: data => {
        const missing = []
        data.getAll.inventories.map(x => {
          if (x.map.supply === null) {
            missing.push(x)
          }
        })
        return data.getAll.inventories
      }
    },
    Maps: {
      query: () => getAll,
      variables () {
        return {
          mapsTypeR: true
        }
      },
      update: data => {
        return data.getAll.mapsTypeR.items
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
