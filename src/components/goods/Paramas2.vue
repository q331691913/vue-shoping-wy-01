<template>
  <div>
    <!-- 面包屑 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品分类</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片 -->
    <el-card>
      <el-alert
        show-icon
        title="注意：只允许为第三级分类设置相关参数！"
        type="warning"
        :closable="false"
      ></el-alert>
      <el-row class="cat_opt">
        <el-col>
          <span>选择商品分类：</span>
          <!-- 选择商品分类的级联选择框 -->
          <el-cascader
            expand-trigger="hover"
            :options="catelist"
            :props="cateProps"
            v-model="selectedCateKeys"
            @change="handleChange"
          >
          </el-cascader>
        </el-col>
      </el-row>
      <!-- 表格 -->
      <!-- TAB标签页 -->
      <el-tabs v-model="activeName" @tab-click="handleTabClick">
        <el-tab-pane label="动态参数" name="many">
          <el-button
            type="primary"
            size="mini"
            :disabled="isBtnDisabled"
            @click="addDialogVisible = true"
            >添加参数</el-button
          >
          <!-- 动态参数表格 -->
          <el-table :data="manyTableData" border stripe>
            <!-- 索引列 -->
            <el-table-column type="index"></el-table-column>
            <el-table-column label="参数名称" prop="attr_name">
            </el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button
                  type="primary"
                  icon="el-icon-edit"
                  @click="showEditDialog(scope.row.attr_id)"
                  >编辑</el-button
                >
                <el-button type="danger" icon="el-icon-delete" @click="removaDialog(scope.row.attr_id)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
        <el-tab-pane label="配置管理" name="only">
          <el-button
            type="primary"
            size="mini"
            :disabled="isBtnDisabled"
            @click="addDialogVisible = true"
            >添加参数</el-button
          >
          <!-- 静态参数表格 -->
          <el-table :data="onlyTableData" border stripe>
            <!-- 索引列 -->
            <el-table-column type="index"></el-table-column>
            <el-table-column label="属性名称" prop="attr_name">
            </el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button
                  type="primary"
                  icon="el-icon-edit"
                  @click="showEditDialog(scope.row.attr_id)"
                  >编辑</el-button
                >
                <el-button type="danger" icon="el-icon-delete" @click="removaDialog(scope.row.attr_id)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>
    </el-card>
    <!-- 添加操作的对话框 -->
    <el-dialog
      title="添加"
      :visible.sync="addDialogVisible"
      width="40%"
      @close="addDialogClose"
    >
      <el-form
        :model="CateForm"
        :rules="addFormRules"
        ref="cateFormRef"
        label-width="100px"
      >
        <el-form-item :label="titleText" prop="attr_name">
          <el-input v-model="CateForm.attr_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addPramas">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 修改参数的对话框 -->
    <el-dialog
      title="修改"
      :visible.sync="editDialogVisible"
      width="40%"
      @close="editDialogClose"
    >
      <el-form
        :model="editCateForm"
        :rules="editFormRules"
        ref="editcateFormRef"
        label-width="100px"
      >
        <el-form-item :label="titleText" prop="attr_name">
          <el-input v-model="editCateForm.attr_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editPramas">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      catelist: [],
      cateProps: {
        value: "cat_id",
        label: "cat_name",
        children: "children",
      },
      selectedCateKeys: [],
      activeName: "many",
      manyTableData: [],
      onlyTableData: [],
      addDialogVisible: false,
      CateForm: {
        attr_name: "",
      },
      //添加验证
      addFormRules: {
        attr_name: [
          { required: true, message: "请输入活动名称", trigger: "blur" },
        ],
      },
      editCateForm: {
        attr_name: "",
      },
      editDialogVisible: false,
      //修改验证
      editFormRules: {
        attr_name: [
          { required: true, message: "请输入活动名称", trigger: "blur" },
        ],
      },
    };
  },
  created() {
    this.getParmasList();
  },
  methods: {
    // 获取商品数据
    async getParmasList() {
      const { data: res } = await this.$http.get("categories");
      if (res.meta.status !== 200) {
        return this.$message.error("获取商品分类失败！");
      }
      this.catelist = res.data;
    },
    // 证明选中的不是三级分类
    async getParamsData() {
      // console.log(this.selectedCateKeys);
      if (this.selectedCateKeys.length !== 3) {
        this.selectedCateKeys = [];
        this.manyTableData = [];
        this.onlyTableData = [];
        return;
      }
      // 证明选中的是三级分类
      // 根据所选分类的Id，和当前所处的面板，获取对应的参数
      const { data: res } = await this.$http.get(
        `categories/${this.cateId}/attributes`,
        {
          params: { sel: this.activeName },
        }
      );
console.log(res);
      if (res.meta.status !== 200) {
        return this.$message.error("获取参数列表失败！");
      }

      // res.data.forEach((item) => {
      //   item.attr_vals = item.attr_vals ? item.attr_vals.split(" ") : [];
      //   // 控制文本框的显示与隐藏
      //   item.inputVisible = false;
      //   // 文本框中输入的值
      //   item.inputValue = "";
      // });
      if (this.activeName === "many") {
        this.manyTableData = res.data;
      } else {
        this.onlyTableData = res.data;
      }
    },
    //级联变化触发他
    handleChange() {
      this.getParamsData();
    },

    // tab 页签点击事件的处理函数
    handleTabClick() {
      // console.log(this.activeName)
      this.getParamsData();
    },
    //监听添加对话框的关闭事件
    addDialogClose() {
      this.$refs.cateFormRef.resetFields();
    },
    //点击添加参数
    addPramas() {
      //表单验证
      this.$refs.cateFormRef.validate(async (valid) => {
        if (!valid) return;
        const { data: res } = await this.$http.post(
          `categories/${this.cateId}/attributes`,
          {
            attr_name: this.CateForm.attr_name,
            attr_sel: this.activeName,
          }
        );
        if (res.meta.status !== 201) return this.$message.error("添加参数失败");
        this.$message.success("添加参数成功！");
        this.addDialogVisible = false;
        this.getParamsData();
      });
    },
    //点击按钮修改对话框
    // showEditDialog() {
    //   this.editDialogVisible = true;
    // },
    async showEditDialog(attr_id) {
      // 查询当前参数的信息
      const { data: res } = await this.$http.get(
        `categories/${this.cateId}/attributes/${attr_id}`,
        {
          params: { attr_sel: this.activeName },
        }
      );

      if (res.meta.status !== 200) {
        return this.$message.error("获取参数信息失败！");
      }

      this.editCateForm = res.data;
      this.editDialogVisible = true;
    },
    // 监听重置表单
    editDialogClose() {
      this.$refs.editcateFormRef.resetFields();
    },
    //点击修改
    editPramas() {
      this.$refs.editcateFormRef.validate(async (valid) => {
        if (!valid) return;
        const { data: res } = await this.$http.put(
          `categories/${this.cateId}/attributes/${this.editCateForm.attr_id}`,
          {
            attr_name: this.editCateForm.attr_name,
            attr_sel: this.activeName,
          }
        );

        if (res.meta.status !== 200) {
          return this.$message.error("添加参数失败！");
        }

        this.$message.success("添加参数成功！");
        this.editDialogVisible = false;
        this.getParamsData();
      });
    },
 async   removaDialog(id){
   const confirmresult  = await  this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).catch(err=>err)
     if(confirmresult!=='confirm') return  this.$message.info('取消删除')
  const {data:res}= await  this.$http.delete(`categories/${this.cateId}/attributes/${id}`)
  if(res.meta.status!==200) return this.$message.error('删除失败')
  this.$message.success('删除参数成功！')
  this.getParamsData()
    }
  },
  computed: {
    isBtnDisabled() {
      if (this.selectedCateKeys.length !== 3) {
        return true;
      }
      return false;
    },
    //计算动态静态文本
    titleText() {
      if (this.activeName == "many") {
        return "动态参数";
      }
      return "静态参数";
    },
    cateId() {
      if (this.selectedCateKeys.length === 3) {
        return this.selectedCateKeys[2];
      }
      return null;
    },
  },
};
</script>

<style lang="less" scope>
</style>