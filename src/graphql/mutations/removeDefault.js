import gql from 'graphql-tag'
export default gql`
  mutation removeDefault($input: removeInput!) {
    removeDefault(
      input:$input
    )
    {
      pk
      sk
      v2
    }
  }
`
