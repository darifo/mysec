import { db } from './repo'

export const IPC_SEL_DATA = async (e: any, data: any) => {
  let rowData
  const getAll = new Promise((resolve) => {
    db.find({ account: 'root' }, function (err: string, docs: any) {
      resolve(docs)
    })
  })
  await getAll.then((val: any) => {
    rowData = val
  })
  // console.log(data)
  e.sender.send('ipc_recive_data', rowData)
}
