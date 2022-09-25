import CryptoJS from 'crypto-js'

export const AES_KEY = 'Https112233...'
export const AES_IV = '00000000000000000000000000000000'
/**
 * aes加密
 * @param data 待加密内容
 * @returns {string}
 */
export const encryptByAES = (data: string, aes_key: string, aes_iv: string) => {
  const key = CryptoJS.enc.Utf8.parse(aes_key)
  const iv = CryptoJS.enc.Utf8.parse(aes_iv)
  let str = CryptoJS.enc.Utf8.parse(data)
  let encrypted = CryptoJS.AES.encrypt(str, key, {
    iv: iv,
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.Pkcs7,
  })
  let encryptedBase64Data = CryptoJS.enc.Base64.stringify(encrypted.ciphertext)
  return encodeURIComponent(encryptedBase64Data)
}

/**
 * aes解密
 * @param data 待解密内容
 * @returns {string}
 */
export const decryptedByAES = (
  data: string,
  aes_key: string,
  aes_iv: string,
) => {
  const key = CryptoJS.enc.Utf8.parse(aes_key)
  const iv = CryptoJS.enc.Utf8.parse(aes_iv)
  data = decodeURIComponent(data)
  let encryptedHexStr = CryptoJS.enc.Base64.parse(data)
  let str = CryptoJS.enc.Base64.stringify(encryptedHexStr)
  let decrypt = CryptoJS.AES.decrypt(str, key, {
    iv: iv,
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.Pkcs7,
  })
  let decryptedStr = decrypt.toString(CryptoJS.enc.Utf8)
  return decryptedStr.toString()
}
