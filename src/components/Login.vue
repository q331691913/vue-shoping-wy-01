<template>
<div class="login_container">
  <div class="login_box">
    <!-- 头像区域 -->
    <div class="avatar_box">
      <img src="../assets/X1.jpeg" alt="">
    </div>
    <!-- 登陆表单区域 -->
<el-form ref="loginFormRef" :model="loginForm" label-width="0px" class="login_form" :rules="loginFormRules">
    <!-- 用户名 -->
  <el-form-item prop="username" >
    <el-input prefix-icon="iconfont icon-user" v-model="loginForm.username"  ></el-input>
  </el-form-item>
  <!-- 密码 -->
   <el-form-item prop="password">
    <el-input prefix-icon="iconfont icon-3702mima" v-model="loginForm.password" type="password" ></el-input>
  </el-form-item>
  <!-- 按钮 -->
  <el-form-item class="btns">
    <el-button type="primary" @click="login">登陆</el-button>
    <el-button type="info" @click="resetLoginForm">重置</el-button>
  </el-form-item>
  </el-form>
  </div>
</div>
</template>
<script>
export default {
  data(){
    return{
      //这是登陆表单的数据绑定对象
      loginForm:{
           username:'admin',
           password:'123456'
      },
      loginFormRules:{
        //验证用户名是否合法
        username:[  
          { required: true, message: '请输入登陆名称', trigger: 'blur' }, 
          { min: 3, max: 10, message: '长度在 3 到 10个字符', trigger: 'blur' }
          ],
        //验证密码是否合法
        password:[
          { required: true, message: '请输入登陆密码', trigger: 'blur' }, 
          { min: 6, max: 15, message: '长度在 6 到 15个字符', trigger: 'blur' }
          ]
      }
    }
  },
  methods: {
    resetLoginForm(){
      this.$refs.loginFormRef.resetFields()
    },
    login(){
      this.$refs.loginFormRef.validate(async vali=>{
        // console.log(vali);
        if(!vali) return 
  const {data:res} = await  this.$http.post('login',this.loginForm)
  // console.log(this);
  // console.log(res);
  if(res.meta.status !==200) return this.$message.error('登陆失败');
  this.$message.success('登陆成功');
  window.sessionStorage.setItem('token',res.data.token)
  this.$router.push('/home')
      })
    }
  },
}
</script>
<style lang="less" scoped>
.login_container{
  background:url(../assets/x4.jpg) no-repeat;
  background-size: cover;
  height: 100%;
}
.login_box{
  position:relative ;
  top: 50%;
  left: 50%;
  transform: translate(-50%,-50%);
  width: 450px;
  height: 300px;
  // background-color: #fff;
  background: url(../assets/小猫猫.jpg) no-repeat;
  background-size: cover;
  border-radius: 5px;
  border-radius: 3px;
  .avatar_box{
    position: absolute;
    left: 50%;
    transform: translate(-50%,-50%);
    height: 130px;
    width: 130px;
    border: 1px solid #eee ;
    border-radius: 50%;
    padding: 10px;
    box-shadow: 0 0 10px #ddd;
    background-color: #fff;
    img{
      width: 100%;
      height: 100%;
      border-radius: 50%;
      background-color: #eee;
    }
  }
  .login_form{
    position: absolute;
    bottom: 0;
    width: 100%;
    padding: 0 20px;
  }
  .btns{
    display: flex;
    justify-content: flex-end ;
  }
}
</style>