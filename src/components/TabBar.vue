<template>
  <van-tabbar v-model="active" route>
    <van-tabbar-item replace to="/query" icon="search">档案查询</van-tabbar-item>
    <van-tabbar-item
      v-if="isAdmin"
      replace
      to="/import"
      icon="guide-o"
    >
      档案导入
    </van-tabbar-item>
    <van-tabbar-item
      v-if="isAdmin"
      replace
      to="/batch_import"
      icon="link-o"
    >
      批量导入
    </van-tabbar-item>
    <van-tabbar-item
      v-if="isAdmin"
      replace
      to="/stat"
      icon="chart-trending-o"
    >
      统计
    </van-tabbar-item>
  </van-tabbar>
</template>

<script setup>
import { ref } from 'vue'

// 当前激活的 tab
const active = ref(0)

// 判断是否管理员
const role = localStorage.getItem('role')
const isAdmin = ref(role === 'admin')
</script>

<style scoped>
.van-tabbar {
  position: fixed;
  bottom: 0;
  width: 100%;
  height: 100px;
  .van-tabbar-item {
    font-size: 22px;
  }
}
</style>
