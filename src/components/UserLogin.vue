<script setup lang="ts">
import { computed, inject } from 'vue';
import { useRouter } from 'vue-router';
import { useStore } from 'vuex';

// sqlite3 DB类型
type DBT = {
  Database: any
}

const DB = inject("DB") as DBT

let users = {}

const Router = useRouter()

const store = useStore()

let height = computed({
  get(): number { return store.state.doc_height },
  set(newVal: number) { }
})

const UserForm = {
  password: ""
}

const loginButton = computed({
  get(): boolean { return store.state.app_info.is_init_root },
  set(newVal) { }
});
const setPwdButton = computed({
  get(): boolean { return !store.state.app_info.is_init_root },
  set(newVal) { }
});

const loginCheck = () => {
  const dbPath = store.state.app_info.db_path;
  // const DB = inject("$DB");
  const db = new DB.Database(dbPath);
  db.all("SELECT * FROM user where account = 'root' LIMIT 1", (err: string, row: any) => {
    users = row;
    alert(JSON.stringify(row));
    Router.push({
      name: "LIST",
      params: {}
    })
  });
}
const setRootPassword = () => {

}

</script>

<template>
  <el-container>
    <el-main class="cc"
             :style="{'height': height + 'px'}">
      <el-form :model="UserForm"
               :inline="true">
        <el-form-item label="密码"
                      prop="password"
                      :rules="[
                        { required: true, message: 'password is required' },
                      ]">
          <el-input v-model.number="UserForm.password"
                    type="password"
                    autocomplete="off" />
        </el-form-item>
        <el-form-item>
          <el-button v-if="loginButton"
                     type="primary"
                     size="small"
                     @click="loginCheck">验证</el-button>
          <el-button v-if="setPwdButton"
                     type="primary"
                     size="small"
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
