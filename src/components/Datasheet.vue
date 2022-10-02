<script setup lang="ts">
import { ElMessage, ElMessageBox } from "element-plus";
import { split } from "lodash";
import DynamicTags from "./DynamicTags.vue";
import AES from './aes'

import {
  computed,
  inject,
  onMounted,
  onUnmounted,
  reactive,
  ref,
  toRaw,
  watch,
} from "vue";
// import { useRouter } from "vue-router";
import { useStore } from "vuex";
import { string } from "yargs";

let dialogFormVisible = ref(false);
let dialogEditFormVisible = ref(false);

const main = inject("$main") as any;

const ipc = main.ipcRenderer;
// const Router = useRouter();
const store = useStore();
let addForm = reactive({
  name: "",
  password: "",
  account: "",
  addr: "",
  tags: [],
  remark: "",
});
let editForm = reactive({
  _id: "",
  name: "",
  password: "",
  account: "",
  addr: "",
  tags: [],
  remark: "",
  t: ""
});
let tableData: any[] = reactive([]);
let totalCount = ref(0);
let pageSize = ref(5)
let curPage = ref(1);

let search = ref("");
let tagList = ref([]);
let chooseTag = ref([]);
let height = computed(() => store.state.doc_height);
const handleCopyAccount = (index: number, account: string) => {
  main.clipboard.writeText(account, 'selection')
  ElMessage({
    message: "账号复制成功！",
    type: "success",
  });
};
const handleCopyPassword = (index: number, password: string) => {
  main.clipboard.writeText(AES.decrypt(password), 'selection')
  ElMessage({
    message: "密码明文复制成功！ ",
    type: "success",
  });
};

const handleCopy = (index: number, row: any) => {
  console.log(index, row);
  const copyRow = {
    name: row.name,
    password: AES.decrypt(row.password),
    account: row.account,
    addr: row.addr,
    tags: toRaw(row.tags),
    remark: row.remark,
  }
  main.clipboard.writeText(JSON.stringify(copyRow), 'selection')
  ElMessage({
    message: "密码明文复制成功！ ",
    type: "success",
  });
};
// const handleShow = (index: number, row: any) => {
//   console.log(index, row);
// };

// 点击编辑按钮
const handleEdit = (index: number, row: any) => {
  // console.log(index, row);
  dialogEditFormVisible.value = true
  editForm._id = row.ID
  editForm.account = row.account
  editForm.name = row.name
  editForm.password = AES.decrypt(row.password)
  editForm.addr = row.addr
  editForm.tags = toRaw(row.tags)
  editForm.remark = row.remark
  editForm.t = row.t
  // 传递给子组件
  dynamicTags.value = toRaw(row.tags)
};
// 提交编辑保存
const handleEditSave = () => {
  let sendData = {
    _id: editForm._id,
    name: editForm.name,
    password: editForm.password,
    account: editForm.account,
    tags: toRaw(editForm.tags),
    addr: editForm.addr,
    remark: editForm.remark,
    t: editForm.t
  }
  ipc.send("ipc_edit_data", sendData);
  ElMessage({
    message: "编辑成功！",
    type: "success",
  });
  dialogEditFormVisible.value = false;
  sendGetListReq([], search.value, 1);
  sendGetTagListReq();
  // console.log(sendData);
}

const handleDelete = (index: number, row: any) => {

  ElMessageBox.confirm(
    '确认删除？',
    '警告',
    {
      confirmButtonText: '确认',
      cancelButtonText: '取消',
      type: 'warning',
    }
  ).then(() => {
    // console.log(index, row.ID);
    ipc.send('ipc_delete_data', row.ID)
    sendGetListReq([], search.value, 1)
    sendGetTagListReq()
    ElMessage({
      type: 'success',
      message: '删除成功！',
    })
  })
    .catch(() => { })

};
const handleAdd = () => {
  // console.log(addForm);
  let sendData = {
    name: addForm.name,
    password: addForm.password,
    account: addForm.account,
    tags: toRaw(addForm.tags),
    addr: addForm.addr,
    remark: addForm.remark,
  }
  // console.log(sendData);
  ipc.send("ipc_save_data", sendData);
  ElMessage({
    message: "添加成功！",
    type: "success",
  });
  addForm.name = "";
  addForm.account = "";
  addForm.password = "";
  addForm.addr = "";
  addForm.tags.length = 0;
  addForm.remark = "";
  dialogFormVisible.value = false;
  sendGetListReq([], search.value, 1);
  sendGetTagListReq();
};

const curPageChange = (val: number) => {
  // console.log(val);
  sendGetListReq([], search.value, val);
};

const listGetListener = (e: string, data: any) => {
  // console.log(data);
  totalCount.value = data.count;
  tableData.length = 0;
  for (let item of data.docs) {
    const line = {
      name: item.name,
      password: item.password,
      account: item.account,
      addr: item.addr,
      tags: item.tags,
      remark: item.remark,
      ID: item._id,
      t: item.t
    };
    tableData.push(line);
  }
};

const listGetTagListener = (e: string, data: any) => {
  // console.log(data);
  tagList.value = data
}

const sendGetListReq = (tags: string[], search: string, page_num: number) => {
  ipc.send("ipc_get_list_req", {
    msg: "请求查询列表数据",
    search: search,
    tags: tags,
    page_num: page_num,
    page_size: pageSize.value,
  });
};

const sendGetTagListReq = () => {
  ipc.send('ipc_get_tag_list_req', { msg: "请求获取标签列表数据！" });
}

const getTags = (tags: any) => {
  addForm.tags = tags
}
const getEditTags = (tags: any) => {
  editForm.tags = tags
}
// 定义子组件修改使用的数据
const dynamicTags: any = ref([]);

onMounted(() => {
  ipc.on("ipc_get_list", listGetListener);
  ipc.on("ipc_get_tag_list", listGetTagListener)
  sendGetListReq([], search.value, 1);
  sendGetTagListReq();
});

onUnmounted(() => {
  ipc.removeListener("ipc_get_list", listGetListener);
  ipc.removeListener("ipc_get_list", listGetTagListener);
});

watch(search, (newVal: string, oldVal: string) => {
  // console.log(newVal, oldVal);
  sendGetListReq([], search.value, 1);
});
watch(chooseTag, (newVal, oldVal) => {
  // console.log(toRaw(newVal));
  sendGetListReq(toRaw(newVal), search.value, 1);
});
</script>

<template>
  <div class="sheet_div" :style="{'height': height + 'px'}">
    <el-row>
      <el-col :span="12">
        <div class="grid-content" style="float:left">
          <el-select v-model="chooseTag" :clearable="true" multiple placeholder="选择标签">
            <el-option v-for="tag,index in tagList" :key="index" :label="tag" :value="tag" />
          </el-select>
        </div>
      </el-col>
      <el-col :span="12">
        <div class="grid-content" style="float:right">
          <el-input placeholder="请输入名称|账号" prefix-icon="el-icon-search" v-model="search" style="float:left">
          </el-input>
        </div>
      </el-col>
    </el-row>

    <br />
    <el-row>
      <el-col :span="12">
        <div class="grid-content" style="float:left">
          <el-button type="primary" @click="dialogFormVisible = true">添加</el-button>

        </div>
      </el-col>
      <el-col :span="12">
        <div class="grid-content">&nbsp;
        </div>
      </el-col>
    </el-row>

    <br />

    <el-table :data="tableData" style="width: 100%">
      <!-- <el-table-column label="ID"
                       prop="_id"
                       width="60px" /> -->
      <el-table-column label="名称" prop="name" />
      <el-table-column label="账号" prop="account">
        <template v-slot="scope">
          <el-link @click="handleCopyAccount(scope.$index, scope.row.account);" :underline="false" style="color:red">
            {{scope.row.account}}</el-link>
        </template>

      </el-table-column>
      <el-table-column label="密码" prop="password">
        <template v-slot="scope">
          <el-button size="small" link type="success" @click="handleCopyPassword(scope.$index, scope.row.password)">复制密码
          </el-button>
        </template>
      </el-table-column>

      <el-table-column label="地址" prop="addr">
        <template v-slot="scope">
          <el-tooltip class="box-item" effect="dark" placement="top" :content="scope.row.addr">
            <el-link :href="scope.row.addr" :underline="false" target="_blank" style="color:lightseagreen">跳转</el-link>
          </el-tooltip>

        </template>
      </el-table-column>

      <el-table-column label="标签" prop="tags">
        <template v-slot="scope">
          <div class="name-wrapper">
            <el-tag size="small" v-for="(tag,index) in scope.row.tags" :key="index">{{ tag }}</el-tag>
          </div>
        </template>
      </el-table-column>

      <el-table-column fixed="right" label="操作">
        <template v-slot="scope">
          <el-button size="small" link type="success" @click="handleCopy(scope.$index, scope.row)">复制</el-button>
          <!-- <el-button size="small" link type="primary" @click="handleShow(scope.$index, scope.row)">详情</el-button> -->
          <el-button size="small" link type="warning" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
          <el-button size="small" link type="danger" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
        </template>
      </el-table-column>

    </el-table>

    <br />

    <el-pagination background layout="prev, pager, next" :total="totalCount" :page-size="pageSize"
      v-model:currentPage="curPage" @current-change="curPageChange" />

    <br />
    <el-tag type="info">查询共计：{{totalCount}} 条数据</el-tag>

    <el-dialog v-model="dialogFormVisible" :close-on-click-modal=false title="添加信息">
      <el-form :model="addForm">
        <el-form-item label="名称">
          <el-input v-model="addForm.name" autocomplete="off" />
        </el-form-item>
        <el-form-item label="账号">
          <el-input v-model="addForm.account" autocomplete="off" />
        </el-form-item>
        <el-form-item label="密码">
          <el-input v-model="addForm.password" type="password" autocomplete="off" />
        </el-form-item>
        <el-form-item label="地址">
          <el-input v-model="addForm.addr" autocomplete="off" />
        </el-form-item>
        <el-form-item label="标签">
          <DynamicTags @pushTags="getTags" :dynamicTags="[]"></DynamicTags>
        </el-form-item>
        <el-form-item label="备注">
          <el-input v-model="addForm.remark" type="textarea" autocomplete="off" />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogFormVisible = false">取消</el-button>
          <el-button type="primary" @click="handleAdd">新增</el-button>
        </span>
      </template>
    </el-dialog>

    <el-dialog v-model="dialogEditFormVisible" :close-on-click-modal=false title="编辑信息">
      <el-form :model="editForm">
        <el-form-item label="名称">
          <el-input v-model="editForm.name" autocomplete="off" />
        </el-form-item>
        <el-form-item label="账号">
          <el-input v-model="editForm.account" autocomplete="off" />
        </el-form-item>
        <el-form-item label="密码">
          <el-input v-model="editForm.password" type="password" autocomplete="off" />
        </el-form-item>
        <el-form-item label="地址">
          <el-input v-model="editForm.addr" autocomplete="off" />
        </el-form-item>
        <el-form-item label="标签">
          <DynamicTags @pushTags="getEditTags" :dynamicTags="dynamicTags"></DynamicTags>
        </el-form-item>
        <el-form-item label="备注">
          <el-input v-model="editForm.remark" type="textarea" autocomplete="off" />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogEditFormVisible = false">取消</el-button>
          <el-button type="primary" @click="handleEditSave">保存修改</el-button>
        </span>
      </template>
    </el-dialog>

  </div>
</template>

<style scoped>
.sheet_div {
  margin-top: 20px;
  margin-left: 20px;
  margin-right: 20px;
}
</style>