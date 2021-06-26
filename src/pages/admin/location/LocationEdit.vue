<template>
  <q-page class="q-pa-md" >
    <div class="row">
      <div class="col-xs-12 col-sm-6 col-md-6 col-md-6">
        <q-form ref="form"
            @submit.prevent="updateLocation"
            lazy-validation
          >
          <q-card class="q-pa-md">
            <q-card-section>
              <div class="text-h6 text-weight-light">Update location</div>
            </q-card-section>
            <q-card-section>
              <q-input
                label="Name *"
                v-model="form.v1"
                ref="v1"
                required
                lazy-rules
                :rules="[val=> val && val.length > 0 || 'Name is required']"
                >
              </q-input>
            </q-card-section>
            <q-card-actions>
              <q-btn @click="navigate({ name: 'locations'})" color="primary">Back</q-btn>
               <q-btn @click="reset" color="primary">
                 Reset
                </q-btn>
              <q-space></q-space>
              <q-btn type="submit" color="primary">Update</q-btn>
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
      form: {
        v1: ''
      }
    }
  },
  methods: {
    reset () {
      this.$apollo.queries.location.refetch()
      this.$refs.v1.resetValidation()
    },
    navigate (to) {
      this.$router.push(to)
    },
    updateLocation () {
      this.$refs.v1.validate()
      if (
        this.$refs.v1.hasError
      ) {
        return
      }
      this.$apollo.mutate({
        mutation: updateDefault,
        variables: {
          input: {
            pk: this.pk,
            v1: this.form.v1,
            _version: this.form._version
          }
        },
        update: (store, { data: { putLocation } }) => {

        }
      }).then(data => {
        this.reset()
        this.$q.notify({
          color: 'primary',
          multiLine: false,
          message: 'Location updated',
          icon: 'info'
        })
        this.$router.push({ name: 'locations' })
      }).catch(error => {
        console.log({ error })
      })
    }
  },
  apollo: {
    location: {
      query: () => getAll,
      variables () {
        return {
          locations: true,
          locationId: this.pk
        }
      },
      update: data => {
        // return data.getAll.supplyOther[0]
      },
      result ({ data }) {
        if (data !== undefined) {
          this.form.v1 = data.getAll.locations[0].v1
          this.form._version = data.getAll.locations[0]._version
        }
      }
    }
  }
}
</script>
