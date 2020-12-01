<template>
  <div>
      <!-- 面包屑 -->
 <el-breadcrumb separator-class="el-icon-arrow-right">
    <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
    <el-breadcrumb-item>权限管理</el-breadcrumb-item>
    <el-breadcrumb-item>角色列表</el-breadcrumb-item>
</el-breadcrumb>
<!-- 卡片区域 -->
<el-card>
  <el-button type="primary">添加角色</el-button>
   <el-table :data="roleslist" border stripe  >
     <!-- 展开列 -->
     <el-table-column type="expand">
       <template slot-scope="scope">
         <el-row  v-for="(item1,i1) in scope.row.children" :key="item1.id" :class="['bdbottmn',i1===0?'bdtop':'','vcenter']">
            <!-- 渲染一级 -->
            <el-col :span="5">
              <el-tag closable>{{item1.authName}}</el-tag>
              <i class="el-icon-caret-right"></i>
            </el-col>
            <!-- 渲染二级 -->
            <el-col :span="19">
              <!-- 渲染嵌套二级权限 -->
                  <el-row v-for="(item2,i2) in item1.children" :key="item2.id" :class="[i2===0?'':'bdtop','vcenter']">
                     <el-col :span="6">
                       <el-tag type="success" closable>{{item2.authName}}</el-tag>
                       <i class="el-icon-caret-right"></i>
                     </el-col>
                     <el-col :span="18">
                       <el-tag v-for="(item3,i3) in item2.children" :key="item3.id" type="warning" closable @close="removeRoleById(scope.row,item3.id)">
                         {{item3.authName}}
                       </el-tag>
                     </el-col>
                  </el-row>
            </el-col>
          </el-row>
       </template>
     </el-table-column>
    <el-table-column type="index" label="#"></el-table-column>
    <el-table-column label="角色名称" prop="roleName"></el-table-column>
    <el-table-column label="角色描述" prop="roleDesc"></el-table-column>
    <el-table-column label="操作" >
      <template slot-scope="scope">
                <!-- 修改按钮 -->   
            <el-tooltip  effect="light" content="修改" placement="top" :enterable='false' >
                <el-button type="primary" icon="el-icon-edit" circle size="mini" ></el-button>
            </el-tooltip>
                <!-- 删除按钮 -->
            <el-tooltip  effect="dark" content="删除" placement="top" :enterable='false'>
              <el-button type="danger" icon="el-icon-delete" circle size="mini" ></el-button>
            </el-tooltip>
                <!-- 设置按钮 -->
            <el-tooltip  effect="dark" content="分配角色" placement="top" :enterable='false'>
              <el-button type="warning" icon="el-icon-setting" circle size="mini" @click="showSetRightDialog(scope.row)">分配权限</el-button>
            </el-tooltip>
      </template>
    </el-table-column>

</el-table>
</el-card>
<!-- 修改分配权限 -->

<el-dialog
  title="分配权限"
  :visible.sync="setRightDialogVisible"
  width="40%"
  @close="setRightDialogClosed()"
  >
  <!-- 树形控件 -->
  <el-tree :data="rightslist" :props="treeProps" show-checkbox node-key='id' default-expand-all :default-checked-keys="defkeys" ref="treeRef">
    
  </el-tree>
  <span slot="footer" class="dialog-footer">
    <el-button @click="setRightDialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="allotRights">确 定</el-button>
  </span>
</el-dialog>
  </div>
</template>

<script>
export default {
data() {
  return {
    roleslist:[],
    // 控制分配权限的显示和隐藏
    setRightDialogVisible:false,
    //权限数据
    rightslist:[],
    // 树形控件属性绑定对象
    treeProps:{
      label:'authName',
      children:'children'
    },
    //默认勾选id
    defkeys:[],
    //当前即将分配权限的id
    roleId:''

  }
},
created() {
  this.getRoleList()
},
methods: {
  async getRoleList(){
    const {data:res} = await this.$http.get('roles')
    if(res.meta.status!==200) return this.$message.console.error('获取信息失败')
    this.roleslist =res.data
  },
  //根据id删除对应的权限
 async removeRoleById(role,rightId){
      //弹框提示
      const confirmResult = await this.$confirm(
        '此操作将永久删除该用户, 是否继续?',
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      ).catch(err=>err)
      if(confirmResult!=='confirm'){
        return this.$message.info('取消删除')
      }
  const {data:res} = await this.$http.delete(`roles/${role.id}/rights/${rightId}`)
      if(res.meta.status!==200) return this.$message.error('删除权限失败')
      this.$message.success('删除成功')
      this.getRoleList()
  },
  //展示分配文件
 async showSetRightDialog(role){
   this.roleId=role.id
    //获取所有权限的数据
      const {data:res} = await this.$http.get('rights/tree')
      if(res.meta.status!==200) return this.$message.error('获取数据失败')
      this.rightslist=res.data
      //递归获取三级节点的id
      this.getLeafKeys(role,this.defkeys)
      this.setRightDialogVisible=true
  },
  //定义一个递归的函数
  getLeafKeys(node,arr){
if(!node.children){
  return arr.push(node.id)
}
node.children.forEach(item=>this.getLeafKeys(item,arr))
  },
  //监听
  setRightDialogClosed(){
this.defkeys=[]
  },
  //点击为角色分配权限
 async allotRights(){
    const keys=[
      ...this.$refs.treeRef.getCheckedKeys(),
      ...this.$refs.treeRef.getHalfCheckedKeys()
    ]
    const idStr =keys.join(',')
  const {data:res}= await this.$http.post(`roles/${this.roleId}/rights`,{rids:idStr})
    if(res.meta.status!==200){
      return this.$message.error('分配权限失败!')
    }
      this.$message.success('分配权限成功')
      this.getRoleList()
      this.setRightDialogVisible = false
  }
},  


}
</script>

<style lang="less" scope>
.el-tag{
  // display: block !important;
margin: 7px;
}
.bdbottmn{
  border-bottom: 1px solid #eee;
}
.bdtop{
  border-top: 1px solid #eee;;
}
.vcenter{
  display: flex;
  align-items: center;
}
</style>