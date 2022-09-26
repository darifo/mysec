
import CryptoJS from 'crypto-js'

//16位
const key = CryptoJS.enc.Utf8.parse('httpsanywhere123')
const iv = CryptoJS.enc.Utf8.parse('9876543212345678')

export default {
  //aes加密
  encrypt(word: string) {
    let encrypted
    const srcs = CryptoJS.enc.Utf8.parse(word)
    encrypted = CryptoJS.AES.encrypt(srcs, key, {
      iv: iv,
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7,
    })
    return encrypted.ciphertext.toString()
  },
  // aes解密
  decrypt(word: string) {
    const encryptedHexStr = CryptoJS.enc.Hex.parse(word)
    const srcs = CryptoJS.enc.Base64.stringify(encryptedHexStr)
    const decrypt = CryptoJS.AES.decrypt(srcs, key, {
      iv: iv,
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7,
    })
    const decryptedStr = decrypt.toString(CryptoJS.enc.Utf8)
    return decryptedStr.toString()
  },
}
