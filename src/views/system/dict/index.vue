<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" label-width="90px" :inline="true" size="mini">
      <el-row>
        <el-col :span="24">
          <el-form-item label="字典名称" prop="dictName">
            <el-input
              v-model="queryParams.dictName"
              clearable
              size="mini"
              @keyup.enter.native="handleQuery"
            />
          </el-form-item>

          <el-form-item label="字典类型" prop="dictType">
            <el-input
              v-model="queryParams.dictType"
              clearable
              size="mini"
              @keyup.enter.native="handleQuery"
            />
          </el-form-item>

          <el-form-item label="状态" prop="status">
            <el-select
              v-model="queryParams.status"
              clearable
              size="mini"
            >
              <el-option
                v-for="dict in statusOptions"
                :key="dict.dictValue"
                :label="dict.dictLabel"
                :value="dict.dictValue"
              />
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24">
          <el-form-item label="创建时间">
            <el-date-picker
              v-model="dateRange"
              size="mini"
              value-format="yyyy-MM-dd"
              type="daterange"
              range-separator="-"
              start-placeholde="开始日期"
              end-placeholde="结束日期"
            ></el-date-picker>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
            <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
            <el-button type="primary" icon="el-icon-plus" size="mini" @click="handleAdd">新增</el-button>
            <el-button type="success" icon="el-icon-edit" size="mini" 
              :disabled="!isSelected" 
              @click="handleUpdate"
              v-hasPermi="['system:dict:edit']"
              v-hasRole="['admin']"
            >修改</el-button>
            <el-button type="danger" icon="el-icon-delete" size="mini" :disabled="!isSelected" @click="handleDelete">删除</el-button>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form> 

    <el-table v-loading="loading" :data="typeList" 
      border
      stripe
      size="mini"
      highlight-current-row
      @current-change="handleCurrentChange">
      <el-table-column label="字典编号" align="center" prop="dictId" />
      <el-table-column label="字典名称" align="center" prop="dictName" :show-overflow-tooltip="true" />
      <el-table-column label="字典类型" align="center" :show-overflow-tooltip="true">
        <template slot-scope="scope">
          <router-link :to="'/dict/type/data/' + scope.row.dictId" class="link-type">
            <span>{{ scope.row.dictType }}</span>
          </router-link>
        </template>
      </el-table-column>
      <el-table-column label="状态" align="center" prop="status" :formatter="statusFormat" />
      <el-table-column label="备注" align="center" prop="remark" :show-overflow-tooltip="true" />
      <el-table-column label="创建时间" align="center" prop="createTime">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.createTime) }}</span>
        </template>
      </el-table-column>
    </el-table>

    <pagination
      v-show="total > 0"
      :total="total"
      :page.sync="queryParams.pageNum"
      :limit.sync="queryParams.pageSize"
      @pagination="getList"
    />

    <!-- 添加或修改参数配置对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px">
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="字典名称" prop="dictName">
          <el-input v-model="form.dictName" placeholder="请输入字典名称" />
        </el-form-item>
        <el-form-item label="字典类型" prop="dictType">
          <el-input v-model="form.dictType" placeholder="请输入字典类型" />
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-radio-group v-model="form.status">
            <el-radio
              v-for="dict in statusOptions"
              :key="dict.dictValue"
              :label="dict.dictValue"
            >{{ dict.dictLabel }}</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input v-model="form.remark" type="textarea" placeholder="请输入内容"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submit">确定</el-button>
        <el-button @click="cancel">取消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import
{
  listType,
  getType,
  delType,
  addType,
  updateType
  // exportType
}
from '@/api/system/dict/type'
export default {
  name: 'Dict',
  data () {
    return {
      // 遮罩层
      loading: true,
      // 总记录数
      total: 0,
      // 字典表格数据
      typeList: [],
      // 状态数据字典
      statusOptions: [],
      // 弹出层标题
      title: '',
      // 是否显示弹出层
      open: false,
      // 日期范围
      dateRange: [],
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        dictName: undefined,
        dictType: undefined,
        status: undefined
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        dictName: [
          { required: true, message: '字典名称不能为空', trigger: 'blur' }
        ],
        dictType: [
          { required: true, message: '字典类型不能为空', trigger: 'blur' }
        ]
      },
      currentRow: null
    }
  },
  created () {
    this.getList()
    this.getDicts("sys_normal_disable").then(response => {
      this.statusOptions = response.data
    })
  },
  computed: {
    isSelected () {
      return this.currentRow == null ? false : true
    }
  },
  methods: {
    /** 查询字典类型列表 */
    getList () {
      this.loading = true
      // 情况当前行
      this.currentRow = null
      listType(this.addDateRange(this.queryParams, this.dateRange)).then(response => {
        this.typeList = response.rows
        this.total = response.total
        this.loading = false
      })
    },
    /** 字典状态字典翻译 */
    statusFormat(row) {
      return this.selectDictLabel(this.statusOptions, row.status)
    },
    // 表单重置
    reset () {
      this.form = {
        dictId: undefined,
        dictName: undefined,
        dictType: undefined,
        status: '0',
        remark: undefined
      }
      this.resetForm('form')
    },
    // 取消按钮
    cancel () {
      this.open = false
      this.reset()
    },
    /** 搜索按钮 */
    handleQuery () {
      this.queryParams.pageNum = 1
      this.getList()
    },
    /** 重置按钮 */
    resetQuery () {
      this.dateRange = []
      this.resetForm('queryForm')
      this.handleQuery()
    },
    /** 新增按钮 */
    handleAdd () {
      this.reset()
      this.open = true
      this.title = "添加字典类型"
    },
    /** 修改按钮 */
    handleUpdate () {
      this.reset()
      const dictId = this.currentRow.dictId
      getType(dictId).then(response => {
        this.form = response.data
        this.open = true
        this.title = "修改字典类型"
      })
    },
    /** 删除按钮 */
    handleDelete () {
      const dictId = this.currentRow.dictId
      this.$confirm('是否确认删除字典名称为"' + this.currentRow.dictName + '"的数据项?', '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        return delType(dictId)
      }).then(() =>{
        this.getList()
        this.msgSuccess('删除成功')
      }).catch(function() {})
    },
    /** 导出按钮 */
    handleExport () {
    },
    /** 提交按钮 */
    submit () {
      this.$refs['form'].validate(valid => {
        if (valid) {
          if (this.form.dictId != undefined) {  // 修改
            updateType(this.form).then(response => {
              if (response.code === 200) {
                this.msgSuccess("修改成功")
                this.open = false
                this.getList()
              } else {
                this.msgError(response.msg)
              }
            })
          } else {                              // 新增
            addType(this.form).then(response => {
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
    /** 当前行更改 */
    handleCurrentChange (val) {
      this.currentRow = val
    }
  }
}
</script>

<style scoped>
</style>
