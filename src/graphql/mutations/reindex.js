import gql from 'graphql-tag'
export default gql`
  mutation reindex($pk: String!) {
    reindex(
      pk:$pk
    )
    {
      pk
      v1
    }
  }
`
