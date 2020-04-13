<template>
<div class="app-container">
    <el-form :inline="true">
      <el-form-item label="名称">
        <el-input
          v-model="queryParams.name"
          clearable
          size='mini'
          @keyup.enter.native='handleQuery'
        />
      </el-form-item>
      <el-form-item label="编码">
        <el-input
          v-model="queryParams.number"
          clearable
          size='mini'
          @keyup.enter.native='handleQuery'
        />
      </el-form-item>
       <el-form-item>
          <el-button
            type='primary'
            icon="el-icon-search"
            size="mini"
            @click="handleQuery"
          >搜索</el-button>
          <el-button
            type='primary'
            icon="el-icon-plus"
            size="mini"
            @click="handleAdd"
          >新增</el-button>
          <el-button
            type="success"
            icon="el-icon-edit"
            size="mini"
            @click="handleUpdate"
            :disabled="!isSelected"
          >修改</el-button>
          <el-button
            type="danger"
            icon="el-icon-delete"
            size="mini"
            @click="handleDelete"
            :disabled="!isSelected"
          >删除</el-button>
        </el-form-item>
    </el-form>

    <el-table
      v-loading='loading'
      :data='supplierList'
      row-key="id"
      border
      stripe
      highlight-current-row
      @current-change='handleCurrentChange'
      size='mini'
    >
      <el-table-column prop="number" label="编码"></el-table-column>
      <el-table-column prop="name" label="名称" width="250"></el-table-column>
      <el-table-column prop="address" label="地址" width="360"></el-table-column>
      <el-table-column prop="address2" label="地址2" width="100"></el-table-column>
      <el-table-column prop="country" label="国家"></el-table-column>
      <el-table-column prop="state" label="省份"></el-table-column>
      <el-table-column prop="city" label="城市"></el-table-column>
      <el-table-column prop="contact" label="联系人"></el-table-column>
      <el-table-column prop="phone" label="电话" width="100"></el-table-column>
      <el-table-column prop="email" label="邮箱" width="150"></el-table-column>
      <el-table-column prop="fax" label="传真" width="100"></el-table-column>
      <el-table-column prop="remark" label="备注" width="200"></el-table-column>
      <el-table-column prop="taxable" label="应纳税">
        <template slot-scope="scope">
          <span>{{ scope.row.taxable | taxableFilter }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="taxin" label="含税">
        <template slot-scope="scope">
          <span>{{ scope.row.taxin | taxinFilter }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="taxRate" label="税率"></el-table-column>
      <el-table-column prop="type" label="类别"></el-table-column>
      <el-table-column prop="bank" label="开户银行" width="180"></el-table-column>
      <el-table-column prop="bankAcct" label="银行账户" width="150"></el-table-column>
      <el-table-column prop="taxIdNbr" label="纳税识别号" width="180"></el-table-column>
      <el-table-column prop="acctPayable" label="应付科目"></el-table-column>
      <el-table-column prop="amtPayable" label="应付账款"></el-table-column>
      <el-table-column prop="amtPrePayment" label="预付账款"></el-table-column>
    </el-table>

    <!-- 分页 -->
    <pagination
      v-show="total > 0"
      :total='total'
      :page.sync='queryParams.pageNum'
      :limit.sync='queryParams.pageSize'
      @pagination='getList'
    />

    <!-- 添加或修改报工对话框 -->
    <el-dialog :title="title" :visible.sync="open" :close-on-click-modal="false" :close-on-press-escape="false"
      width="1100px" class="dialog" top="3vh !important" @close="closeDialog" center>

      <el-form ref="form" size="mini" :model="form" :rules="rules" label-width="90px">
        <!-- 编码和名称 -->
        <el-row>
          <el-col :span="6" :xs="{span:24, offset:0}">
            <el-form-item label="编码" prop="number">
              <el-input v-model="form.number" size="mini" />
            </el-form-item>
          </el-col>
          <el-col :span="12" :xs="{span:24, offset:0}">
            <el-form-item label="名称" prop="name">
              <el-input v-model="form.name" size="mini" />
            </el-form-item>
          </el-col>
          <el-col :span="6" :xs="{span:24, offset:0}">
            <el-form-item label="类型" prop="type">
              <el-input v-model="form.type" size="mini" />
            </el-form-item>
          </el-col>
        </el-row>

        <!-- 地址 -->
        <el-row>
          <el-col :span="12" :xs="{span:24, offset:0}">
            <el-form-item label="地址" prop="address">
              <el-input v-model="form.address" size="mini" />
            </el-form-item>
          </el-col>
          <el-col :span="12" :xs="{span:24, offset:0}">
            <el-form-item label="地址2" prop="address2">
              <el-input v-model="form.address2" size="mini" />
            </el-form-item>
          </el-col>
        </el-row>

        <!-- 国家、省份、城市 -->
        <el-row>
          <el-col :span="6" :xs="{span:24, offset:0}">
            <el-form-item label="国家" prop="country">
              <el-input v-model="form.country" size="mini" />
            </el-form-item>
          </el-col>
          <el-col :span="6" :xs="{span:24, offset:0}">
            <el-form-item label="省份" prop="state">
              <el-input v-model="form.state" size="mini" />
            </el-form-item>
          </el-col>
          <el-col :span="6" :xs="{span:24, offset:0}">
            <el-form-item label="城市" prop="city">
              <el-input v-model="form.city" size="mini" />
            </el-form-item>
          </el-col>
        </el-row>

        <!-- 联系人、电话、邮箱、传真 -->
        <el-row>
          <el-col :span="6" :xs="{span:24, offset:0}">
            <el-form-item label="联系人" prop="contact">
              <el-input v-model="form.contact" size="mini" />
            </el-form-item>
          </el-col>
          <el-col :span="6" :xs="{span:24, offset:0}">
            <el-form-item label="电话" prop="phone">
              <el-input v-model="form.phone" size="mini" />
            </el-form-item>
          </el-col>
          <el-col :span="6" :xs="{span:24, offset:0}">
            <el-form-item label="邮箱" prop="email">
              <el-input v-model="form.email" size="mini" />
            </el-form-item>
          </el-col>
          <el-col :span="6" :xs="{span:24, offset:0}">
            <el-form-item label="传真" prop="fax">
              <el-input v-model="form.fax" size="mini" />
            </el-form-item>
          </el-col>
        </el-row>

        <!-- 备注 -->
        <el-row>
          <el-col :span="24">
            <el-form-item label="备注" prop="remark">
              <el-input v-model="form.remark" size="mini" />
            </el-form-item>
          </el-col>
        </el-row>

        <!-- 应纳税、含税、税率 -->
        <el-row>
          <el-col :span="6" :xs="{span:24, offset:0}">
            <el-form-item label="应纳税" prop="taxable">
              <el-checkbox v-model="form.taxable" size="mini" />
            </el-form-item>
          </el-col>
          <el-col :span="6" :xs="{span:24, offset:0}">
            <el-form-item label="含税" prop="taxin">
              <el-checkbox v-model="form.taxin" size="mini" />
            </el-form-item>
          </el-col>
          <el-col :span="6" :xs="{span:24, offset:0}">
            <el-form-item label="税率%" prop="taxRate">
              <el-input-number v-model="form.taxRate" size="mini" />
            </el-form-item>
          </el-col>
        </el-row>

        <!-- 开户行、银行账户、纳税人识别号、应付账户 -->
        <el-row>
          <el-col :span="6" :xs="{span:24, offset:0}">
            <el-form-item label="开户行" prop="bank">
              <el-input v-model="form.bank" size="mini" />
            </el-form-item>
          </el-col>
          <el-col :span="6" :xs="{span:24, offset:0}">
            <el-form-item label="银行账户" prop="bankAcct">
              <el-input v-model="form.bankAcct" size="mini" />
            </el-form-item>
          </el-col>
          <el-col :span="6" :xs="{span:24, offset:0}">
            <el-form-item label="纳税识别号" prop="taxIdNbr">
              <el-input v-model="form.taxIdNbr" size="mini" />
            </el-form-item>
          </el-col>
          <el-col :span="6" :xs="{span:24, offset:0}">
            <el-form-item label="应付科目" prop="acctPayable">
              <el-input v-model="form.acctPayable" size="mini" />
            </el-form-item>
          </el-col>
        </el-row>

        <!-- 应付账款、预付账款 -->
        <el-row>
          <el-col :span="6" :xs="{span:24, offset:0}">
            <el-form-item label="应付账款" prop="amtPayable">
              <el-input v-model="form.amtPayable" size="mini" disabled />
            </el-form-item>
          </el-col>
          <el-col :span="6" :xs="{span:24, offset:0}">
            <el-form-item label="预付账款" prop="amtPrePayment">
              <el-input v-model="form.amtPrePayment" size="mini" disabled />
            </el-form-item>
          </el-col>
        </el-row>
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
  listSupplier,
  getSupplierById,
  addSupplier,
  updateSupplier,
  deleteSupplierById
}
from '@/api/masterdata/supplier'

export default {
  name: 'Supplier',
  data () {
    return {
      // 遮罩层
      loading: true,
      // 表格数据
      supplierList: [],
      // 分类选项
      typeOptions: [],
      // 弹出层标题
      title: '',
      // 是否显示弹出层
      open: false,
      // 对话框是否为新增或修改
      isNew: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        number: undefined,
        name: undefined
      },
      // 总记录数(分页)
      total: 0,
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
      },
      // 当前选择行
      currentRow: null
    }
  },
  created () {
    this.getList()
  },
  computed: {
    isSelected () {
      if (this.currentRow != null) {
        return true
      } else {
        return false
      }
    }
  },
  filters: {
    taxableFilter: (value) => {
      return value ? '是' : '否'
    },
    taxinFilter: (value) => {
      return value ? '是' : '否'
    }
  },
  methods: {
    /** 查询供应商列表 */
    getList() {
      this.loading = true
      listSupplier(this.queryParams).then(response => {
        this.supplierList = response.rows
        this.loading = false
      })
    },
    /** 搜索 */
    handleQuery () {
      this.queryParams.pageNum = 1
      this.getList()
    },
    /** 新增按钮操作 */
    handleAdd () {
      this.isNew = true
      this.reset()
      this.open = true
      this.title = '新增供应商'
    },
    /** 修改按钮操作 */
    handleUpdate () {
      this.reset()
      const id = this.currentRow.id
      getSupplierById(id).then(response => {
        this.form = response.data
        this.open = true
        this.title = '修改供应商'
      })
    },
    /** 删除按钮操作 */
    handleDelete () {
      const id = this.currentRow.id
      this.$confirm('是否确定删除供应商"' + this.currentRow.name + '"的数据项?', '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        return deleteSupplierById(id)
      }).then(() => {
        this.getList()
        this.msgSuccess('删除成功')
      }).catch(function() {})
    },
    /** 表单重置 */
    reset () {
      this.form = {
        taxable: true,
        taxin: false,
        taxRate: 13,
        number: '',
        name: ''
      }
      this.resetForm('form')
    },
    /** 取消对话框 */
    cancel () {
      this.open = false
      this.reset()
    },
    /** 关闭对话框 */
    closeDialog () {
      this.reset()
    },
    /** 点击确定按钮 */
    submit () {
      this.$refs['form'].validate(valid => {
        if (valid) {
          if (this.isNew) {   // 新增
            addSupplier(this.form).then(response => {
              if (response.code === 200) {
                this.msgSuccess('新增成功')
                this.open = false
                this.getList()
              } else {
                this.msgError(response.msg)
              }
            })
          } else {            // 修改
            updateSupplier(this.form).then(response => {
              if (response.code === 200) {
                this.msgSuccess('修改成功')
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
    handleCurrentChange (val) {
      this.currentRow = val
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

.app-container ::v-deep .el-dialog__headerBtn {
  top: 15px;
}
</style>
