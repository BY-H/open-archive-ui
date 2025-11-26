<template>
  <div class="page">

    <!-- 吸顶标题 -->
    <div class="sticky-header">
      <h2 class="title">系统统计</h2>
    </div>

    <!-- ★ 统计卡片 -->
    <div class="stat-card" :style="getCardStyle('#66bb6a')">
      <div class="left">
        <div class="stat-title">总登录次数</div>
        <div class="stat-value">{{ animatedLogin }}</div>
      </div>
      <div class="icon-box">
        <van-icon name="user-o" size="46px" color="white" />
      </div>
    </div>

    <div class="stat-card" :style="getCardStyle('#42a5f5')">
      <div class="left">
        <div class="stat-title">档案总下载次数</div>
        <div class="stat-value">{{ animatedDownload }}</div>
      </div>
      <div class="icon-box">
        <van-icon name="down" size="46px" color="white" />
      </div>
    </div>

    <div class="stat-card" :style="getCardStyle('#ffa726')">
      <div class="left">
        <div class="stat-title">系统平均评分</div>
        <div class="stat-value">{{ animatedRating }}</div>
      </div>
      <div class="icon-box">
        <van-icon name="star" size="46px" color="white" />
      </div>
    </div>

    <div v-if="loading" class="loading">
      <van-loading size="24px">加载中...</van-loading>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { showToast } from "vant";
import request from "@/utils/request";

/* ---------------------------
   统计数据
--------------------------- */
const loginCount = ref(0);
const downloadCount = ref(0);
const averageRating = ref(0);

// 动画显示数字
const animatedLogin = ref(0);
const animatedDownload = ref(0);
const animatedRating = ref(0);

const loading = ref(true);

/* ---------------------------
   动画函数
--------------------------- */
function animate(target, endValue, duration = 600) {
  const step = 16; // 60 FPS
  const increment = Math.ceil(endValue / (duration / step));
  let current = 0;

  const timer = setInterval(() => {
    current += increment;
    if (current >= endValue) {
      current = endValue;
      clearInterval(timer);
    }
    target.value = current;
  }, step);
}

/* ---------------------------
   背景渐变生成
--------------------------- */
function getCardStyle(color) {
  return {
    background: `linear-gradient(135deg, ${color}, #4f9dfa)`,
  };
}

/* ---------------------------
   请求后端接口
--------------------------- */
const fetchLoginCount = () =>
  request({ url: "/login_stat", method: "get" }).then((res) => {
    loginCount.value = res.count || 0;
  });

const fetchDownloadCount = () =>
  request({ url: "/archives/download_stat", method: "get" }).then((res) => {
    downloadCount.value = res.total_download_count || 0;
  });

const fetchAverageRating = () =>
  request({ url: "/ratings/average", method: "get" }).then((res) => {
    averageRating.value = res.average || 0;
  });

/* ---------------------------
   生命周期
--------------------------- */
onMounted(async () => {
  try {
    await Promise.all([
      fetchLoginCount(),
      fetchDownloadCount(),
      fetchAverageRating(),
    ]);

    // 使用动画更新界面数字
    animate(animatedLogin, loginCount.value);
    animate(animatedDownload, downloadCount.value);
    animate(animatedRating, averageRating.value);
  } catch (e) {
    showToast("加载统计失败");
  }

  loading.value = false;
});
</script>

<style scoped>
/* 页面结构 */
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

.title {
  text-align: center;
  font-size: 48px;
  font-weight: 600;
  padding: 10px 0;
  margin: 0;
}

/* 统计卡片 */
.stat-card {
  display: flex;
  justify-content: space-between;
  align-items: center;

  padding: 24px;
  border-radius: 18px;
  color: white;
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.12);
  margin-bottom: 22px;
}

.stat-title {
  font-size: 32px;
  opacity: 0.9;
}

.stat-value {
  font-size: 48px;
  font-weight: bold;
  margin-top: 6px;
}

.icon-box {
  width: 60px;
  height: 60px;
  background: rgba(255, 255, 255, 0.28);
  border-radius: 16px;

  display: flex;
  justify-content: center;
  align-items: center;
}

.loading {
  margin-top: 40px;
  text-align: center;
}
</style>
