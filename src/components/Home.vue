<template>

<el-container class="home-container">
  <!-- 头部区域 -->
  <el-header>
   <div>
     <img src="../assets/heima.png" alt="">
      <span>电商后台管理系统</span>
   </div>
   
  <el-button type="info" @click="logout">退出</el-button>
  </el-header>
  <!-- 页面主题区域 -->
  <el-container>
    <!-- 侧边栏 -->
    <el-aside width="200px">
          <el-menu
      default-active="2"
      class="el-menu-vertical-demo"
      background-color="#313743"
      text-color="#fff"
      active-text-color="#ffd04b">
      <!-- 一级 -->
      <el-submenu index="1">
        <!-- 一级的模板 -->
        <template slot="title">
          <!-- 图标 -->
          <i class="el-icon-location"></i>
          <!-- 文本 -->
          <span>导航一</span>
        </template>
    <!-- 二级 -->
        <el-menu-item index="1-4-1">
             <i class="el-icon-location"></i>
          <!-- 文本 -->
          <span>导航一</span>
        </el-menu-item>
     
      </el-submenu>
      
    </el-menu>
    </el-aside>
    <!-- 右侧 -->
    <el-main>
      Main
    </el-main>

  </el-container>
</el-container>
</template>

<script>
export default {
  methods: {
    logout() {
      window.sessionStorage.clear();
      this.$router.push("/login");
    },
  },
}
</script>

<style lang='less' scoped>
.home-container{
  height: 100%;
}
.el-header{
  background-color: #383C3D;
  display: flex;
  //左右贴边对齐
  justify-content:space-between;
  padding-left: 0;
  align-items: center;
  color: #fff;
  font-size: 20px;
  >div{
    display: flex;
    align-items: center;
    span{
      margin-left: 15px;
    }
  }
}
.el-aside{
  background-color: #313743;
}
.el-main{
  background-color: #E9EDF1;
}
</style>