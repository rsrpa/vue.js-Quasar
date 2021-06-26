import gql from 'graphql-tag'
export default gql`
  mutation createUser( $email: String!, $name: String!,$roles: String!) {
    createUser(
      email:$email
      name:$name
      roles:$roles
    )
    {
      email
    }
  }
`
