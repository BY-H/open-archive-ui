<template>
  <div class="page">

    <!-- 吸顶标题 -->
    <div class="sticky-header">
      <h2 class="title">系统统计</h2>
    </div>

    <!-- 内容卡片 -->
    <div class="stat-list">

      <!-- 登录次数 -->
      <van-card class="stat-card">
        <template #title>
          <div class="stat-title">总登录次数</div>
        </template>
        <template #desc>
          <div class="stat-value">{{ loginCount }}</div>
        </template>
      </van-card>

      <!-- 下载次数 -->
      <van-card class="stat-card">
        <template #title>
          <div class="stat-title">档案总下载次数</div>
        </template>
        <template #desc>
          <div class="stat-value">{{ downloadCount }}</div>
        </template>
      </van-card>

      <!-- 总评分（平均分） -->
      <van-card class="stat-card">
        <template #title>
          <div class="stat-title">系统平均评分</div>
        </template>
        <template #desc>
          <div class="stat-value">
            <span>{{ averageRating }}</span>
          </div>
        </template>
      </van-card>

    </div>

    <div v-if="loading" class="loading">
      <van-loading size="24px">加载中...</van-loading>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref } from "vue";
import { showToast } from "vant";
import request from "@/utils/request";

const loginCount = ref(0);
const downloadCount = ref(0);
const averageRating = ref(0);

const loading = ref(true);

/** 获取登录次数 */
const fetchLoginCount = async () => {
  const res = await request({
    url: "/login_stat",
    method: "get",
  });
  loginCount.value = res.count || 0;
};

/** 获取总下载次数 */
const fetchDownloadCount = async () => {
  const res = await request({
    url: "/archives/download_stat",
    method: "get",
  });
  downloadCount.value = res.total_download_count || 0;
};

/** 获取总评分（平均分） */
const fetchAverageRating = async () => {
  const res = await request({
    url: "/ratings/average",
    method: "get",
  });
  averageRating.value = res.average || 0;
};

onMounted(async () => {
  try {
    await Promise.all([
      fetchLoginCount(),
      fetchDownloadCount(),
      fetchAverageRating()
    ]);
  } catch (e) {
    showToast("加载统计失败");
  }
  loading.value = false;
});
</script>

<style scoped>
.page {
  padding: 16px;
  margin-bottom: 60px;
  background: #f8f8f8;
  min-height: 100vh;
}

.sticky-header {
  position: sticky;
  top: 0;
  z-index: 999;
  background: #f8f8f8;
  padding-bottom: 10px;
}

/* 标题 */
.title {
  text-align: center;
  font-size: 48px;
  font-weight: 600;
  padding: 10px 0;
  margin: 0;
}

/* 统计卡片样式 */
.stat-list {
  margin-top: 20px;
}

.stat-card {
  margin-bottom: 16px;
  border-radius: 12px;
}

.stat-title {
  font-size: 32px;
  font-weight: 600;
}

.stat-value {
  font-size: 40px;
  color: #1989fa;
  font-weight: bold;
  padding-top: 10px;
}

.loading {
  margin-top: 40px;
  text-align: center;
}
</style>
