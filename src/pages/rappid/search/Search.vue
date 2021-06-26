<template>
  <q-page class="row items-center justify-evenly q-pa-lg">
    <q-dialog v-model="dialog.form" persistent>
      <q-card class="q-pa-md" style="width: 700px;">
        <q-form ref="form" @submit.prevent="save" lazy-validation>
          <q-card-section>
            <div class="text-h6 text-weight-light">
              Add
              <b class="text-nt-orange">{{ form.supplyObj.v2 }}</b>
              to favourites
            </div>
          </q-card-section>
          <q-card-section>
            <q-select
              ref="favObj"
              v-model="form.favObj"
              :options="FavouriteOptions"
              label="Favourite Group"
              @filter="filterFn"
              option-label="v2"
            >
              <template v-slot:option="scope">
                <q-item v-bind="scope.itemProps" v-on="scope.itemEvents">
                  <q-item-label class="text-black" caption>
                    <strong class="text-subtitle1">{{ scope.opt.v2 }}</strong>
                  </q-item-label>
                </q-item>
              </template>
            </q-select>
          </q-card-section>
          <q-card-actions>
            <q-btn @click="close()" color="primary">Close</q-btn>
            <q-space></q-space>
            <q-btn type="submit" color="primary">Save</q-btn>
          </q-card-actions>
        </q-form>
      </q-card>
    </q-dialog>

    <div class="full-width row justify-evenly items-center">
      <q-table
        title="Products"
        grid
        :data="Supplies.getAll.supplyTypeR.items"
        :loading="loading"
        color="nt-orange"
        :columns="columns"
        :filter="filter"
        :pagination.sync="pagination"
        class="full-width justify-evenly search-content-table"
        card-container-class="justify-center"
        hide-pagination
      >
        <template v-slot:item="props">
          <CardItem :item="props.row" @add-favourite="addFavourite"></CardItem>
        </template>
        <template v-slot:top>
          <q-item-label class="text-h5 text-amber text-bold">
            Search for Products
          </q-item-label>
          <q-input
            class="full-width q-mt-md search-field"
            square
            dense
            bottom-slots
            debounce="300"
            placeholder="What are you looking for"
            bg-color="white"
            color="nt-orange"
            borderless
            v-model="filter"
            input-class="search-input"
          >
            <template v-slot:prepend>
              <q-icon class="q-pl-md" color="grey" name="search" />
            </template>
            <template v-slot:append>
              <q-btn
                v-if="$q.screen.gt.xs"
                no-caps
                class="q-px-lg font-normal"
                color="nt-orange"
              >
                Search
              </q-btn>
            </template>
          </q-input>

          <!-- <div
            v-if="!loading"
            class="row justify-between items-center full-width"
          >
            <div class="row items-center">
              <q-item-label class="text-white q-mr-md"
                >Items {{ currentPageItems }} of
                {{ Supplies.getAll.supplyTypeR.items.length }}</q-item-label
              >

              <q-btn
                v-if="scope.pagesNumber > 2"
                icon="first_page"
                color="white"
                round
                dense
                flat
                :disable="scope.isFirstPage"
                @click="scope.firstPage"
              />

              <q-btn
                icon="chevron_left"
                color="white"
                round
                dense
                flat
                :disable="scope.isFirstPage"
                @click="scope.prevPage"
              />

              <q-btn
                icon="chevron_right"
                color="white"
                round
                dense
                flat
                :disable="scope.isLastPage"
                @click="scope.nextPage"
              />

              <q-btn
                v-if="scope.pagesNumber > 2"
                icon="last_page"
                color="white"
                round
                dense
                flat
                :disable="scope.isLastPage"
                @click="scope.lastPage"
              />
            </div>

            <div class="row justify-center">
              <q-select
                :options="showColOptions"
                options-dense
                dense
                bg-color="white"
                color="grey-8"
                class="q-mr-md show-col-field"
                v-model="pagination.rowsPerPage"
              >
                <template v-slot:prepend>
                  <q-item-label class="select-label text-grey-8 q-pl-md"
                    >Show</q-item-label
                  >
                </template>
              </q-select>

              <q-select
                :options="sortColOptions"
                class="sort-col-field"
                options-dense
                dense
                bg-color="white"
                color="grey-8"
                v-model="sortedFilter"
              >
                <template v-slot:prepend>
                  <q-item-label class="select-label text-grey-8 q-pl-md"
                    >Sort:</q-item-label
                  >
                </template>
              </q-select>
            </div>
          </div> -->
        </template>
      </q-table>
      <div class="row justify-center full-width">
        <div class="col-12 q-mt-lg">
          <div class="flex justify-center">
            <div class="flex justify-between full-width">
              <q-pagination
                v-model="pagination.page"
                color="orange"
                :min="1"
                :max="computedMaxPaggination"
                :max-pages="10"
                boundary-links
              />
              <q-select
                :options="showColOptions"
                options-dense
                dense
                bg-color="white"
                color="grey-8"
                class="q-mr-md show-col-field"
                v-model="pagination.rowsPerPage"
              >
                <template v-slot:prepend>
                  <q-item-label class="select-label text-grey-8 q-pl-md">
                    Show
                  </q-item-label>
                </template>
              </q-select>
            </div>
          </div>
        </div>
      </div>
    </div>
  </q-page>
</template>

<script>
import addFavourite from '../../../graphql/mutations/addFavourite'
import getAll from '../../../graphql/queries/getAll'
import CardItem from './CardItem'

export default {
  name: 'EntryPage',
  components: {
    CardItem
  },
  data () {
    return {
      showColOptions: [5, 10, 15, 20, 25, 50, 100],
      sortColOptions: ['Newest'],
      current: 1,
      sortedFilter: 'Newest',
      supply: [],
      Favourites: {
        getAll: {
          favsGroups: []
        }
      },
      FavouriteOptions: [],
      dialog: {
        form: false
      },
      loading: true,
      Options: [],
      Supplies: {
        getAll: {
          supplyTypeR: {
            items: []
          }
        }
      },
      form: {
        supplyObj: {
          v2: ''
        },
        favObj: ''
      },
      Slippery: [],
      pagination: {
        sortBy: 'v1',
        descending: false,
        page: 1,
        rowsPerPage: 10
      },
      filter: '',
      columns: [
        {
          label: 'Product Name',
          align: 'left',
          field: 'v2',
          name: 'v2',
          sortable: true
        },
        {
          label: 'SKU',
          align: 'left',
          field: 'v1',
          name: 'v1',
          sortable: true
        },
        {
          label: 'Price (NZD)',
          align: 'left',
          field: 'v5',
          name: 'v5',
          sortable: true
        }
        // { label: 'Managed by', align: 'left', field: 'gsi1pk', name: 'gsi1pk', sortable: true },
        // { label: 'Supplier', align: 'left', field: 'v3', name: 'v3', sortable: true }
      ]
    }
  },
  computed: {
    currentPageItems () {
      const itemNumber =
        this.pagination.rowsPerPage * this.pagination.page - this.pagination.rowsPerPage
      return `${itemNumber + 1} - ${itemNumber + this.pagination.rowsPerPage}`
    },
    computedMaxPaggination () {
      let maxNumber
      if (this.filter.length >= 2) {
        maxNumber =
          this.Supplies.getAll.supplyTypeR.items.filter((x) =>
            x.v2.toLowerCase().includes(this.filter.toLowerCase())
          ).length / this.pagination.rowsPerPage
      } else {
        maxNumber = Math.floor(
          this.Supplies.getAll.supplyTypeR.items.length / this.pagination.rowsPerPage
        )
      }
      return maxNumber > 0 ? maxNumber : 1
    }
  },
  methods: {
    addFavourite (row) {
      this.dialog.form = true
      this.form.supplyObj = row
    },
    save () {
      this.$apollo
        .mutate({
          mutation: addFavourite,
          variables: {
            favPK: this.form.favObj.pk,
            supplyPK: this.form.supplyObj.pk
          },
          update: (store, { data: { putLocation } }) => {}
        })
        .then((data) => {
          this.location = ''
          this.$q.notify({
            color: 'primary',
            multiLine: false,
            message: 'Item Added To Favourites',
            position: 'top',
            icon: 'info'
          })
        })
        .catch((error) => {
          console.log({ error })
        })
      this.close()
    },
    filterFn (val, update, abort) {
      update(() => {
        const needle = val.toLowerCase()
        this.FavouriteOptions = this.Favourites.filter(
          (v) => v.v2.toLowerCase().indexOf(needle) > -1
        )
      })
    },
    close () {
      this.dialog.form = false
      this.form.favObj = ''
      this.form.supplyObj = ''
    },
    navigate (name, pk) {
      // const to = { name: name, params: { pk: pk } }
      this.$router.push({ name: name, params: { pk: pk } })
    }
    // search () {
    //   console.log(this.filter)
    //   const needle = this.filter.toLowerCase()
    //   this.Options = this.Supplies.getAll.supply.items.filter(v => v.v2.toLowerCase().indexOf(needle) > -1 || v.v1.toLowerCase().indexOf(needle) > -1)
    // }
  },
  apollo: {
    Favourites: {
      query: () => getAll,
      variables () {
        return {
          favs: true,
          groups: true
        }
      },
      update: (data) => {
        const favData = []
        let label = ''
        data.getAll.favs.forEach((x) => {
          label = x.v2
          x.groups.forEach((y) => {
            favData.push({
              pk: y.pk,
              v2: '[' + label + ']' + ' - ' + y.v2
            })
          })
        })
        return favData
      }
    },
    Supplies: {
      query: () => getAll,
      variables: {
        supplyTypeR: true,
        supplySOH: true,
        supplyNextToken: null
      },
      update: (data) => {
        return data
      },
      async result ({ data, loading }) {
        if (!loading) {
          this.loading = false
          if (data.getAll.supplyTypeR.nextToken !== null) {
            this.loading = true
            // todo https://github.com/apollographql/apollo-client/issues/4114 wrap fetch more in a try catch
            try {
              await this.$apollo.queries.Supplies.fetchMore({
                variables: {
                  supplyTypeR: true,
                  supplySOH: true,
                  supplyNextToken: data.getAll.supplyTypeR.nextToken
                },
                updateQuery: (previousResult, { fetchMoreResult }) => {
                  return {
                    getAll: {
                      __typename: previousResult.getAll.__typename,
                      supplyTypeR: {
                        __typename: previousResult.getAll.supplyTypeR.__typename,
                        items: [
                          ...previousResult.getAll.supplyTypeR.items,
                          ...fetchMoreResult.getAll.supplyTypeR.items
                        ],
                        nextToken: fetchMoreResult.getAll.supplyTypeR.nextToken
                      }
                    }
                  }
                }
              })
            } catch (e) {}
          }
        }
      }
    }
  }
}
</script>
<style scoped lang="scss">
.search-field {
  .q-btn {
    border-bottom-left-radius: 0;
    border-top-left-radius: 0;
    height: 40px;
  }
}
.show-col-field {
  width: 7rem;
}
.sort-col-field {
  width: 10rem;
}
.select-label {
  font-size: 0.9rem;
}
</style>
