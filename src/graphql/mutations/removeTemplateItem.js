import gql from 'graphql-tag'
export default gql`
  mutation removeTemplateItem($input: removeInput!) {
    removeTemplateItem(
      input:$input
    )
    {
      pk
      sk
    }
  }
`
