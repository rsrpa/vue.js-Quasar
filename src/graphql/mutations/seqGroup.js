import gql from 'graphql-tag'
export default gql`
  mutation seqGroup($pk: String!, $newSeq: Int!, $oldSeq: Int!) {
    seqGroup(
      pk:$pk
      oldSeq:$oldSeq
      newSeq:$newSeq
    )
    {
      v1
    }
  }
`
