import gql from 'graphql-tag'

export default gql`
  query getUsers
  {
    getUsers {
      sub
      email
      Enabled
      UserStatus
      groups  
      roles  
    }
  }
`
