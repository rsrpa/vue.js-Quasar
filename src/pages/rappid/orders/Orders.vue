<template>
  <q-page class="justify-evenly max-80">
    <h4 class="text-warning text-weight-bold title">Orders And Invoices</h4>
        <q-card>
          <q-tabs
            v-model="tab"
            class="text-grey"
            active-color="primary"
            indicator-color="primary"
            align="justify"

          >
            <q-tab name="backorders" label="Backorders" >
               <q-badge color="red" floating transparent>{{orders.backorders.length}}</q-badge>
            </q-tab>
            <q-tab name="orders" label="Orders" >
            </q-tab>
            <q-tab name="invoices" label="Invoices" >
            </q-tab>
          </q-tabs>

          <q-separator />

          <q-tab-panels v-model="tab" animated>
            <q-tab-panel name="backorders">
              <q-table
                flat
                :data="orders.backorders"
                :columns="backorderCols"
                :pagination="initialPagination"
                :rows-per-page-options="[]"
                row-key="v1+v4"
              />
            </q-tab-panel>

            <q-tab-panel name="orders">
              <q-table
                flat
                title="Current orders"
                :data="orders.orders"
                :columns="backorderCols"
                row-key="v1+v4"
                hide-pagination
              />
            </q-tab-panel>

            <q-tab-panel name="invoices">
              <q-table
                flat
                title="Invoices"
                :data="orders.history"
                :columns="backorderCols"
                row-key="v1+v4"
                hide-pagination
              />
            </q-tab-panel>
          </q-tab-panels>
        </q-card>
  </q-page>
</template>

<script>
// import createOrder from '../../../graphql/mutations/createOrder'
import getAll from '../../../graphql/queries/getAll'
// import { mapGetters } from 'vuex'
export default {
  name: 'rappidorders',

  props: ['pk'],
  computed: {
  },
  mounted () {},
  data () {
    return {
      initialPagination: {
        rowsPerPage: 10
      },
      tab: 'backorders',
      orders: {
        backorders: [],
        orders: [],
        history: []
      },
      backorderCols: [
        {
          label: 'Product Code',
          align: 'left',
          field: row => {
            return row.v1
          },
          name: 'v1',
          sortable: true
        },
        {
          label: 'Product Name',
          align: 'left',
          field: row => {
            return row.v2
          },
          name: 'v2',
          sortable: true
        },
        {
          label: 'Units Remaining',
          align: 'left',
          field: row => {
            return row.v3
          },
          name: 'v3',
          sortable: true
        },
        {
          label: 'Sales Order No.',
          align: 'left',
          field: row => {
            return row.v4
          },
          name: 'v4',
          sortable: true
        },
        {
          label: 'Date Ordered',
          align: 'left',
          field: row => {
            return row.v5
          },
          name: 'v5',
          sortable: true
        }
      ]
    }
  },
  methods: {
  },
  apollo: {
    orders: {
      query: () => getAll,
      variables () {
        return {
          accountDataBackorder: true
        }
      },
      update: data => {
        console.log(data.getAll.accountDataBackorder)
        return {
          backorders: data.getAll.accountDataBackorder,
          orders: [],
          history: []
        }
      },
      result ({ data, loading }) {
        if (loading) {
          // this.$q.loading.show()
        }
        if (!loading) {
          // this.groups = data.getAll.favs[0].groups.map(x => {
          //   x.items = x.items.map(y => {
          //     y.orderUnits = ''
          //     y.ordered = false
          //     y.parent = x.pk
          //     return y
          //   })
          //   return x
          // })
          // this.$q.loading.hide()
        }
      }
    }
  }
}
</script>

<style lang="scss">
  .favourite-table {
    thead {
      tr {
        height: 3rem !important;
      }
    }
    .q-table__bottom {
      background-color: $grey-2;
      flex-direction: row-reverse;
      opacity: 0.8;
      padding: 10px 20px;
    }
    .fav-header {
      font-size: 1.05rem;
      font-weight: 500;
      color: $blue-grey-9;
    }
    .item-description {
      width: 600px;
      max-width: 600px;
    }
    .item-sku {
      width: 88px;
      max-width: 88px;
    }
    .by-line {
      white-space: normal;
    }
    .item-substitute {
      width: 115px;
      max-width: 115px;
    }
    .header-row {
      background-color: $light-blue-1;
    }
    .sub-header {
      font-weight: 500;
      color: $grey-7;
    }
    .dot {
      height: .8rem;
      width: .8rem;
      border-radius: 50%;
      display: inline-block;
    }
    .out-stock {
      background-color: $orange;
    }
    .in-stock {
      background-color: $green-7;
    }
  }
  .q-table__bottom {
    background-color: $grey-2;
    flex-direction: row-reverse;
    opacity: 0.8;
    padding: 10px 20px;
  }
  .fav-header {
    font-size: 1.05rem;
    font-weight: 500;
    color: $blue-grey-9;
  }
  .header-row {
    background-color: $light-blue-1;
  }
  .sub-header {
    font-weight: 500;
    color: $grey-7;
  }
  .quantity-input {
    .q-field__control {
      height: 30px;
      width: 45px;
    }
    .q-field__append {
      display: none;
    }
  }

  .max-80 {
    max-width: 85%;
    margin: auto;
  }
</style>
