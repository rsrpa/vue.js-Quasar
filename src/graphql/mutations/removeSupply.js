import gql from 'graphql-tag'
export default gql`
  mutation removeSupply($input: removeInput!) {
    removeSupply(
      input:$input
    )
    {
      pk
      sk
      v2
    }
  }
`
