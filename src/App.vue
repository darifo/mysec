<template>

  <el-container>
    <el-main>
      <router-view />
    </el-main>
    <el-footer class="ifooter">
      <el-row>
        <el-col :span="8">
          <div class="grid-content bg-purple">&nbsp;</div>
        </el-col>
        <el-col :span="8">
          <div class="grid-content bg-purple-light">
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
                     style="color:darkcyan">mysec {{ version }}</el-link>
          </div>
        </el-col>
        <el-col :span="8">
          <div class="grid-content bg-purple">&nbsp;</div>
        </el-col>
      </el-row>

    </el-footer>
  </el-container>
</template>

<script>
import electron from 'electron';
import { useStore } from 'vuex';

export default {
    name: 'App',
    data() {
        return {
            version: 'v-0.1.1',
        };
    },
    components: {},
    created() {
        const store = useStore();
        const ipc = electron.ipcRenderer;
        ipc.send('test_ipc_a', '渲染进程给主进程发送的消息～');
        ipc.on('test_ipc_b', (e, data) => {
            console.log(new Date());
            console.log('ipc_data:', data);
            store.commit('RESIZE_WIN', data);
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
