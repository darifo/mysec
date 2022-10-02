<script setup lang="ts">
import { computed, inject, ref, onMounted, reactive, onUnmounted } from "vue";
import { useRouter } from "vue-router";
import { useStore } from "vuex";
import { ElMessageBox } from "_element-plus@2.2.17@element-plus";

const main = inject("$main") as any;
const ipc = main.ipcRenderer;
const Router = useRouter();
const store = useStore();
let height = computed(() => store.state.doc_height);
let UserForm = reactive({ password: "" });
const loginButton = computed(() => store.state.app_info.is_init_root);
const setPwdButton = computed(() => !store.state.app_info.is_init_root);
const setPwdButtonDisable = computed(() => UserForm.password == "");

// 检查主密码回调
const listenerfun = (e: string, data: any) => {
  if (data.rStatus === true) {
    Router.push({
      name: "LIST",
      params: {},
    });
  } else {
    ElMessageBox.alert("主密码错误！", "警告", {});
  }
};

// 登录按钮点击
const loginCheck = () => {
  if (UserForm.password == "") {
    ElMessageBox.alert("密码不能为空！", "警告", {});
  } else if (UserForm.password.length < 8) {
    ElMessageBox.alert("密码长度大于等于8位字符！", "警告", {});
  } else {
    ipc.send("ipc_check_root", {
      msg: "请求检查主密码是否正确",
      password: UserForm.password,
    });
  }
};

// 设置密码按钮点击
const setRootPassword = () => {
  // 校验密码
  if (UserForm.password === "") {
    ElMessageBox.alert("密码不能为空！", "警告", {});
  } else if (UserForm.password.length < 8) {
    ElMessageBox.alert("密码长度必须大于等于8位字符！", "警告", {});
  } else {
    ipc.send("ipc_set_root_pwd", UserForm.password);
    ElMessageBox.alert("设置密码成功！", "提示", {});
    UserForm.password = "";
    store.state.app_info.is_init_root = true;
  }
};

// 输入框回车拦截
const enterInputHandler = () => {
  if (loginButton.value) {
    loginCheck();
  }
  if (setPwdButton.value) {
    setRootPassword();
  }
};

onMounted(() => {
  ipc.on("ipc_check_result", listenerfun);
});

onUnmounted(() => {
  ipc.removeListener("ipc_check_result", listenerfun);
});
</script>

<template>
  <el-container>
    <el-main class="cc" :style="{'height': height + 'px'}">
      <el-form @submit.enter.prevent :model="UserForm" :inline="true">
        <el-form-item label="密码" prop="password" :rules="[
          { required: true, message: 'password is required' },
        ]">
          <el-input v-model.number="UserForm.password" @keyup.enter="enterInputHandler" type="password"
            autocomplete="off" />
        </el-form-item>
        <el-form-item>
          <el-button v-if="loginButton" type="primary" size="small" @click="loginCheck">验证</el-button>
          <el-button v-if="setPwdButton" type="primary" size="small" :disabled="setPwdButtonDisable"
            @click="setRootPassword">设置密码</el-button>
        </el-form-item>
      </el-form>
    </el-main>
  </el-container>
</template>

<style scoped>
.cc {
  display: flex;
  justify-content: center;
  /* 弹性布局的左右居中对齐 */
  align-items: center;
  /*弹性布局的垂直居中对齐*/
  width: 100%;
  /* border: 1px solid red; */
}
</style>
