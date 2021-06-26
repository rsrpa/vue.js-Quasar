import gql from 'graphql-tag'
export default gql`
  mutation adminUser($admin: Boolean!, $sub: String!) {
    adminUser(
      admin:$admin
      sub:$sub
    )
    {
      admin
      sub
    }
  }
`
