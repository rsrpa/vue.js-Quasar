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
        :filter="filter"
        :data="Bulk"
        :columns="columns"
        :pagination.sync="pagination"
      >
        <template v-slot:top="props">
          <q-btn color="primary" @click="dialog.addInventory = true" class="q-ml-sm q-mt-sm">Add Inventory</q-btn>
            <q-input
              v-if="editName"
              dense
              color="primary"
              label="Template Name"
              v-model="templateName"
              ref='templateName'
              class="q-ml-sm q-mt-sm"
              :rules="[val => !!val  || 'A Template Name is required']"
              >
            </q-input>
            <q-btn flat v-if="editName" @click="saveName()" >
              <q-tooltip >
                save
              </q-tooltip>
              <q-icon  name="save"  />
            </q-btn>
            <span v-else class="q-ml-sm q-mt-sm">{{templateName}}
              <q-btn flat @click="editName=true">
                  <q-tooltip >
                    edit
                  </q-tooltip>
                  <q-icon  name="edit"  />
              </q-btn>
            </span>
          <q-space />
          <q-input
            dense
            debounce="300"
            color="primary"
            v-model="filter"
            >
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
            <q-td>
              <q-input
                v-if="props.row.edit"
                :ref="props.row.pk"
                :value="props.row.v1"
                :rules="[val => !!val && Number.isInteger(Number(val))  && Number(val) > 0  || 'Please enter a valid number']"
                @change.native="updateRow($event, props.row)"
                >
              </q-input>
              <span v-else >{{props.row.v1}}</span>
            </q-td>
            <q-td>
              <q-btn v-if="props.row.edit" flat @click="save(props.row)">
                <q-tooltip >
                  save
                </q-tooltip>
                <q-icon  name="save"  />
              </q-btn>
              <q-btn v-else flat @click="edit(props.row)">
                <q-tooltip >
                  edit
                </q-tooltip>
                <q-icon  name="edit"  />
              </q-btn>
              <q-btn flat @click="removeInventory(props.row)">
                <q-tooltip >
                  Remove
                </q-tooltip>
                <q-icon  name="delete"  />
              </q-btn>
            </q-td>
          </tr>
        </template>
        <!-- <template v-slot:bottom v-if="Bulk.length > 0">
          <q-space />
          <q-btn color="primary" @click="createTemplate()" class="q-ml-sm q-mt-sm q-mb-sm">Update Template</q-btn>
        </template> -->
      </q-table>
  </q-page>
</template>

<script>
import getAll from '../../graphql/queries/getAll'
// import createTemplate from '../../graphql/mutations/createTemplate'
import removeTemplateItem from '../../graphql/mutations/removeTemplateItem'
import updateDefault from '../../graphql/mutations/updateDefault'
import putDefault from 'src/graphql/mutations/putDefault'

export default {
  name: 'Bulk',
  mounted () {
    this.Bulk = []
  },
  props: [
    'pk'
  ],
  data () {
    return {
      editName: false,
      template: [],
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
      temp: [],
      locations: [],
      pagination: {
        sortBy: 'gsi1sk',
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
        { label: 'Transfering Units', align: 'left', field: 'transUnits', name: 'transUnits', sortable: true },
        { label: 'Remove', align: 'left' }
      ]
    }
  },
  methods: {
    edit (row) {
      const bulkIndex = this.Bulk.indexOf(this.Bulk.find((x) => x.pk === row.pk))
      const editedInventory = this.Bulk.find((x) => x.pk === row.pk)
      editedInventory.edit = true
      this.Bulk.splice(bulkIndex, 1, editedInventory)
    },
    save (row) {
      const input = {
        pk: row.pk,
        v1: row.v1,
        _version: row._version ? row._version : 1
      }
      this.$apollo.mutate({
        mutation: updateDefault,
        variables: {
          input: input
        }
      }).then(data => {
        this.$q.notify({
          color: 'primary',
          multiLine: false,
          message: 'Template item updated',
          icon: 'info'
        })
        this.$apollo.queries.template.refetch()
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
    saveName () {
      const input = {
        pk: this.pk,
        v2: this.templateName,
        _version: this.template[0]._version ? this.template[0]._version : 1
      }
      this.$apollo.mutate({
        mutation: updateDefault,
        variables: {
          input: input
        }
      }).then(data => {
        this.$q.notify({
          color: 'primary',
          multiLine: false,
          message: 'Template name updated',
          icon: 'info'
        })
        this.$apollo.queries.template.refetch()
      }).catch(e => {
        console.log({ e })
        this.$q.notify({
          color: 'red',
          multiLine: false,
          message: e.graphQLErrors[0].message,
          icon: 'error'
        })
      })
      this.editName = false
    },
    uuidv4 () {
      return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        var r = Math.random() * 16 | 0
        var v = c === 'x' ? r : (r & 0x3 | 0x8)
        return v.toString(16)
      })
    },
    addInventory () {
      const bulkInventory = this.Bulk.filter(x => {
        if (x.pk === this.invObj.pk || x.map.pk === this.invObj.map.pk) {
          return true
        }
        return false
      })
      if (bulkInventory.length > 0) {
        this.$q.notify({
          color: 'red',
          multiLine: false,
          message: 'Inventory already exists on template',
          icon: 'error'
        })
        return
      }
      const uuid = this.uuidv4()
      const company = this.$store.getters['auth/isAuthenticated'].signInUserSession.idToken.payload['cognito:groups'].filter(x => x !== 'admin')
      const input = {
        pk: uuid,
        gsi1pk: this.template[0].pk,
        gsi1sk: 'temp#item#' + company[0],
        gsi2pk: uuid,
        gsi2sk: this.invObj.map.pk,
        v1: this.invObj.map.v4
      }
      this.$apollo.mutate({
        mutation: putDefault,
        variables: {
          input: input
        }
      }).then(data => {
        this.$q.notify({
          color: 'primary',
          multiLine: false,
          message: 'Template item added',
          icon: 'info'
        })
        this.$apollo.queries.template.refetch()
      }).catch(e => {
        console.log({ e })
        this.$q.notify({
          color: 'red',
          multiLine: false,
          message: e.graphQLErrors[0].message,
          icon: 'error'
        })
      })
      this.invObj = ''
      this.dialog.addInventory = false
    },
    updateRow (event, row) {
      const newValue = event.target.value
      const bulkIndex = this.Bulk.indexOf(this.Bulk.find((x) => x.pk === row.pk))
      const editedInventory = this.Bulk.find((x) => x.pk === row.pk)
      editedInventory.v1 = newValue
      this.Bulk.splice(bulkIndex, 1, editedInventory)
    },
    // addBarcode () {
    //   if (this.barcode.charAt(0) === '~') {
    //     this.barcode = this.barcode.substring(1)
    //   }
    //   const inventory = this.UniqueInventories.filter(x => x.map.supply.gsi2sk === this.barcode)
    //   if (inventory.length === 0) {
    //     this.$q.notify({
    //       color: 'red',
    //       multiLine: false,
    //       message: 'Barcode doesn\'t match any inventory',
    //       icon: 'error'
    //     })
    //     return
    //   }
    //   const bulkInventory = this.Bulk.filter(x => x.map.supply.gsi2sk === this.barcode)
    //   if (bulkInventory.length > 0) {
    //     this.Bulk = this.Bulk.filter(x => x.map.supply.gsi2sk !== this.barcode)
    //     bulkInventory[0].transUnits = (bulkInventory[0].transUnits === '' || isNaN(bulkInventory[0].transUnits)) ? 1 : parseInt(bulkInventory[0].transUnits) + parseInt(bulkInventory[0].map.v4)
    //     this.Bulk.push(bulkInventory[0])
    //   } else {
    //     inventory[0].transUnits = inventory[0].map.v4
    //     this.Bulk.push(inventory[0])
    //   }
    // },
    removeInventory (row) {
      const itemIndex = this.Bulk.indexOf(this.Bulk.find((x) => x.pk === row.pk))
      if (row.gsi1sk.includes('temp#item')) {
        const input = {
          pk: row.pk,
          sk: row.sk,
          _version: row._version ? row._version : 1
        }
        this.$apollo.mutate({
          mutation: removeTemplateItem,
          variables: {
            input: input
          },
          update: (store, { data: { removeTemplateItem } }) => {
            const infeed = store.readQuery({
              query: getAll,
              variables: {
                templates: true,
                templateId: this.pk
              }
            })
            const data = { ...infeed }
            data.getAll.templates[0].items = data.getAll.templates[0].items.filter(x => x.pk !== removeTemplateItem.pk)
            store.writeQuery({
              query: getAll,
              variables: {
                templates: true,
                templateId: this.pk
              },
              data
            })
          }
        }).then(data => {
          this.$q.notify({
            color: 'primary',
            multiLine: false,
            message: 'Template item removed',
            icon: 'info'
          })
          this.$apollo.queries.template.refetch()
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
      this.Bulk.splice(itemIndex, 0)
      this.Bulk = this.Bulk.filter(x => x.pk !== row.pk)
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
    },
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
      },
      result ({ data }) {
        if (data !== undefined) {
          this.templateName = data.getAll.templates[0].v2
          this.Bulk = data.getAll.templates[0].items.map(x => {
            x.edit = false
            return x
          })
        }
      }
    }
  }
}
</script>
