import gql from 'graphql-tag'

export default gql`
  query getRappid
  {
    getRappid {
      name
      groups{
        name
        items{
          sku 
          current_quant
          max_quant
          image
          description
          pricing{
            price
          }
        }
      }
    }
  }
`
