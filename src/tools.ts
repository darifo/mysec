const genCode = (size: number, inOptions: string) => {
  let outString: string = ''
  for (let i = 0; i < size; i++) {
    outString += inOptions.charAt(Math.floor(Math.random() * inOptions.length))
  }
  return outString
}

export default {
  makeStringInNum(size: number) {
    let inOptions: string = '0123456789'
    return genCode(size, inOptions)
  },
  makeStringInChar(size: number) {
    let inOptions: string =
      'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'
    return genCode(size, inOptions)
  },
  makeStringInCharLower(size: number) {
    let inOptions: string = 'abcdefghijklmnopqrstuvwxyz'
    return genCode(size, inOptions)
  },
  makeStringInCharUpper(size: number) {
    let inOptions: string = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
    return genCode(size, inOptions)
  },
  makeStringInNumAndCharLower(size: number) {
    let inOptions: string = '0123456789abcdefghijklmnopqrstuvwxyz'
    return genCode(size, inOptions)
  },
  makeStringInNumAndCharUpper(size: number) {
    let inOptions: string = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ'
    return genCode(size, inOptions)
  },
  makeStringInNumAndChar(size: number) {
    let inOptions: string =
      '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'
    return genCode(size, inOptions)
  },
  makeStringInNumAndCharAll(size: number) {
    let inOptions: string =
      '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ@#$%^&*.!='
    return genCode(size, inOptions)
  },
}
