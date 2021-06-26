
<template>
  <q-page class="column justify-center" >
    <q-dialog v-model="dialog.form" persistent>
      <q-card class="q-pa-md" style="width: 700px; max-width: 80vw;">
          <q-form ref="form"
            @submit.prevent="save"
            lazy-validation
          >
        <q-card-section>
          <div class="text-h6 text-weight-light">Create Favourite List</div>
        </q-card-section>
        <q-card-section>
          <q-input
            label="Section Name"
            v-model="form.name"
            ref="name"
            :rules="[val => !!val  || 'A name is required']"
          />
          <!-- <q-select
            v-model="form.position"
            :options="positions"
            label="Position"
            fill-input
            use-input
            hide-selected
          >
          </q-select> -->
        </q-card-section>
        <q-card-actions>
          <q-btn @click="close()" color="primary">Close</q-btn>
          <q-space></q-space>
          <q-btn type="submit" color="primary">Save</q-btn>
        </q-card-actions>
        </q-form>
      </q-card>
    </q-dialog>
    <div class="full-width row q-my-lg  justify-center">
      <div class="row full-width items-center q-px-md" style="max-width:1200px;">
         <q-item-label class="text-h5 text-amber text-bold float-left">Favourites</q-item-label>
        <q-space></q-space>
        <q-btn
          v-show="edit"
          class="font-normal q-mt-md q-ml-md"
          color="nt-orange"
          @click.prevent="createFav()"
          label="Create favourite list"
          />
        <q-btn
          no-caps
          class="q-mt-md q-ml-md font-normal"
          color="cyan"
          @click="edit = !edit"
          :label="edit ? 'Save': 'Edit'"
          />
        <!-- <q-btn
          v-show="edit"
          no-caps
          color="nt-orange"
          @click.prevent="createGroup"
          label="Create Group"
        />
        <q-btn
          no-caps
          class="q-px-lg q-ml-md font-normal"
          color="cyan"
          @click="edit = !edit"
          :label="edit ? 'Save': 'Edit'"
        /> -->
      </div>
    </div>
    <!-- <div class="row justify-center">
      <h1 class="title text-white text-h6 text-center">
        Favourites
      </h1>
    </div> -->
    <div class="row justify-center q-pb-100">
      <div class="col-xl-9 col-lg-10 col-xs-11">
        <div class="row q-col-gutter-xl q-mb-md-none q-mb-lg">
          <div
            class="col-md-4 col-sm-6 col-xs-12"
            v-for="fav in sortedFavs" :key="fav.pk"
          >
            <q-icon v-if="edit" name="delete" color="grey" class="cursor-pointer q-hoverable" style="font-size: 25px;" @click="deleteFav(fav)" />
            <nav-card :card="{
                text: fav.v2,
                path: { name: 'favourite', params: { pk: fav.pk } }
              }"
            />
          </div>
        </div>
      </div>
    </div>
 <!-- <q-icon name="svguse:bath.svg#bath|0 0 48.51 41.31" class="text-nt-orange" style="font-size: 105px;" /> -->
    <!-- <div class="full-width text-h4 text-nt-orange q-pa-lg" style="max-width:900px">
    Favourites
    <q-btn class="float-right" color="nt-orange" @click="createFav()">Create favourite list</q-btn>
    </div>
    <div class="row full-width items-center">
        <div class="col-sm-4 col-xs-6 q-pa-sm q-pb-lg"  v-for="fav in favs" :key="fav.pk" >
          <q-card class="my-card text-nt-orange shadow-13">
            <q-card-section>
              <q-icon name="star" class="text-nt-orange cursor-pointer" style="font-size: 95px;" @click="navigate('favourite',fav.pk)" :loading="true"/>
              <q-icon name="delete" color="grey" class="float-right" style="font-size: 25px;" @click="deleteFav(fav)" />
            </q-card-section>
            <q-card-section class="cursor-pointer" @click="navigate('favourite',fav.pk)">
            </q-card-section>
            <q-card-section class="text-h6 text-center cursor-pointer" @click="navigate('favourite',fav.pk)">
             {{fav.v2}}
            </q-card-section>
          </q-card>
        </div>
    </div> -->
    <!-- <div class="full-width row  justify-evenly items-center ">
    </div>
    <div class="full-width row  justify-evenly items-center ">
    </div> -->
  </q-page>
</template>

<script>
import _ from 'lodash'
import getAll from '../../../graphql/queries/getAll'
import putDefault from '../../../graphql/mutations/putDefault'
import removeDefault from '../../../graphql/mutations/removeDefault'
import NavCard from 'src/components/NavCard'
export default {
  name: 'EntryPage',
  components: {
    NavCard
  },
  mounted () {

  },
  data () {
    return {
      edit: false,
      favs: [],
      dialog: {
        form: false
      },
      form: {
        name: '',
        position: ''
      }
    }
  },
  methods: {
    uuidv4 () {
      return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        var r = Math.random() * 16 | 0
        var v = c === 'x' ? r : (r & 0x3 | 0x8)
        return v.toString(16)
      })
    },
    navigate (name, pk) {
      // const to = { name: name, params: { pk: pk } }
      this.$router.push({ name: name, params: { pk: pk } })
    },
    createFav () {
      this.dialog.form = true
    },
    close () {
      this.dialog.form = false
      this.form.name = ''
      this.form.position = ''
    },
    save () {
      this.$refs.name.validate()
      if (
        this.$refs.name.hasError
      ) {
        return
      }
      const groupPK = this.uuidv4()
      this.dialog.form = false
      const company = this.$store.getters['auth/isAuthenticated'].signInUserSession.idToken.payload['cognito:groups'].filter(x => x !== 'admin')
      const input = {
        pk: groupPK,
        gsi1pk: 'favs#' + company,
        gsi1sk: groupPK,
        gsi2pk: 'favs#' + company,
        gsi2sk: groupPK,
        v2: this.form.name
      }
      this.$apollo.mutate({
        mutation: putDefault,
        variables: {
          input: input
        },
        update: (store, { data: { putDefault } }) => {
        }
      }).then(data => {
        this.$apollo.queries.favs.refetch()
      }).catch(error => {
        console.log(error)
      })
      this.close()
    },
    deleteFav (fav) {
      if (fav.groups.length !== 0) {
        this.$q.notify({
          color: 'primary',
          multiLine: false,
          message: 'Please remove all items in favourite list before removing favourite',
          icon: 'info',
          position: 'top'
        })
        return
      }
      const input = {
        pk: fav.pk,
        sk: fav.sk,
        _version: fav._version
      }
      this.$apollo.mutate({
        mutation: removeDefault,
        variables: {
          input: input
        },
        update: (store, { data: { removeDefault } }) => {
        }
      }).then(data => {
        this.$apollo.queries.favs.refetch()
      }).catch(error => {
        console.log({ error })
      })
    }
  },
  computed: {
    sortedFavs () {
      const sorted = [..._.sortBy(this.favs, f => Number(f.v1))]
      return sorted
    }
  },
  apollo: {
    favs: {
      query: () => getAll,
      variables () {
        return {
          favs: true,
          groups: true
        }
      },
      update: data => {
        return data.getAll.favs
      }
    }
  }
}
</script>
<style>
</style>
