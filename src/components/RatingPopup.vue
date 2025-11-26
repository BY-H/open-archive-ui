<template>
  <van-popup v-model:show="visible" round position="center" :style="{ width: '80%', padding: '20px' }">
    <div class="rating-container">

      <h3 class="title">给我们打个分吧</h3>
      <p class="desc">你的反馈能帮助我们做得更好</p>

      <div class="emoji-box">
        <span v-if="score === 0">🤔</span>
        <span v-else-if="score <= 2">😕</span>
        <span v-else-if="score === 3">😐</span>
        <span v-else-if="score === 4">🙂</span>
        <span v-else>😄</span>
      </div>

      <van-rate v-model="score" size="34" color="#ffd21e" void-color="#eee" />

      <van-button
        block
        round
        type="primary"
        class="submit-btn"
        :disabled="score === 0"
        @click="submitRating"
      >
        提交评分
      </van-button>

      <van-button
        block
        round
        type="default"
        class="close-btn"
        @click="close"
      >
        暂不评价
      </van-button>

    </div>
  </van-popup>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { sendRating } from "@/api/system";

const visible = ref(false);
const score = ref(0);

function shouldShow(probability = 0.5) {
  return Math.random() < probability;
}

function canShowAgain(days = 7) {
  const last = localStorage.getItem("rating_last");
  if (!last) return true;
  return Date.now() - Number(last) > days * 24 * 60 * 60 * 1000;
}

function markShown() {
  localStorage.setItem("rating_last", Date.now());
}

function close() {
  visible.value = false;
}

async function submitRating() {
  try {
    await sendRating({ score: score.value });
    visible.value = false;
  } catch (e) {
    console.log(e);
  }
}
onMounted(() => {
  const again = canShowAgain()
  const shouldShowed = shouldShow()
  if (again && shouldShowed) {
    visible.value = true;
    markShown();
  }
});
</script>

<style scoped>
.rating-container {
  text-align: center;
}

.title {
  font-size: 20px;
  font-weight: bold;
  margin-bottom: 6px;
}

.desc {
  color: #888;
  font-size: 14px;
  margin-bottom: 12px;
}

.emoji-box {
  font-size: 48px;
  margin: 10px 0;
}

.submit-btn {
  margin-top: 16px;
  background: linear-gradient(135deg, #ff9a44, #f55a00);
  border: none;
}

.close-btn {
  margin-top: 8px;
  color: #666;
}
</style>
