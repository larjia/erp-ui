<template>
    <div class='app-container'>
      <el-form :inline='true'>
        <el-form-item label="名称">
          <el-input
            v-model='queryParams.name'
            clearable
            size='mini'
            @keyup.enter.native='handleQuery'
          />
        </el-form-item>
        <el-form-item label="编号">
          <el-input
            v-model='queryParams.number'
            clearable
            size='mini'
            @keyup.enter.native='handleQuery'
          />
        </el-form-item>
        <el-form-item>
          <el-button
            class="filter-item"
            type='primary'
            icon="el-icon-search"
            size="mini"
            @click="handleQuery"
          >搜索</el-button>
          <el-button
            class="filter-item"
            type='primary'
            icon="el-icon-plus"
            size="mini"
            @click="handleAdd"
          >新增</el-button>
        </el-form-item>
      </el-form>

      <el-table
        v-loading='loading'
        :data='typeList'
        row-key='id'
        default-expand-all
        :tree-props="{children: 'children', hasChildren: 'hasChildren'}"
        border
        size='mini'
      >
        <!-- <el-table-column prop="id" hidden></el-table-column> -->
        <el-table-column prop="name" label="名称"></el-table-column>
        <el-table-column prop="number" label="编码"></el-table-column>
        <el-table-column prop="orderNum" label="排序"></el-table-column>
        <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
          <template slot-scope="scope">
            <el-button
              size="mini"
              type="text"
              icon="el-icon-edit"
              @click="handleUpdate(scope.row)"
            >修改</el-button>
            <el-button
              size="mini"
              type="text"
              icon="el-icon-plus"
              @click="handleAdd(scope.row)"
            >新增</el-button>
            <el-button
              size="mini"
              type="text"
              icon="el-icon-delete"
              @click="handleDelete(scope.row)"
            >删除</el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 添加或修改部门对话框 -->
      <el-dialog :title="title" :visible.sync="open" width="600px">
        <el-form ref="form" :model="form" :rules="rules" label-width="80px">
          <el-row>
            <!-- <el-col :span="24" v-if="form.parentId !== 0"> -->
            <el-col :span="24">
              <el-form-item label="上级分类" prop="parentId">
                <treeselect v-model="form.parentId" :options="typeOptions" :normalizer="normalizer" />
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item label="编码" prop="number">
                <el-input v-model="form.number" />
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item label="名称" prop="name">
                <el-input v-model="form.name" />
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item label="显示排序" prop="orderNum">
                <el-input v-model="form.orderNum" />
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button type="primary" @click="submitForm">确定</el-button>
          <el-button @click="cancel">取消</el-button>
        </div>
      </el-dialog>
    </div>
</template>

<script>
import
{
  listPartType,
  addPartType,
  getPartTypeById,
  updatePartType,
  deletePartTypeById
}
from '@/api/masterdata/parttype'
import Treeselect from "@riophae/vue-treeselect";
import "@riophae/vue-treeselect/dist/vue-treeselect.css";

export default {
  name: 'PartType',
  components: { Treeselect },
  data () {
    return {
      // 遮罩层
      loading: true,
      // 表格树数据
      typeList: [],
      // 类别树选项 - 用户新增-修改下拉框树结构选项
      typeOptions: [],
      // 弹出层标题
      title: '',
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        number: undefined,
        name: undefined
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        number: [
          { required: true, message: '编码不能为空', trigger: 'blur' }
        ],
        name: [
          { required: true, message: '名称不能为空', trigger: 'blur' }
        ],
        orderNum: [
          { required: true, message: '显示排序不能为空', trigger: 'blur' }
        ]
      }
    }
  },
  created () {
    this.getList()
  },
  methods: {
    /** 查询产品类别列表 */
    getList() {
      this.loading = true
      listPartType(this.queryParams).then(response => {
        this.typeList = this.handleTree(response.data, 'id')
        this.loading = false
      })
    },
    /** 搜索 */
    handleQuery () {
      this.getList()
    },
    /** 表单重置 */
    reset () {
      this.form = {
        id: undefined,
        parentId: undefined,
        number: undefined,
        name: undefined,
        orderNum: undefined
      }
      this.resetForm('form')
    },
    /** 新增按钮操作 */
    handleAdd (row) {
      this.reset()
      this.getTreeselect()
      if (row != undefined) {
        this.form.parentId = row.id
      }
      this.open = true
      this.title = '新增物料类别'
    },
    /** 修改按钮操作 */
    handleUpdate (row) {
      this.reset()
      this.getTreeselect()
      getPartTypeById(row.id).then(response => {
        this.form = response.data
        if (this.form.parentId === 0) {
          this.form.parentId = undefined
        }
        this.open = true
        this.title = '修改物料类别'
      })
    },
    /** 提交按钮操作 */
    submitForm () {
      this.$refs['form'].validate(valid => {
        if (valid) {
          if (this.form.id != undefined) {
            updatePartType(this.form).then(response => {
              if (response.code === 200) {
                this.msgSuccess('修改成功')
                this.open = false
                this.getList()
              } else {
                this.msgError(response.msg)
              }
            })
          } else {
            addPartType(this.form).then(response => {
              if (response.code === 200) {
                this.msgSuccess('新增成功')
                this.open = false
                this.getList()
              } else {
                this.msgError(response.msg)
              }
            })
          }
        }
      })
    },
    /** 删除按钮操作 */
    handleDelete (row) {
      this.$confirm('是否确定删除名称为"' + row.name + '"的数据项?', '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        return deletePartTypeById(row.id)
      }).then(() => {
        this.getList()
        this.msgSuccess('删除成功')
      }).catch(function () {})
    },
    /** 取消按钮 */
    cancel () {
      this.open = false
      this.reset()
    },
    /** 查询类别下拉树结构 */
    getTreeselect () {
      listPartType().then(response => {
        this.typeOptions = this.handleTree(response.data, 'id')
      })
    },
    /** 转换类别数据结构 */
    normalizer (node) {
      if (node.children && !node.children.length) {
        delete node.children
      }

      return {
        id: node.id,
        label: node.name,
        children: node.children
      }
    }
  }
}
</script>

<style scoped>
.app-container ::v-deep .el-dialog__body {
  padding: 20px 25px 0 25px;
}

.app-container ::v-deep .el-dialog__header {
  padding: 15px 25px 10px 25px;
  background-color: #eee;
}

.app-container ::v-deep .el-dialog__headerbtn {
  top: 15px;
}

.app-container ::v-deep .el-dialog__footer {
  /* padding-left: 25px;
  padding-right: 25px; */
  text-align: center;
}
</style>
