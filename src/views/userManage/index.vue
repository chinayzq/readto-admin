<template>
  <div class="user-management-component app-container">
    <div class="search-line">
      <el-row :gutter="10">
        <el-col :span="2">
          <el-select @change="initDatas" v-model="searchForm.gender" placeholder="性别" clearable>
            <el-option v-for="item in sexOptions" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </el-col>
        <el-col :span="2">
          <el-select @change="ageRangeChange" v-model="ageRange" placeholder="年龄段" clearable>
            <el-option v-for="item in ageGroupOptions" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </el-col>
        <!-- 暂时不开发等级系统，先注释 -->
        <!-- <el-col :span="2">
          <el-select v-model="searchForm.level" placeholder="等级" clearable>
            <el-option v-for="item in levelOptions" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </el-col> -->
        <el-col :span="2">
          <el-select @change="initDatas" v-model="searchForm.userStatus" placeholder="状态" clearable>
            <el-option v-for="item in stateOptions" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </el-col>
        <el-col :span="4">
          <el-input @input="initDatas" v-model="searchForm.key" placeholder="输入昵称或联系方式搜索" />
        </el-col>
        <el-col :span="5">
          <el-button type="primary" :icon="Search" @click="initDatas">查询</el-button>
          <el-button v-if="!searchForm.userId" type="primary" :icon="CirclePlus" @click="addNewUser"
            >添加用户</el-button
          >
          <el-button
            v-else
            type="primary"
            @click="
              () => {
                searchForm.userId = null
                initDatas()
              }
            "
            >返回上级列表</el-button
          >
        </el-col>
      </el-row>
    </div>
    <div class="table-container">
      <el-table :data="tableData" v-loading="tableLoading">
        <el-table-column type="index" label="序号" width="60" />
        <el-table-column prop="image" label="头像">
          <template #default="scope">
            <img class="list-user-icon" v-if="scope.row.headImg" :src="scope.row.headImg" alt="" />
            <img class="list-user-icon" v-else src="@/assets/user/user_default_icon.png" alt="" />
          </template>
        </el-table-column>
        <el-table-column prop="nickeName" label="昵称" />
        <el-table-column prop="gender" label="性别">
          <template #default="scope">
            <span>{{ genderMap[scope.row.gender] }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="age" label="年龄">
          <template #default="scope">
            <span>{{ scope.row.age || '-' }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="bindPhone" label="手机号">
          <template #default="scope">
            <span>{{ scope.row.bindPhone || '-' }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="email" label="邮箱">
          <template #default="scope">
            <span>{{ scope.row.email || '-' }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="subCnt" label="下级">
          <template #default="scope">
            <span class="link-button" @click="lookSubList(scope.row)">{{ scope.row.subCnt }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="pnickeName" label="上级">
          <template #default="scope">
            <span v-if="scope.row.pnickeName" class="link-button" @click="lookParentList(scope.row)">{{
              scope.row.pnickeName
            }}</span>
            <span v-else>-</span>
          </template>
        </el-table-column>
        <el-table-column prop="active" label="激活状态">
          <template #default="scope">
            <span>{{ activeLabelMap[scope.row.active] }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="availableGoldCoins" label="金币余额" />
        <el-table-column prop="registerIp" label="注册IP" width="120" />
        <el-table-column prop="lastOnlineTime" label="最后登录时间" width="160">
          <template #default="scope">
            <span>{{ formatDateTime(scope.row.lastLoginTime) }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="userStatus" label="封禁状态">
          <template #default="scope">
            <el-switch
              @change="userStatusChange(scope.row)"
              v-model="scope.row.userStatus"
              :active-value="1"
              :inactive-value="0"
            />
          </template>
        </el-table-column>
        <el-table-column fixed="right" label="操作" width="150">
          <template #default="scope">
            <el-button type="primary" link bg size="small" @click="openUserDetail(scope.row)">详情</el-button>
            <el-button type="primary" link bg size="small" @click="openGoldOperation(scope.row)">金币操作</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="pagination-container">
      <el-pagination
        v-model:current-page="pageVO.page"
        background
        layout="total, prev, pager, next"
        :total="total"
        @current-change="handleCurrentChange"
      />
    </div>
    <UserAddDialog :dialogVisible="userDialogVisible" @close="userAddDialogClose" />
    <UserDetailDialog :dataset="userDetailDatas" :dialogVisible="userDetailVisible" @close="userDetailClose" />
    <GoldOperaionDialog :dataset="userGoldDatas" :dialogVisible="goldOperationVisible" @close="closeGoldOperation" />
  </div>
</template>

<script setup>
import { Search, CirclePlus } from '@element-plus/icons-vue'
import { ref } from 'vue'
import UserAddDialog from './components/userAddDialog.vue'
import UserDetailDialog from './components/userDetailDialog.vue'
import GoldOperaionDialog from './components/goldOperationDialog.vue'
import { getUserList, changeUserStatus } from '@/api/user'
import { formatDateTime } from '@/utils'
import { ElMessage } from 'element-plus'

//#region 所有options
const sexOptions = ref([
  {
    label: '全部',
    value: ''
  },
  {
    label: '男',
    value: 1
  },
  {
    label: '女',
    value: 2
  }
])
const ageRange = ref(null)
const ageRangeMap = ref({
  50: [1950, 1959],
  60: [1960, 1969],
  70: [1970, 1979],
  80: [1980, 1989],
  90: [1990, 1999],
  '00': [2000, 2009],
  10: [2010, 2019]
})
const ageGroupOptions = ref([
  {
    label: '全部',
    value: null
  },
  {
    label: '50后',
    value: '50'
  },
  {
    label: '60后',
    value: '60'
  },
  {
    label: '70后',
    value: '70'
  },
  {
    label: '80后',
    value: '80'
  },
  {
    label: '90后',
    value: '90'
  },
  {
    label: '00后',
    value: '00'
  },
  {
    label: '10后',
    value: '10'
  }
])
// const levelOptions = ref([
//   {
//     label: "未激活",
//     value: 0
//   },
//   {
//     label: "LV1",
//     value: 1
//   },
//   {
//     label: "LV2",
//     value: 2
//   },
//   {
//     label: "LV3",
//     value: 3
//   },
//   {
//     label: "LV4",
//     value: 4
//   },
//   {
//     label: "LV5",
//     value: 5
//   },
//   {
//     label: "LV6",
//     value: 6
//   }
// ])
const stateOptions = ref([
  { label: '正常', value: 0 },
  { label: '封禁', value: 1 }
])
//#endregion

//#region 查询
const activeLabelMap = ref({
  0: '否',
  1: '是'
})
const genderMap = ref({
  1: '男',
  2: '女',
  0: '未知'
})
const total = ref(0)
const searchForm = ref({
  gender: null,
  ageRange: null,
  userStatus: null,
  key: null,
  userId: null
})
const pageVO = ref({
  page: 1,
  pageSize: 10
})
const tableData = ref([])
const tableLoading = ref(false)
const initDatas = () => {
  tableLoading.value = true
  getUserList({
    ...pageVO.value,
    ...searchForm.value,
    ...{
      // isDes: true,
      // orderColumns: ["lastOnlineTime"]
    }
  })
    .then((res) => {
      const { records } = res.data
      tableData.value = records
      total.value = res.data.total
    })
    .finally(() => {
      tableLoading.value = false
    })
}
initDatas()
const handleCurrentChange = (page) => {
  pageVO.value.page = page
  initDatas()
}
const ageRangeChange = (range) => {
  searchForm.value.ageRange = ageRangeMap.value[range]
  initDatas()
}
const lookSubList = (row) => {
  searchForm.value.userId = row.id
  searchForm.value.key = null
  initDatas()
}
const lookParentList = (row) => {
  searchForm.value.userId = null
  searchForm.value.key = row.pnickeName
  initDatas()
}

//#endregion

//#region 修改
const userStatusChange = ({ userStatus, id }) => {
  changeUserStatus({
    userStatus,
    id
  }).then((res) => {
    if (res.code === 1) {
      ElMessage.success('状态更新成功！')
    }
  })
}
//#endregion

// #region 新增
const userDialogVisible = ref(false)
const addNewUser = () => {
  console.log('1111')
  userDialogVisible.value = true
}
const userAddDialogClose = (flag) => {
  userDialogVisible.value = false
  if (flag) {
    initDatas()
  }
}

const userDetailVisible = ref(false)
const userDetailDatas = ref({})
const openUserDetail = (item) => {
  userDetailDatas.value = item
  userDetailVisible.value = true
}
const userDetailClose = () => {
  userDetailVisible.value = false
}

const goldOperationVisible = ref(false)
const userGoldDatas = ref({})
const openGoldOperation = (item) => {
  userGoldDatas.value = item
  goldOperationVisible.value = true
}
const closeGoldOperation = (fresh) => {
  goldOperationVisible.value = false
  if (fresh === true) {
    initDatas()
  }
}
//#endregion
</script>

<style lang="scss" scoped>
.user-management-component {
  .search-line {
    margin-bottom: 20px;
  }
  .pagination-container {
    display: flex;
    justify-content: center;
    margin: 15px 0;
  }
  .list-user-icon {
    height: 30px;
    width: 30px;
  }
  .link-button {
    color: #409eff;
    cursor: pointer;
  }
}
</style>
