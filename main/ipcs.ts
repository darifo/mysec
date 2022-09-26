import { dbUser, dbData } from './repo'
import AES from './aes'

export const IPC_CHECK_ROOT = async (e: any, data: any) => {
  console.log(data)
  let doc: any
  const getOne = () => {
    return new Promise((resolve) => {
      dbUser.findOne(
        { account: 'root', password: AES.encrypt(data.password) },
        function (err: string, doc: any) {
          resolve(doc)
        },
      )
    })
  }
  doc = await getOne()
  let rStatus: boolean = doc === null ? false : true
  e.sender.send('ipc_check_result', { rStatus: rStatus })
}

export const IPC_SET_ROOT_PWD = async (e: any, data: string) => {
  console.log(data)
  // 清理用户
  dbUser.remove(
    {},
    { multi: true },
    function (err: string, numRemoved: number) {},
  )
  // 插入新用户
  dbUser.insert(
    { account: 'root', password: AES.encrypt(data) },
    (err: string, newDoc: any) => {
      console.log(newDoc)
    },
  )
}

type AddForm = {
  name: string
  password: string
  account: string
  addr: string
  tag: string
  remark: string
}

// 处理新增数据
export const IPC_SAVE_DATA = (e: any, data: AddForm) => {
  const insertData = {
    name: data.name,
    password: AES.encrypt(data.password),
    account: data.account,
    addr: data.addr,
    tag: data.tag,
    remark: data.remark,
  }
  dbData.insert(insertData, (err: string, newDoc: any) => {
    console.log(newDoc)
  })
}

// 监听请求获取列表数据
export const IPC_GET_LIST_REQ = async (e: any, data: any) => {
  console.log(data)
  const search = data.search
  const pageNum = data.page_num
  const pageSize = data.page_size
  const getList = () => {
    return new Promise(async (resolve) => {
      // sort: 字段名 + 排序方式（1升序 -1降序）
      // skip：跳过 limit：限制
      let where = {}
      if (search !== '') {
        // 转换为正则模糊搜索
        const regexp = new RegExp(search)
        where = { name: regexp }
      }
      const countPromi = () => {
        return new Promise((resolve) => {
          dbData.count(where, (err: string, count: number) => {
            resolve(count)
          })
        })
      }
      let countL = await countPromi()
      const listPromi = () => {
        return new Promise((resolve) => {
          dbData
            .find(where)
            .sort({ _id: 1 })
            .skip((pageNum - 1) * pageSize)
            .limit(pageSize)
            .exec((err: string, docs: any) => {
              resolve(docs)
            })
        })
      }
      let docsL = await listPromi()
      resolve({ count: countL, docs: docsL })
    })
  }
  let res = await getList()
  e.sender.send('ipc_get_list', res)
}
