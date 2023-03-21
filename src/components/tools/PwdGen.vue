<script setup lang="ts">

import { ElMessage } from "element-plus";
import { ref, inject } from 'vue';
import Tools from '../../tools';

const main = inject("$main") as any;
const pwdSize = ref(6);
const pwdGenRule = ref("r1");
const pwdStr = ref("待生成...");

const pwdGenRuleOptions = [
  { value: "r1", label: "纯数字" },
  { value: "r2", label: "纯字母" },
  { value: "r3", label: "数字+小写字母" },
  { value: "r4", label: "数字+大写字母" },
  { value: "r5", label: "数字+大小写字母" },
  { value: "r6", label: "数字+大小写字母+特殊字符" },
]
// 生成密码按钮点击
const genPwdCode = () => {
  console.log(pwdGenRule.value);
  if (pwdGenRule.value == "r1") {
    pwdStr.value = Tools.makeStringInNum(pwdSize.value);
  }
  if (pwdGenRule.value == "r2") {
    pwdStr.value = Tools.makeStringInChar(pwdSize.value);
  }
  if (pwdGenRule.value == "r3") {
    pwdStr.value = Tools.makeStringInNumAndCharLower(pwdSize.value);
  }
  if (pwdGenRule.value == "r4") {
    pwdStr.value = Tools.makeStringInNumAndCharUpper(pwdSize.value);
  }
  if (pwdGenRule.value == "r5") {
    pwdStr.value = Tools.makeStringInNumAndChar(pwdSize.value);
  }
  if (pwdGenRule.value == "r6") {
    pwdStr.value = Tools.makeStringInNumAndCharAll(pwdSize.value);
  }
}

// 复制生成的密码
const copyPwdStr = () => {
  main.clipboard.writeText(pwdStr.value, 'selection')
  ElMessage({
    message: "复制成功！ ",
    type: "success",
  });
}
</script>

<template>
  <div>
    设置密码位数：
    <el-input-number v-model="pwdSize" :min="6" :max="128" />
    <br>
    设置生成规则：
    <el-select v-model="pwdGenRule" placeholder="选择">
      <el-option v-for="item in pwdGenRuleOptions" :key="item.value" :label="item.label" :value="item.value" />
    </el-select>
    <br>
    <el-button type="success" @click="genPwdCode">立即生成</el-button>
    <br>
    <el-link type="danger" :underline="false" style="color:red" @click="copyPwdStr">{{ pwdStr }}</el-link>
  </div>
</template>