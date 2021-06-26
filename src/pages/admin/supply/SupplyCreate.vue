<template>
  <q-page class="q-pa-md" >
    <div class="row">
      <div class="col-xs-12 col-sm-6 col-md-6 col-md-6">
        <q-form ref="form"
            @submit.prevent="createSupply"
            lazy-validation
          >
          <q-card class="q-pa-md">
            <q-card-section>
              <div class="text-h6 text-weight-light">Create {{$store.getters['auth/isAuthenticated'].signInUserSession.idToken.payload['cognito:groups'].filter(g => g !=='admin')[0]}} managed supply unit</div>
            </q-card-section>
            <q-card-section>
              <q-input
                label="Name *"
                v-model="form.name"
                ref="name"
                required
                lazy-rules
                :rules="[val=> val && val.length > 0 || 'Name is required']"
                >
              </q-input>
              <q-input
                label="Barcode *"
                v-model="form.barcode"
                ref="barcode"
                required
                lazy-rules
                :rules="[val=> val && val.length > 0 || 'Barcode is required']"
                >
              </q-input>
              <q-input
                label="Supplier *"
                v-model="form.supplier"
                ref="supplier"
                required
                lazy-rules
                :rules="[val=> val && val.length > 0 || 'Supplier is required']"
                >
              </q-input>
              <q-input
                label="SKU *"
                v-model="form.sku"
                ref="sku"
                required
                lazy-rules
                :rules="[val=> val && val.length > 0 || 'SKU is required']"
                >
              </q-input>
            </q-card-section>
            <q-card-actions>
              <q-btn @click="navigate({ name: 'supply'})" color="primary">Back</q-btn>
              <q-btn @click="reset" color="primary">reset</q-btn>
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
import putSupply from '../../../graphql/mutations/putSupply'
export default {
  name: 'SupplyCreate',
  mounted () {
  },
  data () {
    return {
      form: {
        name: '',
        supplier: '',
        barcode: '',
        sku: ''
      }
    }
  },
  methods: {
    reset () {
      this.form.name = ''
      this.form.supplier = ''
      this.form.barcode = ''
      this.form.sku = ''
      this.$refs.name.resetValidation()
      this.$refs.supplier.resetValidation()
      this.$refs.barcode.resetValidation()
      this.$refs.sku.resetValidation()
    },
    navigate (to) {
      this.$router.push(to)
    },
    createSupply () {
      this.$refs.name.validate()
      this.$refs.supplier.validate()
      this.$refs.barcode.validate()
      this.$refs.sku.validate()
      if (
        this.$refs.name.hasError ||
        this.$refs.supplier.hasError ||
        this.$refs.barcode.hasError ||
        this.$refs.sku.hasError
      ) {
        return
      }
      this.$apollo.mutate({
        mutation: putSupply,
        variables: {
          input: {
            gsi2sk: this.form.barcode,
            v1: this.form.sku,
            v2: this.form.name,
            v3: this.form.supplier,
            _version: 1
          }
        },
        update: (store, { data: { putLocation } }) => {

        }
      }).then(data => {
        this.location = ''
        this.$q.notify({
          color: 'primary',
          multiLine: false,
          message: 'Supply created',
          icon: 'info'
        })
        this.$router.push({ name: 'supply' })
      }).catch(error => {
        console.log({ error })
      })
    }
  }
}
</script>
