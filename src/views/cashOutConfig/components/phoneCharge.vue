<template>
  <div class="phone-charge-page">
    <div class="table-container">
      <el-table :data="tableData" v-loading="listLoading">
        <el-table-column type="index" label="序号" width="60" />
        <el-table-column prop="level" label="充值档位" />
        <el-table-column prop="amount" label="扣除金币" />
        <el-table-column prop="count" label="限制/次" />
        <el-table-column prop="needVerify" label="是否要审核" />
        <el-table-column prop="status" label="状态">
          <template #default="scope">
            <el-switch
              :before-change="beforeChangeColumn"
              @change="auditStatusChange(scope.row)"
              v-model="scope.row.status"
              :active-value="1"
              :inactive-value="2"
            />
          </template>
        </el-table-column>
        <el-table-column fixed="right" label="操作" width="150">
          <template #default="scope">
            <el-button type="primary" link bg size="small" @click="handleEdit(scope.row)">编辑</el-button>
            <el-button type="danger" link bg size="small" @click="handleDelete(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const tableData = ref([
  {
    level: 30,
    amount: 1000000,
    count: '1次',
    needVerify: '是',
    status: 1
  }
])
</script>

<style></style>
