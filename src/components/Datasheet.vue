<script setup lang="ts">
import { ElMessage, ElMessageBox } from "element-plus";
import AES from '../aes'
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
import { useStore } from "vuex";
import AddData from "./AddData.vue";
import EditData from "./EditData.vue";

const main = inject("$main") as any;
const ipc = main.ipcRenderer;
const store = useStore();

const subFuncRef = ref<any>();

let dialogAddFormVisible = ref(false);
let dialogEditFormVisible = ref(false);

let tableData: object[] = reactive([{}])
let totalCount = ref(0);
let pageSize = ref(5)
let curPage = ref(1);
let search = ref("");
let tagList = ref([]);
let chooseTag = ref([]);
let height = computed(() => store.state.doc_height);

// 处理复制账号
const handleCopyAccount = (index: number, account: string) => {
  main.clipboard.writeText(account, 'selection')
  ElMessage({
    message: "账号复制成功！",
    type: "success",
  });
};

// 处理复制密码
const handleCopyPassword = (index: number, password: string) => {
  main.clipboard.writeText(AES.decrypt(password), 'selection')
  ElMessage({
    message: "密码明文复制成功！ ",
    type: "success",
  });
};

// 复制整行
const handleCopy = (index: number, row: any) => {
  // console.log(index, row);
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

// 点击删除按钮
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

// 页码变更
const curPageChange = (val: number) => {
  // console.log(val);
  sendGetListReq([], search.value, val);
};

// 获取数据列表回调
const listGetListener = (e: string, data: any) => {
  // console.log(data);
  totalCount.value = data.count;
  // 清空旧表数据
  tableData.length = 0;
  for (let i = 0; i < data.docs.length; i++) {
    const lineData = {
      name: data.docs[i].name,
      password: data.docs[i].password,
      account: data.docs[i].account,
      addr: data.docs[i].addr,
      tags: data.docs[i].tags,
      remark: data.docs[i].remark,
      ID: data.docs[i]._id,
      t: data.docs[i].t
    };
    tableData.push(lineData);
  }
  // console.log(tableData);
};

// 获取标签列表回调
const listGetTagListener = (e: string, data: any) => {
  // console.log(data);
  tagList.value = data
}

// 请求获取数据列表
const sendGetListReq = (rtags: string[], search: string, page_num: number) => {
  ipc.send("ipc_get_list_req", {
    msg: "请求查询列表数据",
    search: search,
    tags: rtags,
    page_num: page_num,
    page_size: pageSize.value,
  });
};

// 请求获取标签列表
const sendGetTagListReq = () => {
  ipc.send('ipc_get_tag_list_req', { msg: "请求获取标签列表数据！" });
}

// 点击添加按钮
const handleOpenAddForm = () => {
  dialogAddFormVisible.value = true
}

// 点击编辑按钮
const handleEdit = (index: number, row: any) => {
  dialogEditFormVisible.value = true
  subFuncRef.value.getRowData(row);
};

// 关闭添加窗口
const closeAddFrom = (data: any) => {
  dialogAddFormVisible.value = false
}

// 刷新数据列表-添加数据后
const refreshListAfterAdd = (data: any) => {
  sendGetListReq([], search.value, 1);
  sendGetTagListReq();  
}

// 关闭编辑窗口
const closeEditForm = (data: any) => {
  dialogEditFormVisible.value = false
}

onMounted(() => {
  ipc.on("ipc_get_list", listGetListener);
  ipc.on("ipc_get_tag_list", listGetTagListener)
  sendGetListReq([], search.value, 1);
  sendGetTagListReq();
});

onUnmounted(() => {
  ipc.removeListener("ipc_get_list", listGetListener);
  ipc.removeListener("ipc_get_tag_list", listGetTagListener);
});

// 监听搜索框内容变化
watch(search, (newVal: string, oldVal: string) => {
  // console.log(newVal);
  sendGetListReq([], search.value, 1);
});

// 监听下拉选择变化
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
          <el-button type="primary" @click="handleOpenAddForm">添加</el-button>
        </div>
      </el-col>
      <el-col :span="12">
        <div class="grid-content">&nbsp;
        </div>
      </el-col>
    </el-row>

    <br />

    <el-table :data="tableData" style="width: 100%">
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

    <AddData @closeMe="closeAddFrom" @refreshList="refreshListAfterAdd" :dialogVisible="dialogAddFormVisible"></AddData>
    <EditData @closeMe="closeEditForm" @refreshList="refreshListAfterAdd" :dialogVisible="dialogEditFormVisible"
      ref="subFuncRef"></EditData>
  </div>
</template>

<style scoped>
.sheet_div {
  margin-top: 20px;
  margin-left: 20px;
  margin-right: 20px;
}
</style>