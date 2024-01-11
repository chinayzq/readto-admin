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
        <div class="single-item" v-for="(item, index) in dataBatch(detailList)" :key="item">
          <div class="bacth-line">批次：{{ index }}</div>
          <div v-for="(single, singleIndex) in item" :key="singleIndex">
            <div class="title-line">
              类型：
              {{ single.type === 'text' ? '文字' : '图片' }}
            </div>
            <!-- 文字结果 -->
            <div v-if="single.result && single.type === 'text'">
              <el-descriptions class="margin-top" :column="2" border>
                <el-descriptions-item width="200">
                  <template #label>
                    <div class="cell-item">识别结果</div>
                  </template>
                  {{ riskLevelMaps[JSON.parse(single.result).riskLevel] }}
                </el-descriptions-item>
                <el-descriptions-item width="200">
                  <template #label>
                    <div class="cell-item">风险原因</div>
                  </template>
                  {{ JSON.parse(single.result).riskDescription }}
                </el-descriptions-item>
                <el-descriptions-item :span="2">
                  <template #label>
                    <div class="cell-item">上下文</div>
                  </template>
                  {{ contextRender(JSON.parse(single.result).allLabels) }}
                </el-descriptions-item>
              </el-descriptions>
            </div>
            <!-- 图片结果 -->
            <div v-if="single.type === 'pic' && single.result">
              <div v-for="(imgItem, imgIndex) in JSON.parse(single.result).imgs" :key="imgIndex">
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
                    <img style="width: 70px; height: 70px" :src="noPassImageUrl(imgItem)" alt="" />
                  </el-descriptions-item>
                </el-descriptions>
              </div>
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
const noPassImageUrl = (item) => {
  const requestTime = new Date(Number(item.requestId.split('_')[1]))
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
const getDetailById = (id) => {
  dialogLoading.value = true
  getArticleNoPassDetail(id)
    .then((res) => {
      detailList.value = res.data
    })
    .finally(() => {
      dialogLoading.value = false
    })
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
