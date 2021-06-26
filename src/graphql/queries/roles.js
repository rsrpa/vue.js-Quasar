import gql from 'graphql-tag'

export default gql`
  query roles
  {
    roles {
      pk
      sk
      v1
    }
  }
`
