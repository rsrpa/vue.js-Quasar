import gql from 'graphql-tag'
export default gql`
  mutation seqItem($fromPK: String!, $toPK: String!, $itemPK: String!, $newSeq: Int!, $oldSeq: Int!) {
    seqItem(
      fromPK:$fromPK
      toPK:$toPK
      itemPK:$itemPK
      newSeq:$newSeq
      oldSeq:$oldSeq
    )
    {
      v1
    }
  }
`
