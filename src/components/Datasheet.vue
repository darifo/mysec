<script setup lang="ts">
import { ElMessage } from "element-plus";
import { split } from "lodash";
import {
  computed,
  inject,
  onMounted,
  onUnmounted,
  reactive,
  ref,
  watch,
} from "vue";
// import { useRouter } from "vue-router";
import { useStore } from "vuex";

let dialogFormVisible = ref(false);

const main = inject("$main") as any;
const ipc = main.ipcRenderer;
// const Router = useRouter();
const store = useStore();
let defaultAddForm = {
  name: "",
  password: "",
  account: "",
  addr: "",
  tags: "",
  remark: "",
};
let addForm = reactive(defaultAddForm);
let tableData: any[] = reactive([]);
let totalCount = ref(0);

let curPage = ref(1);

let search = ref("");
let options = ref([
  { value: "test", label: "测试" },
  { value: "prod", label: "生产" },
]);
let choose_type = ref("");
let height = computed(() => store.state.doc_height);
const handleCopyAccount = (index: number, account: string) => {
  ElMessage({
    message: "handleCopyAccount: " + account,
    type: "success",
  });
};
const handleCopyPassword = (index: number, password: string) => {
  console.log(index, password);
  ElMessage({
    message: "handleCopyPassword: " + password,
    type: "success",
  });
};
const handleCopy = (index: number, row: Object) => {
  console.log(index, row);
};
const handleShow = (index: number, row: Object) => {
  console.log(index, row);
};
const handleEdit = (index: number, row: Object) => {
  console.log(index, row);
};
const handleDelete = (index: number, row: Object) => {
  console.log(index, row);
};
const handleAdd = () => {
  // console.log(addForm);
  ipc.send("ipc_save_data", {
    name: addForm.name,
    password: addForm.password,
    account: addForm.account,
    tag: JSON.stringify(addForm.tags.split(",")),
    addr: addForm.addr,
    remark: addForm.remark,
  });
  ElMessage({
    message: "添加成功！",
    type: "success",
  });
  addForm.name = "";
  addForm.account = "";
  addForm.password = "";
  addForm.addr = "";
  addForm.tags = "";
  addForm.remark = "";
  dialogFormVisible.value = false;
  sendGetListReq(search.value, 1);
};

const curPageChange = (val: number) => {
  console.log(val);
  sendGetListReq(search.value, val);
};

const listGetListener = (e: string, data: any) => {
  console.log(data);
  totalCount.value = data.count;
  tableData.length = 0;
  for (let item of data.docs) {
    const line = {
      name: item.name,
      password: item.password,
      account: item.account,
      addr: item.addr,
      tags: JSON.parse(item.tag),
      remark: item.remark,
    };
    tableData.push(line);
  }
};

const sendGetListReq = (search: string, page_num: number) => {
  ipc.send("ipc_get_list_req", {
    msg: "请求查询列表数据",
    search: search,
    page_num: page_num,
    page_size: 2,
  });
};

onMounted(() => {
  ipc.on("ipc_get_list", listGetListener);
  sendGetListReq(search.value, 1);
});

onUnmounted(() => {
  ipc.removeListener("ipc_get_list", listGetListener);
});

watch(search, (newVal: string, oldVal: string) => {
  console.log(newVal, oldVal);
  sendGetListReq(search.value, 1);
});
</script>

<template>
  <div class="sheet_div"
       :style="{'height': height + 'px'}">
    <el-row>
      <el-col :span="12">
        <div class="grid-content"
             style="float:left">
          <el-select v-model="choose_type"
                     :clearable="true"
                     multiple
                     placeholder="选择标签">
            <el-option v-for="item in options"
                       :key="item.value"
                       :label="item.label"
                       :value="item.value" />
          </el-select>
        </div>
      </el-col>
      <el-col :span="12">
        <div class="grid-content"
             style="float:right">
          <el-input placeholder="请输入名称|账号"
                    prefix-icon="el-icon-search"
                    v-model="search"
                    style="float:left">
          </el-input>
        </div>
      </el-col>
    </el-row>

    <br />
    <el-row>
      <el-col :span="12">
        <div class="grid-content"
             style="float:left">
          <el-button type="primary"
                     @click="dialogFormVisible = true">添加</el-button>
        </div>
      </el-col>
      <el-col :span="12">
        <div class="grid-content">&nbsp;
        </div>
      </el-col>
    </el-row>

    <br />

    <el-table :data="tableData"
              style="width: 100%">
      <!-- <el-table-column label="ID"
                       prop="_id"
                       width="60px" /> -->
      <el-table-column label="名称"
                       prop="name" />
      <el-table-column label="账号"
                       prop="account">
        <template v-slot="scope">
          <el-link @click="handleCopyAccount(scope.$index, scope.row.account);"
                   :underline="false"
                   style="color:red">{{scope.row.account}}</el-link>
        </template>

      </el-table-column>
      <el-table-column label="密码"
                       prop="password">
        <template v-slot="scope">
          <el-button size="small"
                     link
                     type="success"
                     @click="handleCopyPassword(scope.$index, scope.row.password)">复制密码</el-button>
        </template>
      </el-table-column>

      <el-table-column label="地址"
                       prop="addr">
        <template v-slot="scope">
          <el-tooltip class="box-item"
                      effect="dark"
                      placement="top"
                      :content="scope.row.addr">
            <el-link :href="scope.row.addr"
                     :underline="false"
                     target="_blank"
                     style="color:lightseagreen">跳转</el-link>
          </el-tooltip>

        </template>
      </el-table-column>

      <el-table-column label="标签"
                       prop="tags">
        <template v-slot="scope">
          <div class="name-wrapper">
            <el-tag size="small"
                    v-for="(tag,index) in scope.row.tags"
                    :key="index">{{ tag }}</el-tag>
          </div>
        </template>
      </el-table-column>

      <el-table-column fixed="right"
                       label="操作">
        <template v-slot="scope">
          <el-button size="small"
                     link
                     type="success"
                     @click="handleCopy(scope.$index, scope.row)">复制</el-button>
          <el-button size="small"
                     link
                     type="primary"
                     @click="handleShow(scope.$index, scope.row)">详情</el-button>
          <el-button size="small"
                     link
                     type="warning"
                     @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
          <el-button size="small"
                     link
                     type="danger"
                     @click="handleDelete(scope.$index, scope.row)">删除</el-button>
        </template>
      </el-table-column>

    </el-table>

    <br />

    <el-pagination background
                   layout="prev, pager, next"
                   :total="totalCount"
                   :page-size="2"
                   v-model:currentPage="curPage"
                   @current-change="curPageChange" />
    <br />

    <el-dialog v-model="dialogFormVisible"
               :close-on-click-modal=false
               title="添加信息">
      <el-form :model="addForm">
        <el-form-item label="名称">
          <el-input v-model="addForm.name"
                    autocomplete="off" />
        </el-form-item>
        <el-form-item label="账号">
          <el-input v-model="addForm.account"
                    autocomplete="off" />
        </el-form-item>
        <el-form-item label="密码">
          <el-input v-model="addForm.password"
                    type="password"
                    autocomplete="off" />
        </el-form-item>
        <el-form-item label="地址">
          <el-input v-model="addForm.addr"
                    autocomplete="off" />
        </el-form-item>
        <el-form-item label="标签">
          <el-input v-model="addForm.tags"
                    autocomplete="off"
                    placeholder="多个英文逗号分隔" />
        </el-form-item>
        <el-form-item label="备注">
          <el-input v-model="addForm.remark"
                    type="textarea"
                    autocomplete="off" />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogFormVisible = false">取消</el-button>
          <el-button type="primary"
                     @click="handleAdd">保存</el-button>
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