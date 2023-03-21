<script setup lang="ts">
import type { TabsPaneContext } from 'element-plus'
import { ref } from 'vue'

const input1 = ref('')
const textarea1 = ref('')
const textarea2 = ref('')

const checkList = ref(['selected', ''])
const checkList1 = ref(['selected', ''])

const activeName = ref('symmetry');
const handleClickToolTab = (tab: TabsPaneContext, event: Event) => { }

</script>

<template>
  <el-tabs v-model="activeName" @tab-click="handleClickToolTab">
    <el-tab-pane label="对称加解密" name="symmetry" class="tab-tool">
      <div class="mt-4">
        <el-checkbox-group v-model="checkList">
          <el-checkbox label="AES" />
          <el-checkbox label="DES" />
          <el-checkbox label="RC4" />
          <el-checkbox label="Rabbit" />
          <el-checkbox label="TripleDes(3DES)" />
        </el-checkbox-group>
        <el-input v-model="textarea1" type="textarea" autosize placeholder="请输入明文" />
        <div style="margin: 20px 0" />
        <el-input v-model="input1" type="textarea" autosize placeholder="请输入秘钥" />
        <div style="margin: 20px 0" />
        <el-input v-model="textarea2" type="textarea" autosize placeholder="请输入密文" />
        <div style="margin: 20px 0" />
      </div>
    </el-tab-pane>

    <el-tab-pane label="非对称加解密" name="asymmetric" class="tab-tool">
      <el-checkbox-group v-model="checkList">
        <el-checkbox label="RSA" />
        <el-checkbox label="ECC" />
      </el-checkbox-group>

      <el-input v-model="textarea1" type="textarea" autosize placeholder="输入公钥" />
      <div style="margin: 20px 0" />
      <el-input v-model="textarea1" type="textarea" autosize placeholder="输入私钥" />
      <div style="margin: 20px 0" />
      <el-input v-model="textarea1" type="textarea" autosize placeholder="明文" />
      <div style="margin: 20px 0" />
      <el-input v-model="textarea1" type="textarea" autosize placeholder="密文" />
    </el-tab-pane>

    <el-tab-pane label="哈希加密" name="hash_gen" class="tab-tool">
      <div class="mt-4">
        <el-checkbox-group v-model="checkList1">
          <el-checkbox label="MD5(16位小写)" />
          <el-checkbox label="MD5(16位大写)" />
          <el-checkbox label="MD5(32位小写)" />
          <el-checkbox label="MD5(32位大写)" />
          <el-checkbox label="SHA-1" />
          <el-checkbox label="SHA-2(256)" />
          <el-checkbox label="SHA-2(512)" />
          <el-checkbox label="SHA-3(64)" />
          <el-checkbox label="SHA-3(224)" />
          <el-checkbox label="SHA-3(256)" />
          <el-checkbox label="SHA-3(384)" />
          <el-checkbox label="SHA-3(512)" />
        </el-checkbox-group>
        <div style="margin: 20px 0" />
        <el-input v-model="textarea1" type="textarea" autosize placeholder="请输入明文" />
        <div style="margin: 20px 0" />
        <el-input v-model="textarea2" type="textarea" autosize placeholder="请输入密文" />
      </div>

    </el-tab-pane>

    <el-tab-pane label="BASE64加解密" name="base64_gen" class="tab-tool">
      <div style="margin: 20px 0" />
      <el-input v-model="textarea1" type="textarea" autosize placeholder="请输入明文" />
      <div style="margin: 20px 0" />
      <el-input v-model="textarea2" type="textarea" autosize placeholder="请输入密文" />
    </el-tab-pane>

    <el-tab-pane label="HMAC加解密" name="hmac_gen" class="tab-tool">
      <el-checkbox-group v-model="checkList1">
          <el-checkbox label="HMAC-MD5" />
          <el-checkbox label="HMAC-SHA-1" />
          <el-checkbox label="HMAC-SHA-224" />
          <el-checkbox label="HMAC-SHA-256" />
          <el-checkbox label="HMAC-SHA-384" />
          <el-checkbox label="HMAC-SHA-512" />
        </el-checkbox-group>
      <div style="margin: 20px 0" />
      <el-input v-model="textarea1" type="textarea" autosize placeholder="请输入明文" />
      <div style="margin: 20px 0" />
      <el-input v-model="textarea1" type="textarea" autosize placeholder="输入私钥" />
      <div style="margin: 20px 0" />
      <el-input v-model="textarea2" type="textarea" autosize placeholder="请输入密文" />
    </el-tab-pane>

  </el-tabs>
</template>