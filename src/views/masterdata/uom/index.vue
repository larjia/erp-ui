<template>
    <div class='app-container'>
      <el-form :model='queryParams' ref='queryForm' :inline='true' label-width='68px'>
        <el-form-item label='编码' prop='number'>
          <el-input
            v-model='queryParams.number'
            clearable
            size='small'
            @keyup.enter.native='handelQuery'
          />
        </el-form-item>
        <el-form-item label='名称' prop='name'>
          <el-input
            v-model='queryParams.name'
            clearable
            size='small'
            @keyup.enter.native='handelQuery'
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
          >修改</el-button>
        </el-col>
        <el-col :span="1.5">
          <el-button
            type='warning'
            icon='el-icon-download'
            size='mini'
            @click='handleExport'
          >修改</el-button>
        </el-col>
      </el-row>

      <el-table v-loading='loading' :data='uomList' @selection-change='handleSelectionChange' border size='small'>
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
    </div>
</template>

<script>
import {
  listUOM,
  getUOMById,
  getUOMByNumber,
  addUOM,
  updateUOM,
  deleteUOM
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
    }
  }
}
</script>

<style scoped>

</style>
