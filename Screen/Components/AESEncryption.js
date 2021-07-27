import { NativeModules } from 'react-native'
import DeviceInfo from 'react-native-device-info'
var Aes = NativeModules.Aes

const AESEncryption = async(purpose, data)=> {
    
    const uniqueId = DeviceInfo.getUniqueId().split('-').join('');
    const uid = uniqueId + uniqueId;
    
    const encryptData = (text) => Aes.encrypt(text, uid, null)
    const decryptData = (encryptedData) => Aes.decrypt(encryptedData, uid, null)

     if(purpose == "encrypt"){    
        try {
            let text = await encryptData(data)
            return text
        } catch (e) {
            // console.error(e)
        }
     }else{
        try {
            let text = await decryptData(data)
            return text
        } catch (e) {
            // console.error(e)
        }
     }
}

export default AESEncryption;
