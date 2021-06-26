import gql from 'graphql-tag'
export default gql`
  mutation removeTemplate($pk: String!) {
    removeTemplate(
      pk:$pk
    )
    {
      pk
      sk
      v2
    }
  }
`
