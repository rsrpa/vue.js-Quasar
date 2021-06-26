import gql from 'graphql-tag'
export default gql`
  mutation putLocation($input: locationInput!) {
    putLocation(
      input:$input
    )
    {
      pk
      sk
      v1
    }
  }
`
