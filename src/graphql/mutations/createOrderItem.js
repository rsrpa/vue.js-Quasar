import gql from 'graphql-tag'
export default gql`
  mutation createOrderItem($input: orderItemInput!) {
    createOrderItem(
      input: $input
    )
    {
      pk
      sk
      gsi1pk
      gsi1sk
      gsi2pk
      gsi2sk
      v1
      v2
      v3
      v4
      v5
      map
      _version
    }
  }
`
