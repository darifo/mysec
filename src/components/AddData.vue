<script lang="ts" setup>

import { ElMessage } from 'element-plus';
import { inject, reactive, toRaw, toRefs, watch } from 'vue';
import DynamicTags from "./DynamicTags.vue";

const main = inject("$main") as any;
const ipc = main.ipcRenderer;
const props = defineProps(['dialogVisible'])
const emit = defineEmits(['closeMe', 'refreshList'])
let { dialogVisible } = toRefs(props)

// 添加表单结构体
type AddForm = {
  name: string,
  password: string,
  account: string,
  addr: string,
  tags: string[],
  remark: string,
}

let addForm: AddForm = reactive({
  name: "", account: "", password: "", addr: "", tags: [], remark: ""
});

// 新增-从子组件获取标签
const getTagsFromSubVue = (tags: any) => {
  addForm.tags = tags
  // console.log(addForm);
}

// 取消按钮
const handleCancel = () => {
  emit("closeMe", false)
}

// 发送主进程 新增数据
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
  // 关闭窗口
  emit("closeMe", false)
  // 刷新表数据
  emit("refreshList", true)
};

</script>

<template>
  <el-dialog v-model="dialogVisible" :show-close=false :close-on-click-modal=false title="添加信息">
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
        <DynamicTags @pushTags="getTagsFromSubVue"></DynamicTags>
      </el-form-item>
      <el-form-item label="备注">
        <el-input v-model="addForm.remark" type="textarea" autocomplete="off" />
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="handleCancel">取消</el-button>
        <el-button type="primary" @click="handleAdd">新增</el-button>
      </span>
    </template>
  </el-dialog>
</template>