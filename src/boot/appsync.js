
import Vue from 'vue'
import VueApollo from 'vue-apollo'
import AWSAppSyncClient from 'aws-appsync'
import awsmobile from '../aws-exports'
import * as localForage from 'localforage'

const config = {
  url: awsmobile.aws_appsync_graphqlEndpoint,
  region: awsmobile.aws_appsync_region,
  auth: {
    type: awsmobile.aws_appsync_authenticationType,
    jwtToken: async () => (await Vue.prototype.$Auth.currentSession()).getAccessToken().getJwtToken()
  },
  offlineConfig: {
    storage: localForage
  }
}

const options = {
  defaultOptions: {
    watchQuery: {
      fetchPolicy: 'cache-and-network'
      // fetchPolicy: 'network-only'
    },
    connectToDevTools: true // Remove this for production use
    // disableOffline: false
  }
}

const client = new AWSAppSyncClient(config, options)
const appsyncProvider = new VueApollo({
  defaultClient: client
})

// "async" is optional
export default async ({ app, router, Vue }) => {
  Vue.use(VueApollo)
  app.apolloProvider = appsyncProvider
}
