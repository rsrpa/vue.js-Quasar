import gql from 'graphql-tag'
export default gql`
  mutation addFavourite($favPK: String!, $supplyPK: String!) {
    addFavourite(
      favPK:$favPK
      supplyPK:$supplyPK
    )
    {
      pk 
      sk 
      gsi1pk
      gsi1sk
      v1
      v2
    }
  }
`
