import gql from 'graphql-tag'
export default gql`
  subscription nocanMsgReceived($device: String){
    nocanMsgReceived(device: $device)
      {
        channel
        value
        device
      }
  }
`
