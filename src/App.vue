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

<script>
import electron from 'electron';
import { useStore } from 'vuex';

export default {
    name: 'App',
    data() {
        return {
            version: 'release v-0.1.1 (local)',
            dialogAboutVisible: false,
        };
    },
    components: {},
    created() {
        const store = useStore();
        const ipc = electron.ipcRenderer;
        ipc.send('ipc_win_init_size', '请求获取窗口初始尺寸');
        // 监听窗口尺寸改变
        ipc.on('ipc_win_resize', (e, data) => {
            // console.log(new Date());
            console.log('ipc_win_resize:', data);
            store.commit('RESIZE_WIN', data);
        });
        // 监听菜单点击
        let _this = this;
        ipc.on('ipc_menu_click', (e, code) => {
            console.log('ipc_menu_click:', code);
            if (code === 'ABOUT_ME') {
                _this.dialogAboutVisible = true;
            }
        });
    },
    mounted() {},
    methods: {},
};
</script>

<style>
#app {
    font-family: Avenir, Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #2c3e50;
    margin-top: 50px;
}
.ifooter {
    color: gray;
    text-align: center;
    line-height: 25px;
    /* margin-bottom: 50px; */
    font-size: small;
}
</style>
