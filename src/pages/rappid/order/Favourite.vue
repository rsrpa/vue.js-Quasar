<template>
  <q-page class="row  items-center justify-evenly">
    <q-dialog v-model="dialog.form" persistent>
      <q-card class="q-pa-md">
        <q-form ref="form" @submit.prevent="save" lazy-validation>
          <q-card-section>
            <div class="text-h6 text-weight-light">Add Group</div>
          </q-card-section>
          <q-card-section>
            <q-input
              label="Group Name"
              v-model="form.name"
              ref="name"
              :rules="[val => !!val || 'A name is required']"
            />
          </q-card-section>
          <q-card-actions>
            <q-btn @click="close()" color="primary">Close</q-btn>
            <q-space></q-space>
            <q-btn type="submit" color="primary">Save</q-btn>
          </q-card-actions>
        </q-form>
      </q-card>
    </q-dialog>

    <q-dialog
      v-model="dialog.subs"
      :full-width="
        (subs.length >= 2 && Object.keys(current).length > 0) || $q.screen.lt.md
      "
      :maximized="$q.screen.lt.md"
      transition-show="slide-up"
      transition-hide="slide-down"
    >
      <q-card style="max-width: inherit">
        <q-bar class="bg-primary q-py-lg" v-if="$q.screen.lt.md">
          <q-space />
          <q-btn flat color="white" icon="close" v-close-popup>
            <q-tooltip content-class="bg-white text-primary">Close</q-tooltip>
          </q-btn>
        </q-bar>
        <q-card-section class="full-height row items-center">
          <div class="row justify-around items-center full-width">
            <CardItem
              :item="current"
              :best="current.best"
              :current="true"
              @close="close()"
              @swap="swap"
              class="q-ml-lg"
              :class="[
                  (subs.length <= 2 && Object.keys(current).length > 0) ||
                  !$q.screen.lt.md ? 'q-mr-lg' : 'q-mr-md'
              ]"
            ></CardItem>
            <CardItem
              v-for="(sub, index) in subs"
              :key="sub.pk"
              :item="sub"
              :index="index"
              :best="'best' in sub ? sub.best : false"
              :current="false"
              @close="close()"
              @swap="swap"
              class="q-mr-md"
            ></CardItem>
          </div>
        </q-card-section>
      </q-card>
      <!-- <div class="row justify-center q-gutter-md">
        <div class="col-3 flex justify-center">
          <q-card class="full-height" style="width: 260px" contain>
            <CardItem
              :item="current"
              :best="current.best"
              :current="true"
              @close="close()"
              @swap="swap"
            ></CardItem>
          </q-card>
        </div>
        <q-separator class="gt-sm" vertical inset />
        <div class="col-3 flex justify-center" v-for="sub in subs" :key="sub.pk">
          <q-card class="full-height" style="width: 260px" contain>
            <CardItem
              :item="sub"
              :best="'best' in sub ? sub.best : false"
              :current="false"
              @close="close()"
              @swap="swap"
            ></CardItem>
          </q-card>
        </div>
      </div> -->
    </q-dialog>

    <div class="full-width row q-my-lg" style="max-width: 1200px;">
      <div class="row full-width items-center q-px-md">
        <q-item-label class="text-h5 text-amber text-bold">{{
          favs.title
        }}</q-item-label>
        <q-space></q-space>
        <q-btn
          v-show="edit"
          no-caps
          class="font-normal q-mt-md q-ml-md"
          color="nt-orange"
          @click.prevent="createGroup"
          label="Create Group"
        />
        <q-btn
          v-show="!edit"
          no-caps
          class="font-normal q-mt-md q-ml-md"
          color="cyan"
          @click="toggleMaxLevel"
          :label="`${maxLevel} Max Levels`"
        />
        <q-btn
          no-caps
          class="font-normal q-mt-md q-ml-md"
          color="cyan"
          @click="edit = !edit"
          :label="edit ? 'Save' : 'Edit'"
        />
      </div>
    </div>
    <div
      v-show="favs.favs.length > 0"
      class="row full-width items-center justify-evenly"
    >
      <div class="col-md-10 col-sm-12 col-xs-12 q-pa-md">
        <draggable
          v-model="favs.favs"
          :group="favs.favs"
          @end="dragGroup"
          handle=".handle"
        >
          <q-markup-table
            class="favourite-table q-mb-lg"
            v-for="group in favs.favs"
            :key="group.pk"
            :id="group.pk"
            dense
          >
            <thead>
              <tr class="bg-blue-1" style="min-height: 50px;">
                <th style="width: 50px" v-show="edit">
                  <q-icon
                    v-show="edit"
                    color="primary"
                    name="drag_handle"
                    class="handle"
                    size="50px"
                  />
                </th>
                <th style="max-width: 65px; width: 65px;"></th>
                <th colspan="2" class="text-left fav-header item-description">{{group.v2}}</th>
                <th class="text-center item-substitute" v-show="!edit">Substitutes</th>
                <th class="text-center" v-show="!edit">Availability</th>
                <th class="text-center" v-show="!edit">Price</th>
                <th class="text-center" v-show="!edit && maxLevel == 'Hide'">Max Qty</th>
                <th class="text-center" v-show="edit">Max Qty</th>
                <th class="text-center" v-show="!edit && maxLevel == 'Hide'">Current Qty</th>
                <th class="text-center" v-show="!edit">Qty</th>
                <th class="text-center" v-show="!edit">Pack Qty</th>
                <!-- <th class="text-center" v-show="!edit">Add</th> -->
                <!-- <th class="text-right" v-show="!edit">Subtotal</th> -->
                <th v-show="edit" style="width: 50px;">
                  <q-btn flat class="float-right" @click="deleteGroup(group)">
                    <q-icon style="font-size: 30px;" name="delete"></q-icon>
                  </q-btn>
                </th>
              </tr>
            </thead>
            <draggable
              v-model="group.items"
              group="a"
              @end="dragItem"
              handle=".itemHandle"
              tag="tbody"
            >
              <q-tr
                v-for="item in group.items"
                :key="item.pk"
                :id="item.pk"
                :class="[item.supply.v4 !== 'true' ? 'bg-grey-4' : '']"
              >
                <q-td v-show="edit">
                  <q-icon
                    v-show="edit"
                    color="primary"
                    name="drag_handle"
                    class="itemHandle"
                    size="30px"
                  />
                </q-td>
                <q-td
                  :style="
                    checkSubs(item)
                      ? 'border-left-style: solid;border-left-color: green;border-width:0 0 0 thick ;'
                      : ''
                  "
                >
                  <!-- <q-img :src="item.map.supply.v6" style="max-height: 40px" contain /> -->

                  <q-img :src="item.supply.v6" style="max-height: 40px; min-width: 40px; max-width: 50px;" contain />
                </q-td>
                <q-td class="text-center item-sku">{{ item.supply.v1 }}</q-td>
                <q-td class="by-line item-description">
                  {{item.map.v1}}
                </q-td>
                <q-td class="text-center item-substitute" v-show="!edit">
                  <q-btn @click="showSubs(item)" v-if="checkSubs(item)" flat color="green" :label="calSaving(item)">
                  </q-btn>
                  <q-btn v-else-if="item.supply.subs.length > 0" flat color="grey" @click="showSubs(item)" label="Subsitutes">
                  </q-btn>
                </q-td>
                <q-td class="text-center"  v-show="!edit">
                  <div v-if="item.supply.soh[0]">
                    <q-icon
                      v-if="item.supply.soh[0].v1 === 'green'"
                      name="fiber_manual_record"
                      color="green-12"
                      size="30px"
                    />
                    <q-icon
                      v-if="item.supply.soh[0].v1 === 'orange'"
                      name="fiber_manual_record"
                      color="orange-3"
                      size="30px"
                    >
                      <q-tooltip
                        transition-show="scale"
                        transition-hide="scale"
                        anchor="center right"
                        self="center start"
                        max-width="140px"
                        content-class="text-caption"
                      >
                        <span
                          >The quantity you require maybe close to our available
                          quantity, our team will contact you if there is a
                          supply issue</span
                        >
                      </q-tooltip>
                    </q-icon>
                    <q-icon
                      v-if="item.supply.soh[0].v1 === 'red'"
                      name="fiber_manual_record"
                      color="red-3"
                      size="30px"
                    >
                      <q-tooltip
                        transition-show="scale"
                        transition-hide="scale"
                        anchor="center right"
                        self="center start"
                        max-width="140px"
                        content-class="text-caption"
                        >
                        <span>This item will be placed on back order</span>
                      </q-tooltip>
                    </q-icon>
                  </div>
                </q-td>
                <!-- <q-td v-show="!edit" class="text-right">{{item.map.supply.v5}}</q-td> -->

                <q-td v-show="!edit" class="text-center">${{(Math.round(item.supply.v5 * 100) / 100).toFixed(2)}}</q-td>
                <q-td class="text-center" v-show="!edit && maxLevel == 'Hide'">{{ item.map.v3 }}</q-td>
                <q-td class="text-center" v-show="edit">
                  <div class="row items-right justify-end quantity-input">
                    <q-input
                      hide-bottom-space
                      standout
                      square
                      outlined
                      dense
                      input-style="width: 30px"
                      input-class="text-center"
                      type="number"
                      :ref="'mapMax#'+item.pk"
                      v-model="item.map.v3"
                      @change.native="updateMaxQty($event, item)"
                    >
                    </q-input>
                  </div>
                </q-td>
                <q-td class="text-center" v-show="!edit && maxLevel == 'Hide'">
                  <div class="row items-center justify-center quantity-input">
                    <q-input
                      hide-bottom-space
                      standout
                      square
                      outlined
                      dense
                      input-style="width: 30px"
                      input-class="text-center"
                      type="number"
                      :disable="item.supply.v4 !== 'true'"
                      :ref="'current_units#' + item.pk"
                      v-model="item.v4"
                      @change.native="updateQty($event, item)"
                    >
                    </q-input>
                  </div>
                </q-td>
                <q-td v-show="!edit" class="text-center">
                  <div class="row items-center justify-center quantity-input">
                    <q-input
                      class="inputFav"
                      hide-bottom-space
                      standout
                      square
                      outlined
                      dense
                      input-class="text-center col-12"
                      type="number"
                      :disable="item.supply.v4 !== 'true'"
                      :ref="'units#' + item.pk"
                      v-model="item.v5"
                      :rules="[
                        val =>
                          (Number.isInteger(Number(val)) && Number(val) >= 0) ||
                          'Please enter a valid number'
                      ]"
                      @change.native="updateRow($event, item)"
                    >
                    </q-input>
                  </div>
                </q-td>
                <q-td v-show="!edit" class="text-center" width="50px">
                  <q-btn
                    v-if="item.supply.v7"
                    dense
                    flat
                    color="dark"
                    icon="fas fa-box-open"
                    :disable="item.supply.v4 !== 'true'"
                    @click="roundBoxInput(item)"
                  >
                    <q-tooltip
                      transition-show="scale"
                      transition-hide="scale"
                      anchor="center right"
                      self="center start"
                      max-width="140px"
                      content-class="text-caption"
                      >
                      <span v-if="item.supply.v7">
                        Order in multiples of {{ item.supply.v7 }} to save packaging & waste
                      </span>
                    </q-tooltip>
                    <q-badge color="cyan" floating dense>
                      {{ item.supply.v7 }}
                    </q-badge>
                  </q-btn>
                </q-td>

                <!-- <q-td class="text-center" v-show="!edit">
                  <q-btn dense flat color="amber" @click="addToCart(item)" >
                    <q-icon name="add_shopping_cart" />
                  </q-btn>
                </q-td> -->
                <q-td v-show="edit" class="text-center">
                  <q-btn v-show="edit" class="float-right" flat @click="deleteItem(item)">
                    <q-icon style="font-size: 25px;" name="delete"></q-icon>
                  </q-btn>
                </q-td>
              </q-tr>
            </draggable>
          </q-markup-table>
        </draggable>
      </div>
    </div>
  </q-page>
</template>

<script>
// import createOrder from '../../../graphql/mutations/createOrder'
import reindex from '../../../graphql/mutations/reindex'
import putDefault from '../../../graphql/mutations/putDefault'
import updateDefault from '../../../graphql/mutations/updateDefault'
import seqGroup from '../../../graphql/mutations/seqGroup'
import removeDefault from '../../../graphql/mutations/removeDefault'
import seqItem from '../../../graphql/mutations/seqItem'
import getAll from '../../../graphql/queries/getAll'
import CardItem from './CardItem'
import subs from 'src/graphql/mutations/subs'
import draggable from 'vuedraggable'
// import { mapGetters } from 'vuex'
export default {
  name: 'Favourite',
  components: {
    draggable,
    CardItem
  },
  props: ['pk'],
  computed: {
  },
  mounted () {},
  data () {
    return {
      edit: false,
      editGroupId: null,
      maxLevel: 'Show',
      favs: {
        favs: [
          {
            items: []
          }
        ],
        title: ''
      },
      supply: [],
      supplyKeys: {
        skipSupply: true,
        pk: ''
      },
      subs: [],
      current: {},
      favourite: {},
      dialog: {
        form: false,
        subs: false
      },
      positions: ['Top', 'Bottom'],
      form: {
        name: '',
        position: ''
      },
      items: [],
      groups: [],
      orderPlaced: false
    }
  },
  methods: {
    getValue (pk) {
      return this.$store.getters['cart/getPKQty'](pk)
    },
    checkSubs (item) {
      return (
        item.supply.subs.length > 0 &&
        item.supply.subs.some(x => x.gsi3sk > parseInt(x.v1))
      )
    },
    calSaving (item) {
      const subs = item.supply.subs.map(x => {
        return x.sub
      })
      const decrease =
        parseFloat(item.supply.v5) - parseFloat(subs[subs.length - 1].v5)
      const percentageSaved = (
        (decrease / parseFloat(item.supply.v5)) *
        100
      ).toFixed(2)
      return 'Save ' + percentageSaved.toString() + '%'
    },
    roundBoxInput (row) {
      let calcBox = 0
      if (row.v5 === null || row.v5 === 0) {
        calcBox = row.supply.v7
      } else {
        calcBox = Math.ceil(row.v5 / row.supply.v7) * row.supply.v7
      }
      const itemGroupIndex = this.favs.favs.indexOf(
        this.favs.favs.find(x => x.pk === row.gsi1pk)
      )
      const itemGroup = this.favs.favs.filter(x => x.pk === row.gsi1pk)
      let item = {}
      itemGroup[0].items = itemGroup[0].items.map(x => {
        if (x.pk === row.pk) {
          x.v1 = true
          x.v5 = calcBox
          item = { ...x }
        }
        return x
      })
      this.favs.favs.splice(itemGroupIndex, 1, itemGroup[0])
      this.$store.dispatch('cart/actionUpdateCart', item)
    },
    updateMaxQty (event, row) {
      this.$apollo.queries.favs.skip = true
      const input = {
        pk: row.map.pk,
        v3: event.target.value,
        _version: row.map._version
      }

      this.$apollo
        .mutate({
          mutation: updateDefault,
          variables: {
            input: input
          }
        })
        .then(data => {
          this.$apollo.queries.favs.refetch()
        })
        .catch(error => {
          console.log({ error })
        })
    },
    showSubs (item) {
      this.favourite = item
      this.subs = item.supply.subs.map(x => {
        return x.sub
      })
      this.current = item.supply
      if (this.checkSubs(item)) {
        this.subs[this.subs.length - 1].best = true
        this.current.best = false
      } else {
        this.current.best = true
      }
      this.subs.reverse()
      this.dialog.subs = true
    },
    swap (item) {
      this.$apollo
        .mutate({
          mutation: subs,
          variables: {
            supplyPK: item.pk,
            favsID: this.favourite.pk
          },
          update: (store, { data: { updateDefault } }) => {}
        })
        .then(data => {
          this.$apollo.queries.favs.refetch()
        })
        .catch(error => {
          console.log({ error })
        })
      this.close()
    },
    uuidv4 () {
      return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (
        c
      ) {
        var r = (Math.random() * 16) | 0
        var v = c === 'x' ? r : (r & 0x3) | 0x8
        return v.toString(16)
      })
    },
    // addToCart (item) {
    //   this.$store.dispatch('cart/actionUpdateCart', { ...item })
    // },
    navigate (path) {
      this.$router.push(path)
    },
    getSubtotal (row) {
      // return (Number(row.map.supply.v5) * Number(row.v5)).toFixed(2)
      return (Number(row.supply.v5) * Number(row.v5)).toFixed(2)
    },
    getGroupTotal (group) {
      // return (group.items.map((item) => Number(item.map.supply.v5) * Number(item.v5)).reduce((a, b) => a + b, 0)).toFixed(2)
      return group.items
        .map(item => Number(item.supply.v5) * Number(item.v5))
        .reduce((a, b) => a + b, 0)
        .toFixed(2)
    },
    updateQty (event, row) {
      const itemGroupIndex = this.favs.favs.indexOf(
        this.favs.favs.find(x => x.pk === row.gsi1pk)
      )
      const itemGroup = this.favs.favs.filter(x => x.pk === row.gsi1pk)
      let item = {}
      itemGroup[0].items = itemGroup[0].items.map(x => {
        if (x.pk === row.pk) {
          x.v1 = true
          if (parseInt(x.map.v3) > parseInt(event.target.value)) {
            x.v5 = x.map.v3 - event.target.value
          }
          x.v4 = event.target.value
          item = { ...x }
        }
        return x
      })
      this.favs.favs.splice(itemGroupIndex, 1, itemGroup[0])
      this.$store.dispatch('cart/actionUpdateCart', item)
    },
    updateRow (event, row) {
      const newValue = event.target.value
      const itemGroupIndex = this.favs.favs.indexOf(
        this.favs.favs.find(x => x.pk === row.gsi1pk)
      )
      const itemGroup = this.favs.favs.filter(x => x.pk === row.gsi1pk)
      let item = {}
      itemGroup[0].items = itemGroup[0].items.map(x => {
        if (x.pk === row.pk) {
          x.v1 = true
          x.v5 = newValue
          item = { ...x }
        }
        return x
      })
      this.favs.favs.splice(itemGroupIndex, 1, itemGroup[0])
      this.$store.dispatch('cart/actionUpdateCart', item)
    },
    createGroup () {
      this.dialog.form = true
    },
    save () {
      this.$apollo.queries.favs.skip = true
      this.$refs.name.validate()
      if (this.$refs.name.hasError) {
        return
      }
      const groupPK = this.uuidv4()
      this.dialog.form = false
      const company = this.$store.getters[
        'auth/isAuthenticated'
      ].signInUserSession.idToken.payload['cognito:groups'].filter(
        x => x !== 'admin'
      )
      const input = {
        pk: groupPK,
        gsi1pk: this.pk,
        gsi1sk: groupPK,
        gsi2pk: 'favs#group#' + company,
        gsi2sk: groupPK,
        gsi3pk: this.pk,
        gsi3sk: this.favs.favs.length,
        v2: this.form.name
      }
      this.$apollo
        .mutate({
          mutation: putDefault,
          variables: {
            input: input
          },
          update: (store, { data: { putDefault } }) => {}
        })
        .then(data => {
        })
        .catch(error => {
          console.log(error)
        })
      const cachedItem = { ...input }
      cachedItem.items = []
      this.favs.favs.splice(this.favs.favs.length, 0, cachedItem)
      this.close()
    },
    deleteItem (item) {
      console.log(item)
      this.$apollo.queries.favs.skip = true
      const input = {
        pk: item.pk,
        sk: item.sk,
        _version: item._version
      }
      this.$apollo
        .mutate({
          mutation: removeDefault,
          variables: {
            input: input
          },
          update: (store, { data: { removeDefault } }) => {}
        })
        .then(data => {
        })
        .catch(error => {
          console.log({ error })
        })
      this.$apollo
        .mutate({
          mutation: reindex,
          variables: {
            pk: item.gsi1pk
          }
        })
        .then(data => {
        })
        .catch(error => {
          console.log({ error })
        })
      const itemGroupIndex = this.favs.favs.indexOf(
        this.favs.favs.find(x => x.pk === item.gsi1pk)
      )
      const itemGroup = this.favs.favs.filter(x => x.pk === item.gsi1pk)
      itemGroup[0].items = itemGroup[0].items.filter(x => x.pk !== item.pk)
      this.favs.favs.splice(itemGroupIndex, 1, itemGroup[0])
    },
    deleteGroup (group) {
      if (group.items.length !== 0) {
        this.$q.notify({
          color: 'primary',
          multiLine: false,
          message: 'Please remove all items in group before removing group',
          icon: 'info',
          position: 'top'
        })
        return
      }
      this.$apollo.queries.favs.skip = true
      const input = {
        pk: group.pk,
        sk: group.sk,
        _version: group._version
      }
      this.$apollo
        .mutate({
          mutation: removeDefault,
          variables: {
            input: input
          },
          update: (store, { data: { removeDefault } }) => {}
        })
        .then(data => {
        })
        .catch(error => {
          console.log({ error })
        })
      this.$apollo
        .mutate({
          mutation: reindex,
          variables: {
            pk: this.pk
          }
        })
        .then(data => {
        })
        .catch(error => {
          console.log({ error })
        })
      const itemGroupIndex = this.favs.favs.indexOf(
        this.favs.favs.find(x => x.pk === group.pk)
      )
      this.favs.favs.splice(itemGroupIndex, 1)
    },
    close () {
      this.dialog.form = false
      this.dialog.subs = false
      this.form.name = ''
      this.form.position = ''
    },
    dragGroup (evt) {
      if (evt.oldIndex === evt.newIndex) {
        return
      }
      this.$apollo
        .mutate({
          mutation: seqGroup,
          variables: {
            pk: evt.item.id,
            newSeq: evt.newIndex,
            oldSeq: evt.oldIndex
          },
          update: (store, { data: { putLocation } }) => {}
        })
        .then(data => {
        })
        .catch(error => {
          console.log({ error })
        })
    },
    dragItem (evt) {
      this.$apollo
        .mutate({
          mutation: seqItem,
          variables: {
            fromPK: evt.from.parentElement.parentElement.id,
            toPK: evt.to.parentElement.parentElement.id,
            itemPK: evt.item.id,
            newSeq: evt.newIndex,
            oldSeq: evt.oldIndex
          },
          update: (store, { data: { putLocation } }) => {}
        })
        .then(data => {
        })
        .catch(error => {
          console.log({ error })
        })
    },
    editGroup (group) {
      this.editGroupId = group.pk
    },
    toggleMaxLevel () {
      this.maxLevel = this.maxLevel === 'Show' ? 'Hide' : 'Show'
    }
  },
  apollo: {
    favs: {
      query: () => getAll,
      variables () {
        return {
          favs: true,
          groups: true,
          items: true,
          favMap: true,
          favSupply: true,
          subs: true,
          soh: true,
          favId: this.pk
        }
      },
      update: data => {
        return {
          favs: data.getAll.favs[0].groups,
          title: data.getAll.favs[0].v2
        }
      },
      result ({ data, loading }) {
        if (loading) {
          // this.$q.loading.show()
        }
        if (!loading) {
          // this.groups = data.getAll.favs[0].groups.map(x => {
          //   x.items = x.items.map(y => {
          //     y.orderUnits = ''
          //     y.ordered = false
          //     y.parent = x.pk
          //     return y
          //   })
          //   return x
          // })
          // this.$q.loading.hide()
        }
      }
    }
  }
}
</script>

<style lang="scss">
  .favourite-table {
    thead {
      tr {
        height: 3rem !important;
      }
    }
    .q-table__bottom {
      background-color: $grey-2;
      flex-direction: row-reverse;
      opacity: 0.8;
      padding: 10px 20px;
    }
    .fav-header {
      font-size: 1.05rem;
      font-weight: 500;
      color: $blue-grey-9;
    }
    .item-description {
      width: 600px;
      max-width: 600px;
    }
    .item-sku {
      width: 88px;
      max-width: 88px;
    }
    .by-line {
      white-space: normal;
    }
    .item-substitute {
      width: 115px;
      max-width: 115px;
    }
    .header-row {
      background-color: $light-blue-1;
    }
    .sub-header {
      font-weight: 500;
      color: $grey-7;
    }
    .dot {
      height: .8rem;
      width: .8rem;
      border-radius: 50%;
      display: inline-block;
    }
    .out-stock {
      background-color: $orange;
    }
    .in-stock {
      background-color: $green-7;
    }
  }
  .q-table__bottom {
    background-color: $grey-2;
    flex-direction: row-reverse;
    opacity: 0.8;
    padding: 10px 20px;
  }
  .fav-header {
    font-size: 1.05rem;
    font-weight: 500;
    color: $blue-grey-9;
  }
  .header-row {
    background-color: $light-blue-1;
  }
  .sub-header {
    font-weight: 500;
    color: $grey-7;
  }
  .quantity-input {
    .q-field__control {
      height: 30px;
      width: 45px;
    }
    .q-field__append {
      display: none;
    }
  }
</style>
