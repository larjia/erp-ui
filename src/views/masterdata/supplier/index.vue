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
      :data='supplierList'
      row-key="id"
      border
      size='mini'
    >
      <el-table-column prop="number" label="编码"></el-table-column>
      <el-table-column prop="name" label="名称"></el-table-column>
      <el-table-column prop="address" label="地址"></el-table-column>
      <el-table-column prop="address2" label="地址2"></el-table-column>
      <el-table-column prop="country" label="国家"></el-table-column>
      <el-table-column prop="state" label="省份"></el-table-column>
      <el-table-column prop="contact" label="联系人"></el-table-column>
      <el-table-column prop="phone" label="电话"></el-table-column>
      <el-table-column prop="email" label="邮箱"></el-table-column>
      <el-table-column prop="fax" label="传真"></el-table-column>
      <el-table-column prop="remark" label="备注"></el-table-column>
      <el-table-column prop="taxable" label="应纳税"></el-table-column>
      <el-table-column prop="taxin" label="含税"></el-table-column>
      <el-table-column prop="taxRate" label="税率"></el-table-column>
      <el-table-column prop="type" label="类别"></el-table-column>
      <el-table-column prop="bank" label="开户银行"></el-table-column>
      <el-table-column prop="bankAcct" label="银行账户"></el-table-column>
      <el-table-column prop="taxIdNumber" label="纳税人识别号"></el-table-column>
      <el-table-column prop="acctPayable" label="应付账户"></el-table-column>
      <el-table-column prop="amtPayable" label="应付账款"></el-table-column>
      <el-table-column prop="amtPrePayment" label="预付账款"></el-table-column>
    </el-table>
</div>
</template>

<script>
export default {
  name: 'Supplier',
  data () {
    return {
      queryParams: {
        number: undefined,
        name: undefined
      }
    }
  },
  methods: {
    handleAdd () {
    }
  }
}
</script>

<style scoped>

</style>
