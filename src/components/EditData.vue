<script lang="ts" setup>
import { ElMessage } from 'element-plus';
import { inject, reactive, toRaw, toRefs } from 'vue';
import AES from '../aes';
import { nextTick, ref } from "vue";
import { ElInput } from "element-plus";

const main = inject("$main") as any;
const ipc = main.ipcRenderer;
const props = defineProps(['dialogVisible'])
const emit = defineEmits(['closeMe', 'refreshList'])
let { dialogVisible } = toRefs(props)

const inputVisible = ref(false);
const InputRef = ref<InstanceType<typeof ElInput>>();
const inputValue = ref("");

type EditForm = {
  _id: string,
  name: string,
  password: string,
  account: string,
  addr: string,
  tags: string[],
  remark: string,
  t: string
}

let editForm: EditForm = reactive({
  _id: "", name: "", password: "", account: "",
  addr: "", tags: [], remark: "", t: ""
});

// 取消按钮
const handleCancel = () => {
  emit("closeMe", false)
  emit('refreshList', true)
}

// 父组件传行数据
const getRowData = (data: any) => {
  let row = toRaw(data)
  editForm._id = row.ID
  editForm.name = row.name
  editForm.account = row.account
  editForm.password = AES.decrypt(row.password)
  editForm.addr = row.addr
  editForm.tags = row.tags
  editForm.remark = row.remark
  editForm.t = row.t
}

// 暴露方法
defineExpose({ getRowData })

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
  editForm._id = "";
  editForm.t = "";
  editForm.name = "";
  editForm.account = "";
  editForm.password = "";
  editForm.addr = "";
  editForm.tags.length = 0;
  editForm.remark = "";
  emit('closeMe', false)
  emit('refreshList', true)
}

// 删除标签
const handleClose = (tag: string) => {
  editForm.tags.splice(editForm.tags.indexOf(tag), 1)
};

// 输入标签
const showInput = () => {
  inputVisible.value = true;
  nextTick(() => {
    InputRef.value!.input!.focus();
  });
};

// 确认标签
const handleInputConfirm = () => {
  if (inputValue.value) {
    editForm.tags.push(inputValue.value);
  }
  inputVisible.value = false;
  inputValue.value = "";
};

</script>

<template>
  <el-dialog v-model="dialogVisible" :close-on-click-modal=false :show-close=false title="编辑信息">
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
        <el-tag v-for="tag in editForm.tags" :key="tag" class="mx-1" closable :disable-transitions="false"
          @close="handleClose(tag)">
          {{ tag }}
        </el-tag>
        <el-input v-if="inputVisible" ref="InputRef" v-model="inputValue" class="ml-1 w-20" size="small"
          @keyup.enter="handleInputConfirm" @blur="handleInputConfirm" />
        <el-button v-else class="button-new-tag ml-1" size="small" @click="showInput">
          + 新建标签
        </el-button>
      </el-form-item>
      <el-form-item label="备注">
        <el-input v-model="editForm.remark" type="textarea" autocomplete="off" />
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="handleCancel">取消</el-button>
        <el-button type="primary" @click="handleEditSave">保存</el-button>
      </span>
    </template>
  </el-dialog>
</template>