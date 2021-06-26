import gql from 'graphql-tag'
export default gql`
  mutation removeInventory($input: removeInput!) {
    removeInventory(
      input:$input
    )
    {
      pk
      sk
    }
  }
`
