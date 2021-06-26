<template>
 <q-page class="q-pa-md" >
    <div v-for="fav in rappid" :key="fav.name">
    <q-table
        :title="fav.name"
        :data="fav.groups"
        :columns="columns"
        row-key="name"
        >
        <template v-slot:header="props">
        <q-tr :props="props">
            <q-th auto-width />
            <q-th
            v-for="col in props.cols"
            :key="col.name"
            :props="props"
            >
            {{ col.label }}
            </q-th>
        </q-tr>
        </template>

        <template v-slot:body="props">
        <q-tr :props="props">
            <q-td auto-width>
            <q-btn size="sm" color="accent" round dense @click="props.expand = !props.expand" :icon="props.expand ? 'remove' : 'add'" />
            </q-td>
            <q-td
            v-for="col in props.cols"
            :key="col.name"
            :props="props"
            >
            {{ col.value }}
            </q-td>
        </q-tr>
            <!-- <q-tr  v-for="(row, index) in props"  :key="row.sku" :props="items"> -->
            <q-tr  v-for="(row) in props.items"  :key="row.sku" :props="items">
              <q-td colspan="100%">
                <div class="text-left">This is expand slot for row above: {{ props.row.items[0] }}.</div>
              </q-td>
            </q-tr>
        </template>
    </q-table>
    </div>
 </q-page>
</template>

<script>
import getRappid from '../../graphql/queries/getRappid'

export default {
  name: 'Rappid',
  mounted () {

  },
  data () {
    return {
      rappid: [],
      items: [],
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
        { label: 'name', align: 'left', field: 'name', name: 'name', sortable: true }
      ]
    }
  },
  apollo: {
    rappid: {
      query: () => getRappid,

      update: data => {
        return data.getRappid
      }
    }
  }
}
</script>
