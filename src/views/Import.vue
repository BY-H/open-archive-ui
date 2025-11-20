<template>
  <div class="page">
    <!-- 标题 -->
    <h2 class="title">档案导入</h2>

    <!-- 信息填写区域 -->
    <div class="form-card">
      <van-field v-model="form.ArchiveNo" label="档案号" placeholder="请输入档案号" />
      <van-field v-model="form.Title" label="题名" placeholder="请输入题名" />
      <van-field v-model="form.FormTime" label="形成时间" placeholder="例如：2024-10-01" type="date" />
      <van-field v-model="form.RetentionPeriod" label="保管期限" placeholder="如：30年 / 永久" />
      <van-field v-model="form.Description" label="备注" placeholder="可填写相关说明" type="textarea" autosize />
    </div>

    <!-- 上传区域 -->
    <van-uploader
      v-model="fileList"
      :after-read="onAfterRead"
      :max-count="3"
      :preview-image="false"
      accept=".pdf,.docx,.doc"
    >
      <div class="upload-card">
        <van-icon name="guide-o" size="48" color="#1989fa" />
        <p class="upload-text">点击选择文件上传</p>
        <p class="upload-tip">支持 .pdf .docx .csv .xlsx .zip 等格式</p>
      </div>
    </van-uploader>

    <!-- 上传状态 -->
    <div v-if="uploading" class="uploading">
      <van-loading size="24px">正在上传，请稍候...</van-loading>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { showToast } from "vant";
import { uploadArchive } from "@/api/archives";

const fileList = ref([]);
const uploading = ref(false);

const form = ref({
  ArchiveNo: "",
  Title: "",
  FormTime: "",
  RetentionPeriod: "",
  Description: "",
});

const checkForm = () => {
  if (!form.value.ArchiveNo) return showToast("请填写档案号"), false;
  if (!form.value.Title) return showToast("请填写题名"), false;
  if (!form.value.FormTime) return showToast("请填写形成时间"), false;
  if (!form.value.RetentionPeriod) return showToast("请填写保管期限"), false;
  return true;
};

const onAfterRead = async (file) => {
  if (!checkForm()) return;

  if (!file.file) {
    showToast("文件格式不正确");
    return;
  }

  uploading.value = true;
  showToast("正在上传...");

  try {
    // 真实上传
    const fd = new FormData();

    // 填写表单字段（你后端的字段名完全按下面）
    fd.append("archive_no", form.value.ArchiveNo);
    fd.append("title", form.value.Title);
    fd.append("form_time", form.value.FormTime);
    fd.append("retention_period", form.value.RetentionPeriod);
    fd.append("description", form.value.Description);

    // 文件字段（你后端读取的是 FormFile("file")）
    fd.append("file", file.file);

    // 发送请求
    const res = await uploadArchive(fd);

    console.log("上传结果：", res);
    showToast("上传成功");

    // 上传后清理
    fileList.value = [];
    Object.keys(form.value).forEach((k) => (form.value[k] = ""));
  } catch (err) {
    console.error("上传失败：", err);
    showToast("上传失败");
  } finally {
    uploading.value = false;
  }
};
</script>



<style scoped>
.page {
  padding: 16px;
  background-color: #f7f8fa;
  min-height: 100vh;
  text-align: center;
}

.title {
  font-size: 32px;
  font-weight: 600;
  margin: 20px 0;
  color: #333;
}

.form-card {
  background: #fff;
  padding: 16px;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  margin-bottom: 20px;
  text-align: left;
}

.upload-card {
  background-color: #fff;
  border-radius: 16px;
  padding: 40px 20px;
  width: 90%;
  margin: 30px auto;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  border: 2px dashed #1989fa;
  transition: all 0.2s ease;
}

.upload-card:active {
  transform: scale(0.98);
}

.upload-text {
  margin-top: 12px;
  font-size: 18px;
  font-weight: 500;
  color: #1989fa;
}

.upload-tip {
  margin-top: 4px;
  font-size: 13px;
  color: #888;
}

.uploading {
  margin-top: 24px;
}

.upload-result {
  margin-top: 16px;
}
.form-card .van-field__label {
  font-size: 18px;
}
.form-card .van-field__control {
  font-size: 18px;
}
.upload-card {
  padding: 48px 24px;
}
.title {
  font-size: 40px;
}
</style>
