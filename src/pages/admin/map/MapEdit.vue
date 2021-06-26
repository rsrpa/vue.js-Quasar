<template>
  <q-page class="q-pa-md" >
    <div class="row">
      <div class="col-xs-12 col-sm-6 col-md-6 col-md-6">
        <q-form ref="form"
            @submit.prevent="updateMap"
            lazy-validation
          >
          <q-card class="q-pa-md">
            <q-card-section>
              <div class="text-h6 text-weight-light">Edit a map of how supplied units are used</div>
            </q-card-section>
            <q-card-section>
              <q-input
                label="Name *"
                v-model="mapEdit.v1"
                hint="Common name used within your company"
                ref="v1"
                required
                lazy-rules
                :rules="[val=> val && val.length > 0 || 'Name is required']"
                >
              </q-input>
              <q-select
                ref="supplyObj"
                v-model="mapEdit.supplyObj"
                :options="Options"
                label="Supply"
                :disable="true"
                fill-input
                use-input
                hide-selected
                input-debounce="0"
                option-label="v2"
                :rules="[val => !!val || 'Supply is required']"
               />
              <q-input
                label="Stocked UOM *"
                v-model="mapEdit.v5"
                ref="v5"
                required
                hint="How many units 1 supply unit equates to"
                lazy-rules
                :rules="[val => !!val && Number.isInteger(Number(val)) || 'A integer value is required']"
                >
              </q-input>
              <q-input
                label="Consume Rate *"
                v-model="mapEdit.v4"
                ref="v4"
                required
                lazy-rules
                hint="The rate at which units are consumed at"
                :rules="[val => !!val && Number.isInteger(Number(val)) || 'A integer value is required']"
                >
              </q-input>
              <q-input
                label="Minimum Stock Level *"
                v-model="mapEdit.v2"
                ref="v2"
                required
                lazy-rules
                :rules="[val => !!val && Number.isInteger(Number(val)) || 'A integer value is required']"
                >
              </q-input>
              <q-input
                label="Maximum Stock Level *"
                v-model="mapEdit.v3"
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
import getAll from '../../../graphql/queries/getAll'
import updateDefault from '../../../graphql/mutations/updateDefault'
export default {
  name: 'SupplyEdit',
  props: [
    'pk'
  ],
  mounted () {
  },
  data () {
    return {
      Options: [],
      mapEdit: {
        v1: '',
        v2: '',
        v3: '',
        v4: '',
        v5: '',
        supplyObj: ''
      }
    }
  },
  methods: {
    navigate (to) {
      this.$router.push(to)
    },
    reset () {
      this.$apollo.queries.map.refetch()
      this.$refs.v1.resetValidation()
      this.$refs.v2.resetValidation()
      this.$refs.v3.resetValidation()
      this.$refs.v4.resetValidation()
      this.$refs.v5.resetValidation()
      this.$refs.supplyObj.resetValidation()
    },
    updateMap () {
      this.$refs.v1.validate()
      this.$refs.v2.validate()
      this.$refs.v3.validate()
      this.$refs.v4.validate()
      this.$refs.v5.validate()
      this.$refs.supplyObj.validate()
      if (
        this.$refs.v1.hasError ||
        this.$refs.v2.hasError ||
        this.$refs.v3.hasError ||
        this.$refs.v4.hasError ||
        this.$refs.v5.hasError ||
        this.$refs.supplyObj.hasError
      ) {
        return
      }

      const input = {
        pk: this.pk,
        gsi1sk: this.mapEdit.supplyObj.pk,
        gsi2pk: this.mapEdit.supplyObj.pk,
        v1: this.mapEdit.v1,
        v2: this.mapEdit.v2,
        v3: this.mapEdit.v3,
        v4: this.mapEdit.v4,
        v5: this.mapEdit.v5,
        _version: this.mapEdit._version
      }
      this.$apollo.mutate({
        mutation: updateDefault,
        variables: {
          input: input
        },
        update: (store, { data: { putMap } }) => {
        }
      }).then(data => {
        this.location = ''
        this.$q.notify({
          color: 'primary',
          multiLine: false,
          message: 'Map updated',
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
    map: {
      query: () => getAll,
      variables () {
        return {
          mapsTypeR: true,
          mapId: this.pk
        }
      },
      update: data => {
      },
      result ({ data }) {
        if (data !== undefined) {
          this.mapEdit.v1 = data.getAll.mapsTypeR.items[0].v1
          this.mapEdit.v2 = data.getAll.mapsTypeR.items[0].v2
          this.mapEdit.v3 = data.getAll.mapsTypeR.items[0].v3
          this.mapEdit.v4 = data.getAll.mapsTypeR.items[0].v4
          this.mapEdit.v5 = data.getAll.mapsTypeR.items[0].v5
          this.mapEdit._version = data.getAll.mapsTypeR.items[0]._version
          this.mapEdit.supplyObj = data.getAll.mapsTypeR.items[0].supply
        }
      }
    }
  }
}
</script>
