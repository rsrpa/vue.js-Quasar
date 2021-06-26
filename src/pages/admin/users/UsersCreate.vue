<template>
  <q-page class="q-pa-md" >
    <div class="row">
      <div class="col-xs-12 col-sm-6 col-md-6 col-md-6">
        <q-form ref="form"
            @submit.prevent="createUser"
            lazy-validation
          >
          <q-card class="q-pa-md">
            <q-card-section>
              <div class="text-h6 text-weight-light">Create user</div>
            </q-card-section>
            <q-card-section>
              <q-input
                label="Email *"
                v-model="email"
                ref="email"
                required
                lazy-rules
                :rules="[val=> !!val && val.length > 0 || 'Email is required', isValidEmail]"
                >
              </q-input>
              <q-input
                label="Name *"
                v-model="name"
                ref="name"
                required
                lazy-rules
                :rules="[val=> !!val && val.length > 0 || 'Name is required']"
                >
              </q-input>
              <div>Roles</div>
               <!-- <q-checkbox left-label v-model="admin" label="Admin" /> -->
               <div v-for="role in options()" v-bind:key="role">
                  <q-checkbox   v-model="checkered[role]"  @input="updateRole($event, role)"  >{{role}}</q-checkbox>
               </div>
            </q-card-section>
            <q-card-actions>
               <q-btn @click.prevent="reset" color="primary" >Reset</q-btn>
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
import createUser from '../../../graphql/mutations/createUser'
export default {
  name: 'UsersCreate',
  mounted () {
    this.$store.getters['auth/getRoles'].forEach(x => {
      this.checkered[x] = false
    })
  },
  data () {
    return {
      email: '',
      name: '',
      checkered: {
        admin: false,
        basic: false,
        advanced: false
      }
    }
  },
  methods: {
    updateRole (event, role) {
      this.checkered[role] = event
    },
    isValidEmail (val) {
      const emailPattern = /^(?=[a-zA-Z0-9@._%+-]{6,254}$)[a-zA-Z0-9._%+-]{1,64}@(?:[a-zA-Z0-9-]{1,63}\.){1,8}[a-zA-Z]{2,63}$/
      return emailPattern.test(val) || 'Invalid email'
    },
    options () {
      return this.$store.getters['auth/getRoles']
    },
    reset () {
      this.email = ''
      this.name = ''
      this.admin = false
      this.checkered.admin = false
      this.checkered.basic = false
      this.checkered.advanced = false
      this.$refs.email.resetValidation()
    },

    createUser () {
      this.$refs.email.validate()
      if (
        this.$refs.email.hasError
      ) {
        return
      }
      const keys = Object.keys(this.checkered)
      const roles = keys.reduce((result, k) => {
        if (this.checkered[k] === true) {
          result.push(k)
        }
        return result
      }, []).join()
      if (roles.length === 0) {
        this.$q.notify({
          color: 'primary',
          multiLine: false,
          message: 'No roles selected',
          position: 'top',
          icon: 'info'
        })
        return
      }
      this.$apollo.mutate({
        mutation: createUser,
        variables: {
          admin: this.admin,
          name: this.name,
          email: this.email,
          roles: roles
        },
        update: (store, { data: { createUser } }) => {

        }
      }).then(data => {
        this.email = ''
        this.admin = false
        this.$refs.email.resetValidation()
        this.$q.notify({
          color: 'primary',
          multiLine: false,
          message: 'User created',
          icon: 'info'
        })
        this.$router.push({ name: 'users' })
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
  }
}
</script>
