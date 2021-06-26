import gql from 'graphql-tag'
export default gql`
  mutation removeUser($sub: String!) {
    removeUser(
      sub:$sub
    )
    {
      email
    }
  }
`
