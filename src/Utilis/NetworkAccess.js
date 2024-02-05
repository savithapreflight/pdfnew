import NetInfo from '@react-native-community/netinfo';

function  NetwotkAccess(){
  const datafetch=NetInfo.fetch()
  console.log('isconnected',datafetch)
   return datafetch
}
export default NetwotkAccess