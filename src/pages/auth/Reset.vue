<template>
  <q-layout view="hHh lpR fFf">
    <q-page-container>
      <q-page padding>
        <div class="row justify-center items-end content-center">
          <div class="col-xs-12 col-sm-12 col-md-5 col-lg-5" style="max-width:500px;padding-top: 2%">
              <div style="padding:16px">
                <q-img
                    :src="require('assets/logo-transparent.svg')"
                    spinner-color="white"
                    contain
                    style="max-height:225px;padding-bottom: 250px;"
                    />
              </div>
                    <div style="text-align:center">
                      <div class="text-h6 text-white q-mt-md">Reset password</div>
                    </div>
              <q-stepper
                dark
                v-model="step"
                ref="stepper"
                :contracted="$q.screen.lt.md"
                animated
                :bordered="false"
                >
                <q-step
                  dark
                  :name="1"
                  title="Request"
                  icon="settings"
                  done-color="deep-orange-4"
                  color="white"
                  :bordered="false"
                  :done="step1Done"
                  >
                     <q-card-section>
                        <q-img
                          spinner-color="white"
                          contain
                          style="max-height:225px"
                        />
                     </q-card-section>
                    <q-form
                      @submit="resetRequest"
                      class="q-gutter-md" >
                          <q-input
                            dark
                            label-color="white"
                            color="white"
                            v-model.trim="req.email"
                            label="Email *"
                            bottom-slots
                            error-message="Valid email is required"
                             :error="$v.req.email.$error"
                            >
                            <template v-slot:before>
                              <q-icon
                                name="far fa-user"
                                size="1.35rem"
                                color="light-blue-4"
                              />
                            </template>
                          </q-input>
                          <template v-slot:error>
                          </template>
                        <q-btn
                          no-caps
                          unelevated
                          padding="10px 20px"
                          :loading="false"
                          color="deep-orange-4"
                          label="Cancel"
                          type="submit"
                          class="no-shadow"
                          :to="{name:'auth'}"
                         />
                        <q-btn
                          no-caps
                          unelevated
                          padding="10px 20px"
                          :loading="false"
                          color="deep-orange-4"
                          label="Resend"
                          type="submit"
                          class="no-shadow float-right"
                          />
                    </q-form>
                </q-step>
                <q-step
                  :name="2"
                  title="Reset"
                  icon="lock"
                  done-color="green"
                  :done="step2Done">
                    <q-img
                      spinner-color="white"
                      contain
                      style="max-height:225px"/>
                    <q-form
                        @submit="reset"
                        class="q-gutter-md">
                        <q-input
                          dark
                          label-color="white"
                          color="white"
                          v-model.trim="form.code"
                          label="Confirmation Code *"
                          bottom-slots
                          error-message="Confirmation code required"
                          :error="$v.form.code.$error"
                          >
                            <template v-slot:before>
                              <q-icon
                                name="fa fa-key"
                                size="1.35rem"
                                color="light-blue-4"
                              />
                            </template>
                        </q-input>
                           <q-input
                            dark
                            label-color="white"
                            color="white"
                            type="password"
                            v-model.trim="$v.form.pass.$model"
                            label="New Password *"
                             bottom-slots
                            error-message="Alpha numeric password of greater than length 6 required"
                            :error="$v.form.pass.$error"
                          >
                            <template v-slot:before>
                              <q-icon
                                name="fas fa-lock"
                                size="1.35rem"
                                color="light-blue-4"
                              />
                            </template>
                          </q-input>
                          <q-input
                            dark
                            label-color="white"
                            color="white"
                            type="password"
                            v-model.trim="$v.form.repeatpass.$model"
                            label="Confirm New Password *"
                             bottom-slots
                            error-message="Passwords must match"
                            :error="$v.form.repeatpass.$error"
                            >
                            <template v-slot:before>
                              <q-icon
                                name="fas fa-lock"
                                size="1.35rem"
                                color="light-blue-4"
                              />
                            </template>
                          </q-input>
                        <template v-slot:error>
                        </template>
                        <q-btn
                          no-caps
                          unelevated
                          padding="10px 20px"
                          :loading="false"
                          color="deep-orange-4"
                          label="Resend"
                          class="no-shadow"
                          v-on:click="resend"
                          />
                        <q-btn
                         unelevated no-caps color="deep-orange-4" padding="10px 20px" label="Next" type="submit" class="no-shadow float-right"
                         />
                    </q-form>
                </q-step>
                <!-- <template v-slot:message>
                  <q-banner class="text-center text-white text-uppercase text-subtitle1 bg-positive">
                    Password reset
                  </q-banner>
                </template> -->
              </q-stepper>
          </div>
        </div>
      </q-page>
    </q-page-container>
  </q-layout>
</template>

<script>
import { required, sameAs, minLength, email, alphaNum } from 'vuelidate/lib/validators'

export default {
  name: 'app',
  data () {
    return {
      step: 1,
      step1Done: false,
      step2Done: false,
      req: {
        email: ''
      },
      form: {
        code: '',
        email: '',
        pass: '',
        repeatpass: ''
      }
    }
  },

  validations: {
    req: {
      email: {
        required,
        email
      }
    },
    form: {
      code: {
        required,
        minLength: minLength(6)
      },
      email: {
        required,
        email
      },
      pass: {
        required,
        alphaNum,
        minLength: minLength(6)
      },
      repeatpass: {
        sameAspass: sameAs('pass')
      }
    }
  },

  components: {

  },

  methods: {

    async resetRequest () {
      this.$v.req.$touch()
      if (this.$v.req.$invalid) {
        return
      }
      await this.$Auth.forgotPassword(
        this.req.email.toLowerCase()
      ).then(data => {
        // eslint-disable-next-line no-unused-expressions
        this.$v.form.$reset
        this.step1Done = true
        this.step = 2

        this.$q.notify({
          color: 'primary',
          icon: 'info',
          message: 'Please check your email for the reset code'
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
    async reset () {
      this.form.email = this.req.email.toLowerCase()
      this.$v.form.$touch()
      if (this.$v.form.$invalid) {
        return
      }
      this.$q.loading.show()
      await this.$Auth.forgotPasswordSubmit(this.form.email, this.form.code, this.form.pass).then(async data => {
        this.$q.loading.hide()
        this.step2Done = true
        this.$q.notify({
          color: 'primary',
          message: 'Your password has been reset',
          icon: 'info'
        })
        this.$router.push({ name: 'auth' })
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
      this.step = 1
      this.step1Done = false
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
.q-stepper {
  background: transparent;
  border: 0;
}
</style>
