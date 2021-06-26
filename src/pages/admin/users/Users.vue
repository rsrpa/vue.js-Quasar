<template>
  <q-page class="q-pa-md" >
    <q-table
      v-if="users"
      title="Users"
      :data="users"
      :loading="loading"
      :columns="columnsMeth()"
      :filter="filter"
      :pagination.sync="pagination"
      >
      <template v-slot:top="props">
        <q-btn color="primary" :to="{ name:'createUser'}" class="q-ml-sm q-mt-sm">Create User</q-btn>
        <q-space />
        <q-input dense debounce="300" color="primary" v-model="filter">
          <template v-slot:append>
            <q-icon name="search" />
          </template>
        </q-input>

        <q-btn
          flat round dense
          :icon="props.inFullscreen ? 'fullscreen_exit' : 'fullscreen'"
          @click="props.toggleFullscreen"
          class="q-ml-md"
        />
      </template>
      <template v-slot:body="props">
        <tr >
          <q-td>{{props.row.email}}</q-td>
          <q-td>{{props.row.UserStatus}}</q-td>
          <q-td>{{props.row.Enabled}}</q-td>
          <q-td v-for="role in props.row.currentUserRoles" v-bind:key="role" >
            <q-checkbox  :v-model="role" :value="props.row.roles.includes(role) ? true : false" @input="updatePermission($event, props, role)"></q-checkbox>
          </q-td>
          <!-- <q-td>
            <q-toggle
              :value="props.row.groups.indexOf('admin') > -1 ? true : false"
              @input="changeAdmin(props.row)"
            />
            <q-icon v-if="props.row.groups.indexOf('admin') > -1 ? true : false" name="check">
            </q-icon>
          </q-td> -->
          <q-td>
            <q-btn flat @click="removeUser(props.row)">
              <q-tooltip >
                Delete
              </q-tooltip>
            <q-icon  name="delete"  />
            </q-btn>
          </q-td>
        </tr>
      </template>
    </q-table>
  </q-page>
</template>

<script>
import getUsers from '../../../graphql/queries/getUsers'
import adminUser from '../../../graphql/mutations/adminUser'
import removeUser from '../../../graphql/mutations/removeUser'
import updateUser from 'src/graphql/mutations/updateUser'

export default {
  name: 'Users',
  mounted () {

  },
  data () {
    return {
      users: [],
      loading: false,
      pagination: {
        sortBy: 'Username',
        descending: false,
        page: 2,
        rowsPerPage: -1
      },
      filter: '',
      columns: [
        { label: 'Username / Email', align: 'left', field: 'email', name: 'email', sortable: true },
        { label: 'User status', align: 'left', field: 'UserStatus', name: 'UserStatus', sortable: true },
        { label: 'Enabled', align: 'left', field: 'Enabled', name: 'Enabled' },
        { label: 'Admin', align: 'left', field: 'groups', name: 'groups' },
        { label: 'Delete', align: 'left', name: 'delete' }
      ]
    }
  },
  methods: {
    columnsMeth () {
      const columns = [
        { label: 'Username / Email', align: 'left', field: 'email', name: 'email', sortable: true },
        { label: 'User status', align: 'left', field: 'UserStatus', name: 'UserStatus', sortable: true },
        { label: 'Enabled', align: 'left', field: 'Enabled', name: 'Enabled' }
      ]
      const roles = this.$store.getters['auth/getRoles']
      let index = 0
      while (index < roles.length) {
        columns.push({
          label: roles[index],
          align: 'left',
          field: 'role' + roles[index],
          name: roles[index]
        })
        index++
      }
      // columns.push({ label: 'Admin', align: 'left', field: 'groups', name: 'groups' })
      columns.push({ label: 'Delete', align: 'left', name: 'delete' })
      return columns
    },
    removeUser (row) {
      this.$q.dialog({
        title: 'Confirm',
        message: 'Please confirm you wish to remove this user?',
        cancel: true
      }).onOk(() => {
        this.$apollo.mutate({
          mutation: removeUser,
          variables: {
            sub: row.sub
          }
        }).then(data => {
          this.$apollo.queries.users.refetch()
        }).catch(error => {
          console.log({ error })
        })
      })
    },
    changeAdmin (row) {
      const adminMe = !(row.groups.indexOf('admin') > -1)
      this.$apollo.mutate({
        mutation: adminUser,
        variables: {
          sub: row.sub,
          admin: adminMe
        },
        update: (store, { data: { adminUser } }) => {
          if (adminUser !== undefined) {
            const infeed = store.readQuery({
              query: getUsers
            })
            const data = { ...infeed }
            const dataIndex = data.getUsers.indexOf(data.getUsers.find((x) => x.pk === adminUser.sub))
            const user = data.getUsers.find((x) => x.sub === adminUser.sub)
            if (adminUser.admin) {
              user.groups.push('admin')
            } else {
              const adminIndex = user.groups.indexOf('admin')
              user.groups.splice(adminIndex, 1)
            }
            data.getUsers.splice(dataIndex, 1, user)
            store.writeQuery({
              query: getUsers,
              data
            })
          }
        }
      }).then(data => {
        this.$apollo.queries.users.refetch()
      }).catch(error => {
        console.log({ error })
      })
    },
    updatePermission (event, row, role) {
      this.loading = true
      let roles = row.row.roles
      if (roles.length > 0) {
        roles = roles.slice(1, -1)
        roles = roles.replace(/[']+/g, '')
        roles = roles.split(', ')
      } else {
        roles = []
      }
      if (event === false) {
        const index = roles.indexOf(role)
        roles.splice(index, 1)
      }
      if (event === true) {
        roles.push(role)
      }
      const input = {
        sub: row.row.sub,
        roles: roles.join()
      }
      this.$apollo.mutate({
        mutation: updateUser,
        variables: input
      }).then(data => {
        this.$apollo.queries.users.refetch()
        this.loading = false
      }).catch(error => {
        console.log({ error })
        this.loading = false
      })
    }
  },
  apollo: {
    users: {
      query: () => getUsers,
      update: data => {
        return data.getUsers
      },
      result ({ data }) {
        if (data !== undefined) {
          const roles = this.$store.getters['auth/getRoles']
          this.users = data.getUsers.map(x => {
            x.currentUserRoles = roles
            return x
          })
        }
      }
    }
  }
}
</script>
