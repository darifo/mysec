<script setup lang="ts">
import { ElMessage } from 'element-plus';
import { computed, ref } from 'vue';
import { useStore } from 'vuex';
import tableData from '../data/sheetData'

let dialogFormVisible = ref(false)

const store = useStore()

let addForm = ref({
    name: "",
    password: "",
    account: "",
    tag: [],
    remark: ""
})
let search = ref("")
let options = ref([
    { value: 'test', label: '测试' },
    { value: 'prod', label: '生产' },
]);
let choose_type = ref("")

let height = computed({
    get(): number { return store.state.doc_height },
    set(newVal: number) { }
})

const handleCopyAccount = (index: number, account: string) => {
    ElMessage({
        message: 'handleCopyAccount: ' + account,
        type: 'success',
    });
};
const handleCopyPassword = (index: number, password: string) => {
    console.log(index, password);
    ElMessage({
        message: 'handleCopyPassword: ' + password,
        type: 'success',
    });
}
const handleCopy = (index: number, row: Object) => {
    console.log(index, row);
}
const handleShow = (index: number, row: Object) => {
    console.log(index, row);
};
const handleEdit = (index: number, row: Object) => {
    console.log(index, row);
}
const handleDelete = (index: number, row: Object) => {
    console.log(index, row);
}
const handleAdd = () => {
    console.log(addForm);
    dialogFormVisible.value = true;
}

</script>

<template>
    <div :style="{'height': height + 'px'}">
        <el-row>
            <el-col :span="12">
                <div class="grid-content"
                     style="float:left">
                    <el-select v-model="choose_type"
                               :clearable="true"
                               multiple
                               placeholder="选择标签">
                        <el-option v-for="item in options"
                                   :key="item.value"
                                   :label="item.label"
                                   :value="item.value" />
                    </el-select>
                </div>
            </el-col>
            <el-col :span="12">
                <div class="grid-content"
                     style="float:right">
                    <el-input placeholder="请输入名称|账号"
                              prefix-icon="el-icon-search"
                              v-model="search"
                              style="float:left">
                    </el-input>
                </div>
            </el-col>
        </el-row>

        <br />
        <el-row>
            <el-col :span="12">
                <div class="grid-content"
                     style="float:left">
                    <el-button type="primary"
                               @click="handleAdd">添加</el-button>
                </div>
            </el-col>
            <el-col :span="12">
                <div class="grid-content">&nbsp;
                </div>
            </el-col>
        </el-row>

        <br />

        <el-table :data="tableData"
                  style="width: 100%">
            <el-table-column label="ID"
                             prop="id"
                             width="60px" />
            <el-table-column label="名称"
                             prop="name" />
            <el-table-column label="账号"
                             prop="account">
                <template v-slot="scope">
                    <el-link @click="handleCopyAccount(scope.$index, scope.row.account);"
                             :underline="false"
                             style="color:red">{{scope.row.account}}</el-link>
                </template>

            </el-table-column>
            <el-table-column label="密码"
                             prop="password">
                <template v-slot="scope">
                    <el-button size="small"
                               link
                               type="success"
                               @click="handleCopyPassword(scope.$index, scope.row.password)">复制密码</el-button>
                </template>
            </el-table-column>

            <el-table-column label="地址"
                             prop="addr">
                <template v-slot="scope">
                    <el-tooltip class="box-item"
                                effect="dark"
                                placement="top"
                                :content="scope.row.addr">
                        <el-link :href="scope.row.addr"
                                 :underline="false"
                                 target="_blank"
                                 style="color:lightseagreen">跳转</el-link>
                    </el-tooltip>

                </template>
            </el-table-column>

            <el-table-column label="标签"
                             prop="tags">
                <template v-slot="scope">
                    <div class="name-wrapper">
                        <el-tag size="small"
                                v-for="(tag,index) in scope.row.tags"
                                :key="index"
                                :type="tag.type">{{ tag.content}}</el-tag>
                    </div>
                </template>
            </el-table-column>

            <el-table-column fixed="right"
                             label="操作">
                <template v-slot="scope">
                    <el-button size="small"
                               link
                               type="success"
                               @click="handleCopy(scope.$index, scope.row)">复制</el-button>
                    <el-button size="small"
                               link
                               type="primary"
                               @click="handleShow(scope.$index, scope.row)">详情</el-button>
                    <el-button size="small"
                               link
                               type="warning"
                               @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
                    <el-button size="small"
                               link
                               type="danger"
                               @click="handleDelete(scope.$index, scope.row)">删除</el-button>
                </template>
            </el-table-column>

        </el-table>

        <br />

        <el-pagination background
                       layout="prev, pager, next"
                       :total="1000"
                       :pager-count="5" />
        <br />

        <el-dialog v-model="dialogFormVisible"
                   :close-on-click-modal=false
                   title="添加信息">
            <el-form :model="addForm">
                <el-form-item label="名称">
                    <el-input v-model="addForm.name"
                              autocomplete="off" />
                </el-form-item>
                <el-form-item label="账号">
                    <el-input v-model="addForm.account"
                              autocomplete="off" />
                </el-form-item>
                <el-form-item label="密码">
                    <el-input v-model="addForm.password"
                              type="password"
                              autocomplete="off" />
                </el-form-item>
                <el-form-item label="标签">
                    <el-input v-model="addForm.tag"
                              autocomplete="off"
                              placeholder="多个英文逗号分隔" />
                </el-form-item>
                <el-form-item label="备注">
                    <el-input v-model="addForm.remark"
                              type="textarea"
                              autocomplete="off" />
                </el-form-item>
            </el-form>
            <template #footer>
                <span class="dialog-footer">
                    <el-button @click="dialogFormVisible = false">取消</el-button>
                    <el-button type="primary"
                               @click="dialogFormVisible = false">保存</el-button>
                </span>
            </template>
        </el-dialog>

    </div>
</template>

<style scoped>

</style>