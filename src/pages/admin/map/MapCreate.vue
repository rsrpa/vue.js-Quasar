<template>
  <q-page class="q-pa-md" >
    <div class="row">
      <div class="col-xs-12 col-sm-6 col-md-6 col-md-6">
        <q-form ref="form"
            @submit.prevent="createMap"
            lazy-validation
          >
          <q-card class="q-pa-md">
            <q-card-section>
              <div class="text-h6 text-weight-light">Create a map of how supplied units are used</div>
            </q-card-section>
            <q-card-section>
              <q-input
                label="Name *"
                v-model="map.v1"
                hint="Common name used within your company"
                ref="v1"
                required
                lazy-rules
                :rules="[val=> val && val.length > 0 || 'Name is required']"
                >
              </q-input>
              <q-select
                ref="supplyObj"
                v-model="map.supplyObj"
                :options="Options"
                label="Supply"
                :loading="loading"
                fill-input
                use-input
                hide-selected
                input-debounce="0"
                @filter="filterFn"
                option-label="v2"
                :rules="[val => !!val || 'Supply is required']"
               />
              <q-input
                label="Stocked UOM *"
                v-model="map.v5"
                ref="v5"
                required
                hint="How many units 1 supply unit equates to"
                lazy-rules
                :rules="[val => !!val && Number.isInteger(Number(val)) || 'A integer value is required']"
                >
              </q-input>
              <q-input
                label="Consume Rate *"
                v-model="map.v4"
                ref="v4"
                required
                lazy-rules
                hint="The rate at which units are consumed at"
                :rules="[val => !!val && Number.isInteger(Number(val)) || 'A integer value is required']"
                >
              </q-input>
              <q-input
                label="Minimum Stock Level *"
                v-model="map.v2"
                ref="v2"
                required
                lazy-rules
                :rules="[val => !!val && Number.isInteger(Number(val)) || 'A integer value is required']"
                >
              </q-input>
              <q-input
                label="Maximum Stock Level *"
                v-model="map.v3"
                ref="v3"
                required
                lazy-rules
                :rules="[val => !!val && Number.isInteger(Number(val)) || 'A integer value is required']"
                >
              </q-input>
            </q-card-section>
            <q-card-actions>
              <q-btn @click="navigate({ name: 'maps'})" color="primary">Back</q-btn>
               <q-btn @click.prevent="reset" color="primary">Reset</q-btn>
              <q-space></q-space>
              <q-btn type="submit" color="primary">Save</q-btn>
            </q-card-actions>
          </q-card>
        </q-form>
      </div>
    </div>
  </q-page>
</template>

<script>
import putMap from '../../../graphql/mutations/putMap'
import getAll from '../../../graphql/queries/getAll'
export default {
  name: 'MapCreate',
  mounted () {
    this.$apollo.queries.Supplies.setOptions({
      fetchPolicy: 'network-only'
    })
  },
  data () {
    return {
      loading: true,
      Supplies: {
        getAll: {
          supplyTypeR: {
            items: []
          }
        }
      },
      map: {
        supplyObj: '',
        v1: '',
        v2: '',
        v3: '',
        v4: '',
        v5: ''
      },
      Options: []
    }
  },
  methods: {
    filterFn (val, update, abort) {
      update(() => {
        const needle = val.toLowerCase()
        this.Options = this.Supplies.getAll.supplyTypeR.items.filter(v => v.v2.toLowerCase().indexOf(needle) > -1 || v.v1.toLowerCase().indexOf(needle) > -1)
      })
    },
    navigate (to) {
      this.$router.push(to)
    },
    reset () {
      this.map.supplyObj = ''
      this.map.v1 = ''
      this.map.v2 = ''
      this.map.v3 = ''
      this.map.v4 = ''
      this.map.v5 = ''

      this.$refs.supplyObj.resetValidation()
      this.$refs.v1.resetValidation()
      this.$refs.v2.resetValidation()
      this.$refs.v3.resetValidation()
      this.$refs.v4.resetValidation()
      this.$refs.v5.resetValidation()
    },

    createMap () {
      this.$refs.supplyObj.validate()
      this.$refs.v1.validate()
      this.$refs.v2.validate()
      this.$refs.v3.validate()
      this.$refs.v4.validate()
      this.$refs.v5.validate()
      if (
        this.$refs.supplyObj.hasError ||
        this.$refs.v1.hasError ||
        this.$refs.v2.hasError ||
        this.$refs.v3.hasError ||
        this.$refs.v4.hasError ||
        this.$refs.v5.hasError
      ) {
        return
      }
      this.$apollo.mutate({
        mutation: putMap,
        variables: {
          input: {
            gsi1sk: this.map.supplyObj.pk,
            gsi2pk: this.map.supplyObj.pk,
            v1: this.map.v1,
            v2: this.map.v2,
            v3: this.map.v3,
            v4: this.map.v4,
            v5: this.map.v5
          }
        },
        update: (store, { data: { putMap } }) => {

        }
      }).then(data => {
        this.location = ''
        this.$q.notify({
          color: 'primary',
          multiLine: false,
          message: 'Map created',
          icon: 'info'
        })
        this.$router.push({ name: 'maps' })
      }).catch(e => {
        this.$q.notify({
          color: 'red',
          multiLine: false,
          message: e.graphQLErrors[0].message,
          icon: 'error'
        })
        console.log({ e })
      })
    }
  },
  apollo: {
    Supplies: {
      query: () => getAll,
      variables: {
        supplyTypeR: true,
        supplyNextToken: null
      },
      update: data => {
        return data
      },
      async result ({ data, loading }) {
        if (!loading) {
          this.loading = false
          if (data.getAll.supplyTypeR.nextToken !== null) {
            try {
              await this.$apollo.queries.Supplies.fetchMore({
                variables: {
                  supplyTypeR: true,
                  supplyNextToken: data.getAll.supplyTypeR.nextToken
                },
                updateQuery: (previousResult, { fetchMoreResult }) => {
                  return {
                    getAll: {
                      __typename: previousResult.getAll.__typename,
                      supplyTypeR: {
                        __typename: previousResult.getAll.supplyTypeR.__typename,
                        items: [...previousResult.getAll.supplyTypeR.items, ...fetchMoreResult.getAll.supplyTypeR.items],
                        nextToken: fetchMoreResult.getAll.supplyTypeR.nextToken
                      }
                    }
                  }
                }
              })
            } catch (e) {
              // console.log(e)
            }
          }
        }
      }
    }
  }
}
</script>
