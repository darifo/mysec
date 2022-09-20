<template>
  <el-container>
    <el-main class="cc"
             :style="{'height': height + 'px'}">
      <el-form ref="formRef"
               :model="UserForm"
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
          <el-button type="primary"
                     size="small"
                     @click="loginCheck">验证</el-button>
        </el-form-item>
      </el-form>
    </el-main>
  </el-container>
</template>

<script>
// import { findUser, delUser } from '@/repo/user';

export default {
    name: 'UserLogin',
    data() {
        return {
            UserForm: {},
            users: [],
        };
    },
    computed: {
        height() {
            return this.$store.state.doc_height;
        },
    },
    created() {},
    mounted() {
        // findUser({ name: 'darifo' }, 1, 5).then(value => {
        //     this.users = value;
        //     console.log(value);
        // });
        // console.log(this.$route.query);
    },
    methods: {
        loginCheck() {
            console.log(this.UserForm);
            // delUser();
            this.$router.push({
                path: '/list',
                query: {},
            });
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