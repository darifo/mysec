<script setup lang="ts">
import { ElMessage, ElMessageBox } from "element-plus";
import { inject, onMounted, onUnmounted, reactive, ref } from "vue";
import { useRouter } from "vue-router";
import { useStore } from "vuex";
import ToolBox from './components/ToolBox.vue'

const main = inject("$main") as any;
const ipc = main.ipcRenderer;
const store = useStore();
const Router = useRouter();

let dialogAboutVisible = ref(false);
let version = ref("0.0.0");

const showUpdater = ref(false)
const downloadProcess: any = ref({})

const editRootVisible = ref(false);
let userForm = reactive({
  old_password: "",
  new_password: "",
  re_new_password: ""
})

const toolBoxVisible = ref(false);

// 编辑主密码保存按钮
const handleEditRootSave = () => {
  if (userForm.old_password === "" || userForm.new_password === "") {
    ElMessageBox.alert("密码不能为空！", "警告", {});
  } else if (userForm.new_password.length < 8) {
    ElMessageBox.alert("密码长度必须大于等于8位字符！", "警告", {});
  } else if (userForm.new_password !== userForm.re_new_password) {
    ElMessageBox.alert("两次输入新密码不一致～", "警告", {});
  } else {
    // 先检查原主密码是否正确
    ipc.send("ipc_reset_check_root_pwd", {
      msg: "请求检查主密码是否正确",
      password: userForm.old_password,
    });
  }
}

// 修改主密码回调
const listenerCheckResetRes = (e: string, data: any) => {
  // console.log(data);
  if (data.rStatus === true) {
    let sendData = {
      password: userForm.new_password,
    }
    ipc.send('ipc_reset_root_pwd', sendData)
    ElMessage({
      message: "主密码修改成功！",
      type: "success",
    })
    userForm.new_password = ""
    userForm.old_password = ""
    userForm.re_new_password = ""
    editRootVisible.value = false
    Router.push({
      name: "HOME",
      params: {},
    });
  } else {
    ElMessageBox.alert("主密码错误！", "警告", {});
  }
}

// 获取app信息回调
const ipcAppInfoListener = (e: string, data: any) => {
  // console.log("ipc_recive_app_info:", data);
  store.commit("SAVE_APP_INFO", data);
  version.value = store.state.app_info.app_version;
};

// 获取窗口尺寸变更回调
const ipcWinResizeListener = (e: string, data: any) => {
  // console.log("ipc_win_resize:", data);
  store.commit("RESIZE_WIN", data);
};

// 主进程菜单点击事件
const ipcMenuClickListener = (e: string, code: string) => {
  // console.log("ipc_menu_click:", code);
  if (code === "ABOUT_ME") {
    dialogAboutVisible.value = true;
  }
  if (code === "CLOCK_PAGE") {
    Router.push({
      name: "HOME",
      params: {},
    });
  }
  if (code === "CHECK_UPDATE") {
    // console.log("CHECK_UPDATE");
  }
  if (code === "RESET_ROOT_PWD") {
    // console.log("RESET_ROOT_PWD");
    userForm.old_password = ""
    userForm.new_password = ""
    userForm.re_new_password = ""
    editRootVisible.value = true
  }
  if (code === "TOOLS_CHAR_GEN") {
    toolBoxVisible.value = true;
  }
};

// 关闭工具窗口
const closeToolWin = (data: any) => {
  toolBoxVisible.value = false
}

// 程序更新事件回调
const ipcUpdateListener = (e: string, info: any) => {
  if (info.status === "progress") {
    showUpdater.value = true
    downloadProcess.value = info.info
    if (downloadProcess.percent >= 100) {
      showUpdater.value = false
    }
  }
  if (info.status === "downloaded") {
    showUpdater.value = false
  }
}
// 字节转兆
const byteToM = (num: number) => {
  if (num <= 0) return 0.00;
  let mn = num / 1024 / 1024
  return mn.toFixed(2);
}

onMounted(() => {
  // 从主进程获取APP信息，存储到store
  ipc.on("ipc_recive_app_info", ipcAppInfoListener);
  // 窗口尺寸改变
  ipc.on("ipc_win_resize", ipcWinResizeListener);
  // 监听主进程菜单点击事件
  ipc.on("ipc_menu_click", ipcMenuClickListener);
  // 监听更新
  ipc.on("ipc_updater", ipcUpdateListener);
  // 检查主密码是否正确回调
  ipc.on("ipc_reset_check_root_res", listenerCheckResetRes);
});

onUnmounted(() => {
  // ipc.removeListener("ipc_recive_app_info", ipcAppInfoListener);
  // ipc.removeListener("ipc_win_resize", ipcWinResizeListener);
  // ipc.removeListener("ipc_menu_click", ipcMenuClickListener);
  ipc.removeListener("ipc_updater", ipcUpdateListener)
  ipc.removeListener("ipc_reset_check_root_res", listenerCheckResetRes)
});
</script>

<template>
  <router-view />

  <!-- 关于程序窗口 -->
  <el-dialog v-model="dialogAboutVisible" :close-on-click-modal=true title="关于程序">
    <div class="grid-content bg-purple-light">
      <el-divider content-position="left">Mysec(本地版)</el-divider>
      <div>
        是一款免费的系统账号管理工具，用于存储管理工作中各种繁杂的系统账号密码、密钥、地址等重要信息；
        密码采用 AES 算法加密存储, 您可以通过点击打开目标系统地址，也可以点击复制系统账号或密码用于快速登录；
        可以通过标签筛选、模糊搜索快速的找到您想用的系统账号和地址等信息；
      </div>
      <el-divider>
      </el-divider>
      Copyright © 2022 by
      <el-link type="primary" :underline="false" target="_blank" href="https://github.com/darifo"
        style="color:darkcyan">darifo</el-link> <br />
      <el-link type="primary" href="mailto:2248961461@qq.com" :underline="false" style="color:darkcyan">
        2248961461@qq.com</el-link>
      <br />
      <el-link type="primary" :underline="false" target="_blank" href="https://github.com/darifo/mysec"
        style="color:darkcyan"> Mysec {{ version }}</el-link>
      <br />
      <el-link type="primary" :underline="false" target="_blank" href="https://github.com/darifo/mysec/releases"
        style="color:darkcyan"> releases </el-link>
    </div>
  </el-dialog>

  <!-- 应用更新窗口 -->
  <el-dialog title="应用更新......" v-model="showUpdater" :close-on-click-modal="false" :show-close="false"
    :close-on-press-escape="false">
    <template v-if="downloadProcess">
      <p>{{'当前: ' + byteToM(downloadProcess.transferred) + ' M / 共 ' + byteToM(downloadProcess.total) + ' M'}}</p>
      <el-progress :text-inside="true" :stroke-width="18" :percentage="downloadProcess.percent.toFixed(2)">
      </el-progress>
      <p>正在下载 ( {{ byteToM(downloadProcess.bytesPerSecond) }} Mb/s ) ......</p>
    </template>
  </el-dialog>

  <!-- 修改主密码窗口 -->
  <el-dialog v-model="editRootVisible" :close-on-click-modal=false title="修改主密码">
    <el-form :model="userForm">
      <el-form-item label="验证旧密码" prop="old_password" :rules="[
        { required: true, message: 'password is required' },
      ]">
        <el-input v-model="userForm.old_password" type="password" autocomplete="off" />
      </el-form-item>
      <el-form-item label="输入新密码" prop="new_password" :rules="[
        { required: true, message: 'password is required' },
      ]">
        <el-input v-model="userForm.new_password" type="password" autocomplete="off" />
      </el-form-item>
      <el-form-item label="重复新密码" prop="re_new_password" :rules="[
        { required: true, message: 'password is required' },
      ]">
        <el-input v-model="userForm.re_new_password" type="password" autocomplete="off" />
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="editRootVisible = false">取消</el-button>
        <el-button type="primary" @click="handleEditRootSave">提交</el-button>
      </span>
    </template>
  </el-dialog>

  <ToolBox @closeMe="closeToolWin" :boxVisible="toolBoxVisible"></ToolBox>

</template>

<style scoped>

</style>
