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

<script>
// import { inject } from '@vue/runtime-core';
// import DB from '@/db';
// import { useStore } from 'vuex';

export default {
    name: 'UserLogin',
    data() {
        return {
            db: null,
            UserForm: {},
            users: [],
        };
    },
    computed: {
        height() {
            return this.$store.state.doc_height;
        },
        loginButton() {
            return this.$store.state.app_info.is_init_root;
        },
        setPwdButton() {
            return !this.$store.state.app_info.is_init_root;
        },
    },
    created() {},
    mounted() {
        console.log(this.$route.query);
    },
    methods: {
        loginCheck() {
            const dbPath = this.$store.state.app_info.db_path;
            const db = new this.$DB.Database(dbPath);
            db.all("SELECT * FROM user where account = 'root' LIMIT 1", (err, row) => {
                this.users = row;
                console.log(row);
            });
            console.log(this.UserForm);
            // delUser();
            // this.$router.push({
            //     path: '/list',
            //     query: {},
            // });
        },
        setRootPassword() {
            const dbPath = this.$store.state.app_info.db_path;
            const db = new this.$DB.Database(dbPath);
            db.run('UPDATE user SET account = ? where account = ?', this.UserForm.password, 'root');
            alert('设置密码成功！');
        },
    },
};
</script>

<style scoped>
.cc {
    display: flex;
    justify-content: center; /* 弹性布局的左右居中对齐 */
    align-items: center; /*弹性布局的垂直居中对齐*/
    width: 100%;
    /* border: 1px solid red; */
}
</style>