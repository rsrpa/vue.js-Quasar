import gql from 'graphql-tag'
export default gql`
  mutation subs($supplyPK: String!, $favsID: String!) {
    subs(
      supplyPK:$supplyPK
      favsID:$favsID
    )
    {
      v1
      v2
    }
  }
`
