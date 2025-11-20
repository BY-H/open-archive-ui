<template>
  <div class="app-container">
    <router-view />
    <TabBar v-if="showTabBar" />
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import TabBar from './components/TabBar.vue'

const route = useRoute()
const showTabBar = computed(() => route.path !== '/login')
</script>

<style>
html, body, #app {
  height: 100%;
  margin: 0;
  padding: 0;
}

.app-container {
  min-height: 100vh;
  background-color: #f5f6fa;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}
</style>
