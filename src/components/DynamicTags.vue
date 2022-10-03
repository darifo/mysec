<template>
  <el-tag v-for="tag in subTags" :key="tag" class="mx-1" closable :disable-transitions="false"
    @close="handleClose(tag)">
    {{ tag }}
  </el-tag>
  <el-input v-if="inputVisible" ref="InputRef" v-model="inputValue" class="ml-1 w-20" size="small"
    @keyup.enter="handleInputConfirm" @blur="handleInputConfirm" />
  <el-button v-else class="button-new-tag ml-1" size="small" @click="showInput">
    + 新建标签
  </el-button>
</template>

<script lang="ts" setup>
import { nextTick, ref } from "vue";
import { ElInput } from "element-plus";

const emit = defineEmits(["pushTags"])
const inputValue = ref("");
let subTags = ref<string[]>([]);
const inputVisible = ref(false);
const InputRef = ref<InstanceType<typeof ElInput>>();

const handleClose = (tag: string) => {
  subTags.value.splice(subTags.value.indexOf(tag), 1);
  emit("pushTags", subTags.value)
};

const showInput = () => {
  inputVisible.value = true;
  nextTick(() => {
    InputRef.value!.input!.focus();
  });
};

const handleInputConfirm = () => {
  if (inputValue.value) {
    subTags.value.push(inputValue.value);
  }
  inputVisible.value = false;
  inputValue.value = "";
  emit("pushTags", subTags.value)
};
</script>
