<template>
  <q-page class="q-pa-md" >
    <div class="row">
      <div class="col-xs-12 col-sm-6 col-md-6 col-md-6">
        <q-form ref="form"
            @submit.prevent="createLocation"
            lazy-validation
          >
          <q-card class="q-pa-md">
            <q-card-section>
              <div class="text-h6 text-weight-light">Create a location for you inventory to be placed</div>
            </q-card-section>
            <q-card-section>
              <q-input
                label="Location *"
                v-model="location"
                ref="location"
                required
                lazy-rules
                :rules="[val=> val && val.length > 0 || 'Location is required']"
                >
              </q-input>
            </q-card-section>
            <q-card-actions>
              <q-btn @click="navigate({ name: 'locations'})" color="primary">Back</q-btn>
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
import putLocation from '../../../graphql/mutations/putLocation'
export default {
  name: 'Users',
  mounted () {
  },
  data () {
    return {
      location: ''
    }
  },
  methods: {
    reset () {
      this.location = ''
      this.$refs.location.resetValidation()
    },
    navigate (to) {
      this.$router.push(to)
    },
    createLocation () {
      this.$refs.location.validate()
      if (this.$refs.location.hasError) {
        return
      }
      this.$apollo.mutate({
        mutation: putLocation,
        variables: {
          input: {
            v1: this.location
          }
        },
        update: (store, { data: { putLocation } }) => {
        }
      }).then(data => {
        this.location = ''
        this.$q.notify({
          color: 'primary',
          multiLine: false,
          message: 'Location created',
          icon: 'info'
        })
        this.$router.push({ name: 'locations' })
      }).catch(error => {
        console.log({ error })
      })
    }
  }
}
</script>
