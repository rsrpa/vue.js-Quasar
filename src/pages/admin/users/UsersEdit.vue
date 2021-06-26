<template>
  <q-page class="q-pa-md" >
    <div class="row">
      <div class="col-xs-12 col-sm-6 col-md-6 col-md-6">
        <q-form ref="form"
            @submit.prevent="updateSupply"
            lazy-validation
          >
          <q-card class="q-pa-md">
            <q-card-section>
              <div class="text-h6 text-weight-light">Update {{$store.getters['auth/isAuthenticated'].signInUserSession.idToken.payload['cognito:groups'].filter(g => g !=='admin')[0]}} managed supply unit</div>
            </q-card-section>
            <q-card-section>
              <q-input
                label="Name *"
                v-model="form.v2"
                ref="v2"
                required
                lazy-rules
                :rules="[val=> val && val.length > 0 || 'Name is required']"
                >
              </q-input>
              <q-input
                label="Barcode *"
                v-model="form.gsi2sk"
                ref="gsi2sk"
                required
                lazy-rules
                :rules="[val=> val && val.length > 0 || 'Barcode is required']"
                >
              </q-input>
              <q-input
                label="Supplier *"
                v-model="form.v3"
                ref="v3"
                required
                lazy-rules
                :rules="[val=> val && val.length > 0 || 'Supplier is required']"
                >
              </q-input>
              <q-input
                label="SKU *"
                v-model="form.v1"
                ref="v1"
                required
                lazy-rules
                :rules="[val=> val && val.length > 0 || 'SKU is required']"
                >
              </q-input>
            </q-card-section>
            <q-card-actions>
               <q-btn @click="reset" color="primary">
                 <!-- <q-icon name="arrow_back_ios" ></q-icon> -->
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
import putSupplyOther from '../../../graphql/mutations/putSupplyOther'
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
        v2: '',
        v3: '',
        gsi2sk: '',
        v1: ''
      }
    }
  },
  methods: {
    reset () {
      this.$apollo.queries.supply.refetch()
      this.$refs.v1.resetValidation()
      this.$refs.v2.resetValidation()
      this.$refs.v3.resetValidation()
      this.$refs.gsi2sk.resetValidation()
    },
    updateSupply () {
      this.$refs.v1.validate()
      this.$refs.v2.validate()
      this.$refs.v3.validate()
      this.$refs.gsi2sk.validate()
      if (
        this.$refs.v1.hasErrorcreated ||
        this.$refs.v2.hasError ||
        this.$refs.v3.hasError ||
        this.$refs.gsi2sk.hasError
      ) {
        return
      }
      this.$apollo.mutate({
        mutation: putSupplyOther,
        variables: {
          input: {
            pk: this.pk,
            gsi2sk: this.form.gsi2sk,
            v1: this.form.v1,
            v2: this.form.v2,
            v3: this.form.v3
          }
        },
        update: (store, { data: { putLocation } }) => {

        }
      }).then(data => {
        this.location = ''
        this.$q.notify({
          color: 'primary',
          multiLine: false,
          message: 'Supply updated',
          icon: 'info'
        })
        this.$router.push({ name: 'supply' })
      }).catch(error => {
        console.log({ error })
      })
    }
  },
  apollo: {
    supply: {
      query: () => getAll,
      variables () {
        return {
          locations: false,
          supplyAmtech: false,
          supplyOther: true,
          supplyOtherId: this.pk
        }
      },
      update: data => {
      },
      result ({ data }) {
        if (data !== undefined) {
          this.form.v1 = data.getAll.supplyOther[0].v1
          this.form.v2 = data.getAll.supplyOther[0].v2
          this.form.v3 = data.getAll.supplyOther[0].v3
          this.form.gsi2sk = data.getAll.supplyOther[0].gsi2sk
        }
      }
    }
  }
}
</script>
