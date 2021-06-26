import gql from 'graphql-tag'
export default gql`
  mutation updateUser($sub: String!, $roles: String) {
    updateUser(
      roles:$roles
      sub:$sub
    )
    {
      email
    }
  }
`
