<template>
  <div class="page">
    <h2 class="title">Excel 导入</h2>

    <!-- 提示区域 -->
    <div class="tips">
      <p>请选择需要导入的 Excel 文件（.xlsx / .xls）</p>
      <p class="sub">系统将自动解析表格数据并显示预览</p>
    </div>

    <!-- 文件上传 -->
    <div class="uploader-center" v-if="!preview.length">
      <van-uploader
        v-model="fileList"
        :after-read="onAfterRead"
        :max-count="1"
        :preview-image="false"
        accept=".xlsx,.xls"
      >
        <div class="upload-card">
          <van-icon name="description" size="48" color="#1989fa" />
          <p class="upload-text">点击选择 Excel 文件</p>
        </div>
      </van-uploader>
    </div>

    <!-- 加载状态 -->
    <div v-if="loading" class="loading">
      <van-loading size="24px">正在解析 Excel...</van-loading>
    </div>

    <!-- 预览表格 -->
    <div v-if="preview.length" class="preview">
      <h3 class="preview-title">数据预览</h3>

      <div class="table-wrapper">
        <table>
          <thead>
            <tr>
              <th v-for="(header, index) in preview[0]" :key="index">{{ header }}</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(row, rIndex) in preview.slice(1)" :key="rIndex">
              <td v-for="(cell, cIndex) in row" :key="cIndex">{{ cell }}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <van-button type="primary" block class="import-btn" @click="onImport">
        确认导入
      </van-button>

      <van-button type="warning" block class="reset-btn" @click="onReset">
        重新选择文件
      </van-button>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { showToast } from 'vant'
import * as XLSX from 'xlsx'
import { batchUploadExcel } from "@/api/archives"

const fileList = ref([])
const loading = ref(false)
const preview = ref([])
const realFile = ref(null)

const onAfterRead = async (file) => {
  loading.value = true
  preview.value = []

  try {
    realFile.value = file.file

    const data = await file.file.arrayBuffer()
    const workbook = XLSX.read(data)

    const sheetName = workbook.SheetNames[0]
    const sheet = workbook.Sheets[sheetName]
    const json = XLSX.utils.sheet_to_json(sheet, { header: 1 })

    preview.value = json
    showToast('解析成功')
  } catch (err) {
    showToast('Excel 解析失败')
  } finally {
    loading.value = false
  }
}

const onImport = async () => {
  if (!realFile.value) {
    showToast("请先选择文件")
    return;
  }

  const formData = new FormData()
  formData.append("file", realFile.value)

  showToast("正在上传...")

  try {
    const res = await batchUploadExcel(formData)
    showToast(`成功 ${res.success_count} 条，失败 ${res.fail_count} 条`)
  } catch (err) {
    showToast("导入失败，请稍后重试")
  }
}

const onReset = () => {
  fileList.value = []
  preview.value = []
  realFile.value = null
  loading.value = false

  showToast("已重置，请重新选择文件")
}
</script>

<style scoped>
.page {
  padding: 16px;
  min-height: 100vh;
  background: #f7f8fa;
}

.title {
  text-align: center;
  font-size: 36px;
  font-weight: 600;
  margin-bottom: 20px;
}

.tips {
  background: #fff;
  padding: 16px;
  border-radius: 12px;
  margin-bottom: 20px;
  font-size: 16px;
  color: #555;
}

.tips .sub {
  font-size: 14px;
  color: #888;
  margin-top: 4px;
}

.upload-card {
  background: #fff;
  padding: 40px 20px;
  border-radius: 16px;
  text-align: center;
  border: 2px dashed #1989fa;
  width: 90%;
  margin: 20px auto;
}

.upload-text {
  margin-top: 12px;
  font-size: 18px;
  color: #1989fa;
}

.loading {
  margin-top: 20px;
  text-align: center;
}

.preview {
  margin-top: 28px;
}

.preview-title {
  font-size: 20px;
  font-weight: 600;
  margin-bottom: 12px;
}

.table-wrapper {
  max-height: 300px;
  overflow: auto;
  background: #fff;
  padding: 12px;
  border-radius: 12px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.05);
}

table {
  width: 100%;
  border-collapse: collapse;
}

th, td {
  border: 1px solid #eee;
  padding: 8px;
  font-size: 14px;
  text-align: left;
}

.import-btn {
  margin-top: 20px;
}

.reset-btn {
  margin-top: 12px;
}

.uploader-center {
  width: 100%;
  display: flex;
  justify-content: center;
}
</style>
