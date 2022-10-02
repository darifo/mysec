import { dbUser, dbData } from './repo'
import AES from './aes'

type AddForm = {
  name: string
  password: string
  account: string
  addr: string
  tags: string
  remark: string
}

// 登录检查主密码
export const IPC_CHECK_ROOT = async (e: any, data: any) => {
  // console.log(data)
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

// 初始化设置主密码
export const IPC_SET_ROOT_PWD = async (e: any, data: string) => {
  // console.log(data)
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
      // console.log(newDoc)
    },
  )
}

// 处理新增数据
export const IPC_SAVE_DATA = (e: any, data: AddForm) => {
  const insertData = {
    name: data.name,
    password: AES.encrypt(data.password),
    account: data.account,
    addr: data.addr,
    tags: data.tags,
    remark: data.remark,
    t: Date.parse(new Date().toString()),
  }
  dbData.insert(insertData, (err: string, newDoc: any) => {
    // console.log(newDoc)
  })
}

// 监听请求获取列表数据
export const IPC_GET_LIST_REQ = async (e: any, data: any) => {
  // console.log(data)
  const search = data.search
  const tags = data.tags
  const pageNum = data.page_num
  const pageSize = data.page_size
  const getList = () => {
    return new Promise(async (resolve) => {
      // sort: 字段名 + 排序方式（1升序 -1降序）
      // skip：跳过 limit：限制
      let where1 = {}
      let where2 = {}
      if (search !== '') {
        // 转换为正则模糊搜索
        const regexp = new RegExp(search)
        where1 = { name: regexp }
      }
      if (tags.length > 0) {
        where2 = { tags: { $in: tags } }
      }
      // 合并查询条件
      let where = Object.assign(where1, where2)
      // console.log(where)
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
            .sort({ t: -1 })
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

// 读取所有数据标签（去重复）
export const IPC_GET_TAG_LIST_REQ = async (e: any, data: any) => {
  const getList = () => {
    return new Promise<any[]>(async (resolve) => {
      dbData
        .find({})
        .sort({ t: -1 })
        .exec((err: string, docs: any) => {
          resolve(docs)
        })
    })
  }
  let list = await getList()
  let alltags: any = []
  for (let item of list) {
    const curTags = item.tags
    for (let tag of curTags) {
      // 去重复
      if (alltags.indexOf(tag) == -1) {
        alltags.push(tag)
      }
    }
  }
  // console.log(alltags)
  e.sender.send('ipc_get_tag_list', alltags)
}

// 删除数据行
export const IPC_DELETE_DATA = async (e: any, data: any) => {
  // console.log(data)
  dbData.remove({ _id: data }, {}, function (err: string, numRemoved: number) {
    // console.log('removed:' + numRemoved)
  })
}

// 处理修改数据
export const IPC_EDIT_DATA = (e: any, data: any) => {
  // console.log(data)
  const updateData = {
    name: data.name,
    password: AES.encrypt(data.password),
    account: data.account,
    addr: data.addr,
    tags: data.tags,
    remark: data.remark,
    t: data.t,
  }
  dbData.update(
    { _id: data._id },
    updateData,
    {},
    function (err: string, numReplaced: number) {
      // console.log(err, numReplaced)
    },
  )
}

// 检查主密码是否正确
export const IPC_RESET_CHECK_ROOT_PWD = async (e: any, data: any) => {
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
  // console.log(doc)
  let rStatus: boolean = doc === null ? false : true
  e.sender.send('ipc_reset_check_root_res', { rStatus: rStatus })
}

// 处理修改主密码
export const IPC_RESET_ROOT_PWD = async (e: any, data: any) => {
  // console.log(data)
  // 清理用户
  dbUser.remove(
    {},
    { multi: true },
    function (err: string, numRemoved: number) {},
  )
  // 插入新用户
  dbUser.insert(
    { account: 'root', password: AES.encrypt(data.password) },
    (err: string, newDoc: any) => {
      // console.log(newDoc)
    },
  )
}
