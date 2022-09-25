import { dbUser, dbData } from './repo'

export const IPC_SEL_DATA = async (e: any, data: any) => {
  let rowData
  const getAll = new Promise((resolve) => {
    dbData.find({ account: 'root' }, function (err: string, docs: any) {
      resolve(docs)
    })
  })
  await getAll.then((val: any) => {
    rowData = val
  })
  // console.log(data)
  e.sender.send('ipc_recive_data', rowData)
}

export const IPC_SET_ROOT_PWD = async (e: any, data: any) => {
  console.log(data)
  // 清理用户
  dbUser.remove(
    {},
    { multi: true },
    function (err: string, numRemoved: number) {},
  )
  // 插入新用户
  dbUser.insert(
    { account: 'root', password: data },
    (err: string, newDoc: any) => {},
  )
}
