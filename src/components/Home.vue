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
    <el-aside :width="isCollaspe?'64px':'200px'">
      <div class="toggle-button" @click="toggleCollapse">|||</div>
          <el-menu  class="el-menu-vertical-demo" background-color="#313743" text-color="#fff" active-text-color="#337BD0" unique-opened :collapse="isCollaspe" :collapse-transition="false" router :default-active="activePath" > 
      <!-- 一级 -->
      <el-submenu :index="'/'+item.path " v-for='item in menuList' :key="item.id">
        <!-- 一级的模板 -->
        <template slot="title">
          <!-- 图标 -->
          <i class="icon-pd" :class="iconObj[item.id]"></i>
          <!-- 文本 -->
          <span>{{item.authName}}</span>
        </template>
    <!-- 二级 -->
        <el-menu-item :index="'/'+subItem.path" v-for="subItem in item.children"  :key="subItem.id" @click="savaNavState('/'+subItem.path)" >
             <i class="el-icon-menu"></i>
          <!-- 文本 -->
          <span>{{subItem.authName}}</span>
        </el-menu-item>
     
      </el-submenu>
      
    </el-menu>
    </el-aside>
    <!-- 右侧 -->
    <el-main>
    <router-view></router-view>
    </el-main>

  </el-container>
</el-container>
</template>

<script>
export default {
  data() {
    return {
      menuList:[],
      iconObj:{
        '125':'iconfont icon-user',
        '103':'iconfont icon-tijikongjian',
        '101':'iconfont icon-shangpin',
        '102':'iconfont icon-danju',
        '145':'iconfont icon-baobiao'
      },
      isCollaspe:false,
      activePath:''
    }
  },  
  created() {
    this.getMenuList()
    this.activePath=window.sessionStorage.getItem('activePath')
  },
  methods: {
    logout() {
      window.sessionStorage.clear();
      this.$router.push("/login");
    },
    async getMenuList(){
      const {data:res} =await this.$http.get('menus')
      if(res.meta.status!==200) return this.$message.error('res.meta.msg')
      this.menuList = res.data
    },
     toggleCollapse(){
    this.isCollaspe=!this.isCollaspe
  },
 savaNavState(activePath){
    window.sessionStorage.setItem('activePath',activePath)
    this.activePath=activePath
  }
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
    .el-menu {
    border-right: none;
  }
}
.el-main{
  background-color: #E9EDF1;
}
.icon-pd{
  padding-right: 10px;
}
.toggle-button{
  background-color: #495065;
  font-size: 10px;
  line-height: 24px;
  color: #fff;
  text-align: center;
  letter-spacing: 0.4em;
  cursor: pointer;
}

</style>