<template>
    <div class='app-container'>
      <el-form :model='queryParams' ref='queryForm' :inline='true' label-width='68px' size='small'>
        <el-form-item label='编码' prop='number'>
          <el-input
            v-model='queryParams.number'
            clearable
            size='small'
            @keyup.enter.native='handleQuery'
          />
        </el-form-item>
        <el-form-item label='名称' prop='name'>
          <el-input
            v-model='queryParams.name'
            clearable
            size='small'
            @keyup.enter.native='handleQuery'
          />
        </el-form-item>
        <el-form-item>
          <el-button type='primary' icon='el-icon-search' size='mini' @click='handleQuery'>搜索</el-button>
          <el-button icon='el-icon-refresh' size='mini' @click="resetQuery">重置</el-button>
        </el-form-item>
      </el-form>

      <el-row :gutter="10" class='mb8'>
        <el-col :span="1.5">
          <el-button
            type='primary'
            icon='el-icon-plus'
            size='mini'
            @click='handleAdd'
          >新增</el-button>
        </el-col>
        <el-col :span="1.5">
          <el-button
            type='success'
            icon='el-icon-edit'
            size='mini'
            :disabled="single"
            @click='handleUpdate'
          >修改</el-button>
        </el-col>
        <el-col :span="1.5">
          <el-button
            type='danger'
            icon='el-icon-delete'
            size='mini'
            :disabled="multiple"
            @click='handleDelete'
          >删除</el-button>
        </el-col>
      </el-row>

      <el-table v-loading='loading' :data='uomList' @selection-change='handleSelectionChange' border size='mini'>
        <el-table-column type='selection' width='55' align='center' />
        <el-table-column label='单位编码' align='center' prop='number' />
        <el-table-column label='单位名称' align='center' prop='name' />
        <el-table-column label='操作' align='center' class-name='small-padding fixed-width'>
          <template slot-scope='scope'>
            <el-button
              size='mini'
              type='text'
              icon='el-icon-edit'
              @click='handleUpdate(scope.row)'
            >修改</el-button>
            <el-button
              size='mini'
              type='text'
              icon='el-icon-delete'
              @click='handleDelete(scope.row)'
            >删除</el-button>
          </template>
        </el-table-column>
      </el-table>

      <pagination
        v-show='total > 0'
        :total='total'
        :page.sync='queryParams.pageNum'
        :limit.sync='queryParams.pageSize'
        @pagination='getList'
      />

      <!-- 新增或修改计量单位对话框 -->
      <el-dialog :title='title' :visible.sync='open' width='500px' :close-on-click-modal="false" :close-on-press-escape="false" >
        <el-form ref='form' :model='form' :rules='rules' label-width='80px'>
          <el-form-item label='单位编码' prop='number'>
            <el-input v-model='form.number' />
          </el-form-item>
          <el-form-item label='单位名称' prop='name'>
            <el-input v-model='form.name' />
          </el-form-item>
        </el-form>
        <div slot='footer' class='dialog-footer'>
          <el-button type='primary' @click="submit">确定</el-button>
          <el-button @click="cancel">取消</el-button>
        </div>
      </el-dialog>
    </div>
</template>

<script>
import {
  listUOM,
  getUOMById,
  addUOM,
  updateUOM,
  deleteUOMByIds
} from '@/api/masterdata/uom'

export default {
  name: 'UOM',
  data () {
    return {
       // 遮罩层
      loading: true,
      // 选中数组
      ids: [],
      // 非单个禁用
      single: true,
      // 非多个禁用
      multiple: true,
      // 总条数
      total: 0,
      // 计量单位表格数据
      uomList: [],
      // 弹出层标题
      title: '',
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
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
        ]
      }
    }
  },
  created () {
    this.getList()
  },
  methods: {
    /** 查询列表 */
    getList () {
      this.loading = true
      listUOM(this.queryParams).then(response => {
        this.uomList = response.rows
        this.total = response.total
        this.loading = false
      })
    },
    /** 搜索按钮操作 */
    handleQuery () {
      this.queryParams.pageNum = 1
      this.getList()
    },
    /** 重置按钮操作 */
    resetQuery () {
      this.resetForm('queryForm')
      this.handleQuery()
    },
    /** 表单重置(新增或修改对话框) */
    reset () {
      this.form = {
        number: undefined,
        name: undefined
      }
      this.resetForm('form')
    },
    /** 新增按钮操作 */
    handleAdd () {
      this.reset()
      this.open = true
      this.title = '新增计量单位'
    },
    /** 多选框选中数据 */
    handleSelectionChange (selection) {
      this.ids = selection.map(item => item.id)
      this.single = selection.length != 1
      this.multiple = !selection.length
    },
    /** 修改按钮操作 */
    handleUpdate (row) {
      this.reset()
      const id = row.id || this.ids
      getUOMById(id).then(response => {
        this.form = response.data
        this.open = true
        this.title = '修改计量单位'
      })
    },
    /** 删除按钮操作 */
    handleDelete (row) {
      const ids = row.id || this.ids
      this.$confirm('是否确定删除该数据项?', '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning' 
      }).then(() => {
        return deleteUOMByIds(ids)
      }).then(() => {
        this.getList()
        this.msgSuccess('删除成功')
      }).catch(function () {})
    },
    /** 提交按钮 */
    submit () {
      this.$refs['form'].validate(valid => {
        if (valid) {
          if (this.form.id != undefined) {  // 修改
            updateUOM(this.form).then(response => {
              if (response.code === 200) {
                this.msgSuccess('修改成功')
                this.open = false
                this.getList()
              } else {
                this.msgError(response.msg)
              }
            })
          } else { // 新增
            addUOM(this.form).then(response => {
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
    /** 取消按钮 */
    cancel () {
      this.open = false
      this.reset()
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
