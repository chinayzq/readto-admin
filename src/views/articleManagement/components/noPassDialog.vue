<template>
  <div class="no-pass-dialog">
    <el-dialog
      v-model="dialogShow"
      :close-on-click-modal="false"
      title="审核详情"
      width="1000"
      :before-close="handleClose"
      v-loading="dialogLoading"
    >
      <div v-if="detailList.length">
        <div class="single-item" v-for="(item, index) in detailList" :key="index">
          <div class="title-line">
            类型：
            {{ item.type === 'text' ? '文字' : '图片' }}
          </div>
          <!-- 文字结果 -->
          <div v-if="item.result && item.type === 'text'">
            <el-descriptions class="margin-top" :column="2" border>
              <el-descriptions-item width="200">
                <template #label>
                  <div class="cell-item">识别结果</div>
                </template>
                {{ riskLevelMaps[item.result.riskLevel] }}
              </el-descriptions-item>
              <el-descriptions-item width="200">
                <template #label>
                  <div class="cell-item">风险原因</div>
                </template>
                {{ item.result.riskDescription }}
              </el-descriptions-item>
              <el-descriptions-item :span="2">
                <template #label>
                  <div class="cell-item">上下文</div>
                </template>
                {{ contextRender(item.result.allLabels) }}
              </el-descriptions-item>
            </el-descriptions>
          </div>
          <!-- 图片结果 -->
          <div v-if="item.type === 'pic' && item.result">
            <div v-for="(imgItem, imgIndex) in item.result.imgs" :key="imgIndex">
              <el-descriptions class="margin-top" :column="2" border>
                <el-descriptions-item width="200">
                  <template #label>
                    <div class="cell-item">识别结果{{ imgIndex + 1 }}</div>
                  </template>
                  {{ riskLevelMaps[imgItem.riskLevel] }}
                </el-descriptions-item>
                <el-descriptions-item width="200">
                  <template #label>
                    <div class="cell-item">风险原因</div>
                  </template>
                  {{ imgItem.riskDescription }}
                </el-descriptions-item>
                <el-descriptions-item :span="2">
                  <template #label>
                    <div class="cell-item">识别结果{{ imgIndex + 1 }}图片</div>
                  </template>
                  <img style="width: 70px; height: 70px" :src="noPassImageUrl(imgItem, item)" alt="" />
                </el-descriptions-item>
              </el-descriptions>
            </div>
          </div>
        </div>
      </div>
      <div class="no-data" v-else>暂无数据...</div>
    </el-dialog>
  </div>
</template>

<script setup>
import { computed, watch, ref } from 'vue'
import { getArticleNoPassDetail } from '@/api/article'
import { formatDateTime } from '@/utils'
const noPassImageUrl = (item, pItem) => {
  console.log('pItem', pItem)
  const requestTime = new Date(createTime.value)
  const timeString = formatDateTime(requestTime, 'YYYYMMDD')
  return `http://xjp-oss-jan.ap-southeast-1.oss.aliyuncs.com/POST_IMG/${timeString}/${item.requestId}.jpg`
}
const contextRender = (list) => {
  let result = ''
  list.forEach((item) => {
    if (item.riskDetail && item.riskDetail.riskSegments && item.riskDetail.riskSegments.length) {
      item.riskDetail.riskSegments.forEach((single) => {
        result += `【${single.segment}】`
      })
    }
  })
  return result
}

const riskLevelMaps = ref({
  PASS: '正常，建议直接放行',
  REVIEW: '可疑，建议人工审核',
  REJECT: '违规，建议直接拦截'
})
const dataBatch = (list) => {
  try {
    JSON.parse(list)
  } catch (error) {}
  console.log('list', list)
  // {bacthId1: [],bacthId2: [],}
  const result = {}
  list.forEach((item) => {
    if (!result[item.batchId]) {
      result[item.batchId] = [item]
    } else {
      result[item.batchId].push(item)
    }
  })
  return result
}
const props = defineProps({
  dialogVisible: {
    type: Boolean,
    default() {
      return false
    }
  },
  articleId: {
    type: String,
    default() {
      return null
    }
  },
  storyType: {
    type: String,
    default() {
      return '1'
    }
  }
})
watch(
  () => props.articleId,
  (id) => {
    if (id) {
      getDetailById(id)
    }
  },
  { deep: true }
)
const dialogLoading = ref(false)
const dialogShow = computed(() => props.dialogVisible)
const detailList = ref([])
const createTime = ref(null)
const getDetailById = (dataId) => {
  dialogLoading.value = true
  getArticleNoPassDetail({
    dataId,
    eventId: props.storyType === '1' ? 'writings' : 'message'
  })
    .then((res) => {
      detailList.value = resultRender(res.data)
      createTime.value = res.data.createTime
      console.log('detailList.value', detailList.value)
    })
    .finally(() => {
      dialogLoading.value = false
    })
}
const resultRender = (datas) => {
  const result = []
  if (datas.result && datas.result.text) {
    const temp = {
      type: 'text',
      result: JSON.parse(datas.result.text)
    }
    result.push(temp)
  }
  if (datas.result && datas.result.pic) {
    const temp = {
      type: 'pic',
      result: JSON.parse(datas.result.pic)
    }
    result.push(temp)
  }
  return result
}

const emit = defineEmits(['close'])
const handleClose = () => {
  emit('close')
}
</script>

<style lang="scss" scoped>
.no-pass-dialog {
  .single-item {
    margin-bottom: 15px;
    border: 1px solid #ccc;
    padding: 10px;
    .bacth-line {
      font-size: 16px;
      text-align: center;
      font-weight: bold;
    }
    .title-line {
      font-size: 14px;
      font-weight: bold;
      margin-bottom: 10px;
      margin-top: 10px;
    }
  }
}
</style>
