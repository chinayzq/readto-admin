<template>
  <div class="dictionary-model-component">
    <el-dialog
      v-model="props.dialogVisible"
      :title="props?.dataset?.title"
      width="800"
      :before-close="handleClose"
    >
      <el-form
        label-position="top"
        label-width="120px"
        ref="dictionaryFormIns"
        :rules="formRules"
        :model="formData"
      >
        <el-row :gutter="48">
          <el-col :span="12">
            <el-form-item label="分类编码" prop="classCode">
              <el-input
                :disabled="props.dataset.datas.classId"
                v-model="formData.classCode"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="分类名称" prop="className">
              <el-input v-model="formData.className" />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="描述" prop="description">
              <el-input
                :rows="2"
                type="textarea"
                v-model="formData.description"
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-form-item label="子项列表">
            <el-button
              style="margin-bottom: 10px"
              type="primary"
              @click="addNewItem"
              >添加子项</el-button
            >
            <el-table
              v-loading="listLoading"
              :data="formData.itemList"
              style="width: 100%"
            >
              <el-table-column prop="itemCode" label="子项编码">
                <template #default="scope">
                  <el-input v-model="scope.row.itemCode"></el-input>
                </template>
              </el-table-column>
              <el-table-column prop="itemName" label="子项名称">
                <template #default="scope">
                  <el-input v-model="scope.row.itemName"></el-input>
                </template>
              </el-table-column>
              <el-table-column prop="extend1" label="扩展1">
                <template #default="scope">
                  <el-input v-model="scope.row.extend1"></el-input>
                </template>
              </el-table-column>
              <el-table-column prop="extend2" label="扩展2">
                <template #default="scope">
                  <el-input v-model="scope.row.extend2"></el-input>
                </template>
              </el-table-column>
              <el-table-column prop="operation" label="操作">
                <template #default="scope">
                  <el-button
                    type="danger"
                    text
                    @click="rowClickHandler('delete', scope.row, scope.$index)"
                  >
                    删除
                  </el-button>
                </template>
              </el-table-column>
            </el-table>
          </el-form-item>
        </el-row>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="handleClose">取消</el-button>
          <el-button
            type="primary"
            @click="submitHandler"
            v-loading="submitLoading"
          >
            保存
          </el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, watch } from "vue";
import { Delete, Check, Close, Edit } from "@element-plus/icons-vue";
import { ElMessage } from "element-plus";
import {
  addDictionary,
  getItemByClassId,
  editDictionary,
  updateDictionaryClass,
} from "@/api/dictionary";
const dictionaryFormIns = ref(null);
const listLoading = ref(false);
const submitLoading = ref(false);
const emit = defineEmits();
const props = defineProps({
  dialogVisible: {
    type: Boolean,
    default() {
      return false;
    },
  },
  dataset: {
    type: Object,
    default() {
      return {};
    },
  },
});
watch(
  props.dataset,
  (datas) => {
    console.log("datas", datas);
    if (datas?.datas?.classId) {
      displayDatas(datas.datas);
    }
  },
  {
    deep: true,
  }
);
const formData = ref({
  classCode: "",
  className: "",
  description: "",
  itemList: [],
});
const formRules = ref({
  classCode: [
    {
      required: true,
      message: "请输入分类编码!",
      trigger: "blur",
    },
  ],
  className: [
    {
      required: true,
      message: "请输入分类名称!",
      trigger: "blur",
    },
  ],
});
const displayDatas = (datas) => {
  const { classCode, className, classId, description } = datas;
  formData.value.classCode = classCode;
  formData.value.className = className;
  formData.value.description = description;
  listLoading.value = true;
  getItemByClassId({ classId })
    .then((res) => {
      if (res?.data) {
        formData.value.itemList = res.data;
      }
    })
    .finally(() => {
      listLoading.value = false;
    });
};
const submitHandler = () => {
  dictionaryFormIns.value.validate((valid) => {
    if (valid) {
      if (props?.dataset?.datas?.classId) {
        editHandler();
      } else {
        addNewHandler();
      }
    }
  });
};
const editHandler = async () => {
  submitLoading.value = true;
  const classId = props.dataset.datas.classId;
  const { classCode, className, description } = formData.value;
  const params = {
    classId,
    classCode,
    className,
    description,
    extend1: "",
    extend2: "",
    extend3: "",
  };
  const classResult = await updateDictionaryClass(params);
  if (classResult.code === 200) {
    updateItemListRequest(classId);
  }
};
const addNewHandler = async () => {
  submitLoading.value = true;
  const { classCode, className, description, itemList } = formData.value;
  const params = {
    classCode,
    className,
    description,
    itemList,
    extend1: "",
    extend2: "",
    extend3: "",
  };
  const result = await addDictionary(params);
  if (result.code === 4100) {
    ElMessage({
      message: result.message,
      type: "warning",
    });
    submitLoading.value = false;
    return;
  }
  if (itemList.length) {
    updateItemListRequest(result.data);
  } else {
    ElMessage({
      message: "保存成功!",
      type: "success",
    });
    submitLoading.value = false;
    handleClose(true);
  }
};
const updateItemListRequest = (classId) => {
  const itemParams = {
    classId,
    itemList: formData.value.itemList,
  };
  editDictionary(itemParams)
    .then((res) => {
      console.log("xxx");
      if (res.code === 200) {
        ElMessage({
          message: "更新成功!",
          type: "success",
        });
        handleClose(true);
      }
    })
    .finally(() => {
      submitLoading.value = false;
    });
};
const addNewItem = () => {
  formData.value.itemList.push({
    itemCode: "",
    itemName: "",
    extend1: "",
    extend2: "",
  });
};
const rowClickHandler = (type, row, index) => {
  switch (type) {
    case "delete":
      formData.value.itemList.splice(index, 1);
      break;
  }
};
const resetForm = () => {
  formData.value = {
    classCode: "",
    className: "",
    description: "",
    itemList: [],
  };
};
const handleClose = (flag) => {
  resetForm();
  emit("close", flag);
};
</script>

<style lang="less" scoped>
.dictionary-model-component {
}
</style>