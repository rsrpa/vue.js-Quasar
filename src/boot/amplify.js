import Amplify, * as AmplifyModules from 'aws-amplify'
import {
  AmplifyPlugin,
  AmplifyEventBus
} from 'aws-amplify-vue'
import AwsExports from '../aws-exports'
// import roles from 'src/_helpers/roles'
import roles from 'src/graphql/queries/roles'
Amplify.configure(AwsExports)

// window.LOG_LEVEL='DEBUG'

export default async ({
  app,
  router,
  Vue,
  store
}) => {
  Vue.use(AmplifyPlugin, AmplifyModules)
  Vue.prototype.$AmplifyEventBus = AmplifyEventBus
  Vue.prototype.$Auth = AmplifyModules.Auth
  Vue.prototype.$Modules = AmplifyModules
  let user
  let userObj
  AmplifyEventBus.$on('authState', async (state) => {
    if (state === 'signedOut') {
      user = null
      store.commit('auth/setUser', null)
      store.commit('auth/setRoles', null)
      router.push({ name: 'auth' })
    } else if (state === 'signedIn') {
      user = await getUserNoCache()
      if (user.attributes.profile === 'rappid') {
        router.push({ path: '/' })
      } else {
        router.push({ name: 'dashboard' })
      }
    }
  })

  function getUserNoCache () {
    return Vue.prototype.$Amplify.Auth.currentAuthenticatedUser({ bypassCache: true }).then(async (data) => {
      const userRoles = await app.apolloProvider.defaultClient.query({
        query: roles,
        fetchPolicy: 'network-only'
      })
      console.log(data)
      let rolesArray = userRoles.data.roles[0].v1
      rolesArray = rolesArray.slice(1, -1)
      rolesArray = rolesArray.split(', ')
      if (data && data.signInUserSession) {
        store.commit('auth/setUser', data)
        store.commit('auth/setRoles', rolesArray)
        return data
      }
    }).catch((e) => {
      console.log(e)
      store.commit('auth/setUser', null)
      store.commit('auth/setRoles', null)
      return null
    })
  }

  function getUser () {
    return Vue.prototype.$Amplify.Auth.currentAuthenticatedUser().then(async (data) => {
      if (data && data.signInUserSession) {
        const userRoles = await app.apolloProvider.defaultClient.query({
          query: roles
        })
        let rolesArray = userRoles.data.roles[0].v1
        rolesArray = rolesArray.slice(1, -1)
        rolesArray = rolesArray.split(', ')
        store.commit('auth/setRoles', rolesArray)
        store.commit('auth/setUser', data)
        return { data, rolesArray }
      }
    }).catch((e) => {
      store.commit('auth/setUser', null)
      return null
    })
  }

  router.beforeResolve(async (to, from, next) => {
    if (to.matched.some(record => record.meta.auth)) {
      userObj = await getUser()
      if (!userObj) {
        return next({
          path: '/auth'
        })
      }
      user = userObj.data
      const roles = userObj.rolesArray
      if (!user) {
        return next({
          path: '/auth'
        })
      } else if (to.matched.some(record => record.meta.role)) {
        if (!roles) {
          return next({
            path: '/auth'
          })
        } else if (to.matched.some(record => record.meta.role)) {
          const authorize = to.meta.role
          if (roles.includes(authorize)) {
            return next()
          } else {
            return next({
              path: '/'
            })
          }
        }
        return next()
      } else {
        return next()
      }
    }
    return next()
  })
}
