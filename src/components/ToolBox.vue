<script setup lang="ts">

import type { TabsPaneContext } from 'element-plus'
import { ref, toRefs } from 'vue';
import PwdGen from './tools/PwdGen.vue'
import EncryDecry from './tools/EncryDecry.vue'
import WebSocket from './tools/WebSocket.vue'

const props = defineProps(['boxVisible'])
const emit = defineEmits(['closeMe'])
let { boxVisible } = toRefs(props)
const activeName = ref('pwd_gen');
const handleClickToolTab = (tab: TabsPaneContext, event: Event) => { }
// 返回按钮 通知父组件关闭当前组件
const handleCancel = () => { emit("closeMe", false) }

</script>

<style scoped>
.tab-tool {
  text-align: left;
  line-height: 50px;
}
</style>

<template>
  <!-- 工具窗口 -->
  <el-dialog v-model="boxVisible" :fullscreen="true" :show-close=false :close-on-click-modal=false title="工具箱">
    <el-tabs v-model="activeName" @tab-click="handleClickToolTab">
      <el-tab-pane label="密码生成器" name="pwd_gen" class="tab-tool">
        <PwdGen></PwdGen>
      </el-tab-pane>
      <el-tab-pane label="加密解密" name="encry_decry" class="tab-tool">
        <EncryDecry></EncryDecry>
      </el-tab-pane>
      <el-tab-pane label="WebSocket" name="web_socket" class="tab-tool">
        <WebSocket></WebSocket>
      </el-tab-pane>
      <el-tab-pane label="二维码生成" name="qr_code" class="tab-tool">
      </el-tab-pane>
      <el-tab-pane label="字数统计" name="byte_count" class="tab-tool">
      </el-tab-pane>
    </el-tabs>
    <el-button @click="handleCancel">返回</el-button>
  </el-dialog>
</template>