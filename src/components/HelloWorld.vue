<template>
  <div class="cc"
       :style="{'height': height + 'px'}">

    <div>
      <h1>{{ msgStr }} </h1>
    </div>
    <div>
      <el-button type="success"
                 size="small"
                 @click="doLogin()">进入</el-button>
    </div>
  </div>
</template>

<script>
export default {
    name: 'HelloWorld',
    data() {
        return {
            msgStr: 'Welcome ! ',
            users: [],
        };
    },
    computed: {
        height() {
            return this.$store.state.doc_height;
        },
    },
    methods: {
        doLogin() {
            console.log(this.nowTime);
            this.$router.push({
                path: '/login',
                query: {
                    t: this.nowTime,
                },
            });
        },
    },
    mounted() {},
    created() {},
    beforeUnmount() {},
};
</script>

<style scoped>
h3 {
    margin: 40px 0 0;
}
ul {
    list-style-type: none;
    padding: 0;
}
li {
    display: inline-block;
    margin: 0 10px;
}
a {
    color: #42b983;
}

.cc {
    display: flex;
    justify-content: center; /* 弹性布局的左右居中对齐 */
    align-items: center; /*弹性布局的垂直居中对齐*/
    width: 100%;
    /* border: 1px solid red; */
}
</style>
