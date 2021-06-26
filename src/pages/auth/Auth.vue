<template>
  <q-layout view="hHh lpR fFf">
    <q-page-container>
      <q-page padding v-if="formState === 'login'" >
        <div class="row justify-center items-end content-center">
          <div class="col-xs-12 col-sm-12 col-md-4 col-lg-4" style="max-width:500px;padding-top: 2%">
             <q-card class="no-shadow" >
                <q-card-section style="text-align:center" >
                  <q-img
                    :src="require('assets/logo-transparent.svg')"
                    spinner-color="white"
                    contain
                    style="max-height:225px;padding-bottom: 250px;"
                  />
                </q-card-section>
                <q-form
                  @submit.prevent="signIn"
                  >
                  <q-card-section>
                    <q-input
                      type="email"
                      dense
                      label-color="white"
                      color="white"
                      dark
                      bottom-slots
                      v-model.trim="login.email"
                      label="Username"
                      error-message="Valid email is required"
                      :error="$v.login.email.$error"
                      @keyup.enter="signIn"
                    >
                      <template v-slot:before>
                        <q-icon
                          name="far fa-user"
                          size="1.35rem"
                          color="light-blue-4"
                        />
                      </template>
                    </q-input>
                    <q-input
                      dense
                      label-color="white"
                      color="white"
                      dark
                      type="password"
                      v-model.trim="$v.login.pass.$model"
                      label="Password"
                      bottom-slots
                      error-message="Password length of 6 required"
                      :error="$v.login.pass.$error"
                      @keyup.enter="signIn"
                    >
                      <template v-slot:before>
                        <q-icon
                          name="fas fa-lock"
                          size="1.35rem"
                          color="light-blue-4"
                        />
                      </template>
                    </q-input>
                  </q-card-section>
                  <q-card-section>
                    <q-btn
                      no-caps
                      unelevated
                      padding="10px 20px"
                      :loading="false"
                      color="deep-orange-4"
                      label="Log in"
                      class="full-width no-shadow"
                      @click.prevent="signIn"
                    />
                    <q-btn
                      flat
                      no-caps
                      unelevated
                      :to="{name:'reset'}"
                      color="white"
                      label="Forgotten your password?"
                      class="full-width q-mt-xl"
                    />
                  </q-card-section>
               </q-form>
            </q-card>
          </div>
        </div>
      </q-page>
      <q-page padding v-if="formState === 'new'" >
        <div class="row justify-center items-end content-center">
          <div class="col-xs-12 col-sm-12 col-md-5 col-lg-5" style="max-width:500px;padding-top: 2%">
             <q-card class="no-shadow" >
                <q-card-section style="text-align:center">
                  <q-img
                    :src="require('assets/logo-transparent.svg')"
                    spinner-color="white"
                    contain
                    style="max-height:225px;padding-bottom: 250px;"
                    />
                    <div class="text-h6 text-white q-mt-md">Set new password</div>
                </q-card-section>
                <q-form
                  @submit.prevent="newPassword"
                  >
                  <q-card-section>
                    <q-input
                      dense
                      dark
                      label-color="white"
                      color="white"
                      type="password"
                      v-model.trim="$v.newPass.pass.$model"
                      label="Password *"
                      bottom-slots
                      error-message="Password length of 6 required"
                      :error="$v.newPass.pass.$error"
                    />
                    <q-input
                      dense
                      dark
                      label-color="white"
                      color="white"
                      type="password"
                      v-model.trim="$v.newPass.repeatpass.$model"
                      label="Confirm Password *"
                      bottom-slots
                      error-message="Passwords must match"
                      :error="$v.newPass.repeatpass.$error"
                    />
                  </q-card-section>
                  <q-card-section>
                    <q-btn
                      no-caps
                      unelevated
                      padding="10px 20px"
                      :loading="false"
                      color="deep-orange-4"
                      label="Set Password"
                      class="full-width no-shadow"
                      type="submit"
                    />
                    <q-btn
                      flat
                      no-caps
                      unelevated
                      @click="formState='login'"
                      color="white"
                      label="Back"
                      class="full-width q-mt-xl"
                    />
                  </q-card-section>
               </q-form>
               <!-- <q-card-section>
                  <q-btn flat  color="primary" size="sm" :to="{name:'reset'}" label="Forgot password" />
               </q-card-section> -->
            </q-card>
          </div>
        </div>
      </q-page>
    </q-page-container>
  </q-layout>
</template>

<script>
import { required, sameAs, minLength, email } from 'vuelidate/lib/validators'

export default {
  name: 'app',
  data () {
    return {
      tempUser: {},
      login: {
        email: '',
        pass: ''
      },
      formState: 'login',
      step: 1,
      step1Done: false,
      step2Done: false,
      step3Done: false,
      newPass: {
        pass: '',
        repeatpass: ''
      },
      validation: {
        code: ''
      }
    }
  },

  validations: {
    login: {
      email: {
        required,
        email
      },
      pass: {
        required,
        minLength: minLength(6)
      }
    },
    newPass: {
      pass: {
        required,
        minLength: minLength(6)
      },
      repeatpass: {
        sameAspass: sameAs('pass')
      }
    },
    validation: {
      code: {
        required,
        minLength: minLength(6)
      }
    }
  },

  components: {

  },

  methods: {
    onVerify: function (response) {
      this.captcha = true
    },
    onExpired: function () {
    },
    toggle () {
      this.$v.$reset()
      this.formState === 'login' ? this.formState = 'new' : this.formState = 'login'
    },
    async newPassword () {
      this.$v.newPass.$touch()
      if (this.$v.newPass.$invalid) {
        return
      }
      this.$q.loading.show()
      const pass = this.newPass.pass
      await this.$Auth.completeNewPassword(
        this.tempUser,
        pass
      ).then(user => {
        this.$AmplifyEventBus.$emit('authState', 'signedIn')

        this.$q.loading.hide()
      }).catch(e => {
        this.$q.loading.hide()
        if (e.message) {
          this.$q.notify({
            color: 'red',
            message: e.message,
            icon: 'error'
          })
        } else {
          this.$q.notify({
            color: 'red',
            message: e,
            icon: 'error'
          })
        }
      })
    },
    async signIn () {
      this.$v.login.$touch()
      if (this.$v.login.$invalid) {
        return
      }

      this.$q.loading.show()
      const { email, pass } = this.login
      await this.$Auth.signIn(email.toLowerCase(), pass).then(async user => {
        if (user.challengeName === 'NEW_PASSWORD_REQUIRED') {
          this.tempUser = user
          this.toggle()
          this.$q.loading.hide()
          this.$v.$reset()
          this.newPass.pass = ''
          this.newPass.repeatpass = ''
          return
        }
        await this.$Auth.currentAuthenticatedUser({ bypassCache: true })
        this.$AmplifyEventBus.$emit('authState', 'signedIn')
        // this.$router.push({ name: 'dashboard' })
        this.$q.loading.hide()
      }).catch(e => {
        console.log('error :', e)
        this.$q.loading.hide()
        // this.load = false;
        if (e.code && e.code === 'UserNotFoundException') {
          this.step = 1
          this.formState = 'login'
          this.$q.notify({
            color: 'blue',
            multiLine: true,
            message: e.message + ' Please check with your company regarding access.',
            icon: 'info'
          })
          return
        }
        if (e.message) {
          this.$q.notify({
            color: 'red',
            message: e.message,
            icon: 'error'
          })
        } else {
          this.$q.notify({
            color: 'red',
            message: e,
            icon: 'error'
          })
        }
      })
    },
    async register () {
      this.$v.form.$touch()
      if (this.$v.form.$invalid) {
        return
      }
      // if(!this.captcha){
      //   this.$q.notify({
      //         color:'blue',
      //         multiLine: true,
      //         message:'Please confirm you are not a robot',
      //         icon: 'info',
      //       })
      //   return
      // }
      await this.$Auth.signUp({
        username: this.form.email.toLowerCase(),
        password: this.form.pass,
        attributes: {
          given_name: this.form.given_name
        }
      }).then(data => {
        // eslint-disable-next-line no-unused-expressions
        this.$v.validation.$reset
        this.step1Done = true
        this.step = 2
        this.$q.notify({
          color: 'primary',
          icon: 'info',
          message: 'Please check your email for the confirmation code'
        })
      }).catch(e => {
        this.load = false
        this.$v.form.$reset()
        if (e.message) {
          this.$q.notify({
            color: 'red',
            message: e.message,
            icon: 'error',
            position: 'top'
          })
        } else {
          this.$q.notify({
            color: 'red',
            message: e,
            icon: 'error',
            position: 'top'
          })
        }
        console.log('error ', e)
      })
    },
    async validate () {
      this.$q.loading.show()
      await this.$Auth.confirmSignUp(this.form.email.toLowerCase(), this.validation.code).then(data => {
        this.$q.loading.hide()
        this.step2Done = true
        this.step = 3
        this.$q.notify({
          color: 'primary',
          message: 'Your email has been verified',
          icon: 'info'
        })
      }).catch(e => {
        this.$q.loading.hide()
        if (e.message) {
          this.$q.notify({
            color: 'red',
            message: e.message,
            icon: 'error'
          })
        } else {
          this.$q.notify({
            color: 'red',
            message: e,
            icon: 'error'
          })
        }
        console.log('error ', e)
      })
    },
    async resend () {
      this.$q.loading.show()
      await this.$Auth.resendSignUp(this.form.email.toLowerCase()).then(data => {
        this.$q.loading.hide()
        this.$q.notify({
          color: 'primary',
          message: 'Another confirmation code has been send to ' + this.form.email,
          icon: 'info'
        })
      }).catch(e => {
        this.$q.loading.hide()
        if (e.message) {
          this.$q.notify({
            color: 'red',
            message: e.message,
            icon: 'error'
          })
        } else {
          this.$q.notify({
            color: 'red',
            message: e,
            icon: 'error'
          })
        }
      })
    }
  }
}
</script>

<style scoped lang="scss">
.q-input {
  .q-field__label,
  input {
    padding-left: .4rem;
  }
}
.q-card {
  background: transparent;
}
</style>
