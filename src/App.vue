<script setup lang="ts">
import { ref } from 'vue';
import { useStore } from 'vuex';

const electron = require('electron');

const store = useStore();

let dialogAboutVisible = ref(false)

const version = store.state.app_info.app_version

// 从主进程获取APP信息，存储到store
electron.ipcRenderer.on('ipc_recive_app_info', (e, data) => {
  console.log('ipc_recive_app_info:', data);
  store.commit('SAVE_APP_INFO', data);
});

// 窗口尺寸改变
electron.ipcRenderer.on('ipc_win_resize', (e, data) => {
  console.log('ipc_win_resize:', data);
  store.commit('RESIZE_WIN', data);
});
// 监听主进程菜单点击事件
electron.ipcRenderer.on('ipc_menu_click', (e, code) => {
  console.log('ipc_menu_click:', code);
  if (code === 'ABOUT_ME') {
    dialogAboutVisible.value = true;
  }
});

</script>

<template>
  <router-view />

  <el-dialog v-model="dialogAboutVisible"
             :close-on-click-modal=false
             title="关于程序">
    <div class="grid-content bg-purple-light">
      <el-divider content-position="left">Mysec(本地版)</el-divider>
      <div> 是一款免费的工具类程序，用于存储管理工作中各种繁杂的系统账号密码、密钥、地址等重要信息。</div>
      <el-divider>
      </el-divider>
      Copyright © 2022 by
      <el-link type="primary"
               :underline="false"
               target="_blank"
               href="https://github.com/darifo"
               style="color:darkcyan">darifo</el-link> <br />
      <el-link type="primary"
               href="mailto:2248961461@qq.com"
               :underline="false"
               style="color:darkcyan">2248961461@qq.com</el-link>
      <br />
      <el-link type="primary"
               :underline="false"
               target="_blank"
               href="https://github.com/darifo/mysec"
               style="color:darkcyan"> Mysec {{ version }}</el-link>
    </div>
  </el-dialog>
</template>

<style scoped>

</style>
