<template>
  <div class="page">

    <!-- 吸顶标题 -->
    <div class="sticky-header">
      <h2 class="title">档案查询</h2>
    </div>

    <!-- 查询栏 -->
    <van-search
      v-model="keyword"
      show-action
      placeholder="请输入档案关键字"
      @search="onSearch"
      class="search-bar"
    >
      <template #action>
        <van-button size="small" type="primary" @click="onSearch">查询</van-button>
      </template>
    </van-search>

    <!-- 数据列表 -->
    <van-list
      v-model:loading="loading"
      :finished="finished"
      finished-text="已经到底了"
      @load="loadMore"
      offset="50"
    >
      <van-card
        v-for="item in results"
        :key="item.ID"
        :title="item.Title"
      >
        <template #desc>
          <div class="desc-box">
            <p>档案号：{{ item.ArchiveNo }}</p>
            <p>形成时间：{{ item.FormTime }}</p>
            <p>保管期限：{{ item.RetentionPeriod }}</p>
            <p v-if="item.Description">说明：{{ item.Description }}</p>
          </div>
        </template>

        <template #footer>
          <van-button
            v-if="item.FilePath"
            size="small"
            type="primary"
            @click="handleDownload(item)"
          >
            下载文件
          </van-button>
        </template>
      </van-card>
    </van-list>

    <div v-if="!loading && results.length === 0" class="empty">
      <van-empty description="暂无数据" />
    </div>

  </div>
</template>

<script setup>
import { ref } from 'vue'
import { showToast } from 'vant'
import request from '@/utils/request'
import { downloadArchive } from '@/api/archives'

const keyword = ref('')
const loading = ref(false)
const finished = ref(false)
const results = ref([])

const page = ref(1)
const pageSize = 5

// 查询接口
const fetchArchives = async () => {
  const res = await request({
    url: '/archives',
    method: 'get',
    params: {
      page: page.value,
      page_size: pageSize,
      keyword: keyword.value
    }
  })
  return res
}

const onSearch = async () => {
  page.value = 1
  results.value = []
  finished.value = false

  loadMore()
}

const loadMore = async () => {
  loading.value = true

  try {
    const res = await fetchArchives()

    results.value.push(...res.data)

    const total = res.total

    if (results.value.length >= total) {
      finished.value = true
    } else {
      page.value++
    }
  } catch (err) {
    showToast('加载失败')
  }

  loading.value = false
}

const handleDownload = async (archive) => {
  try {
    const res = await downloadArchive({ id: archive.ID });

    // 创建 blob URL
    const url = window.URL.createObjectURL(new Blob([res]));
    const link = document.createElement('a');
    link.href = url;

    // 设置下载文件名，可以从 archive.Title 或后端返回的 filename
    const ext = archive.FilePath.split('.').pop(); // 获取后缀
    link.setAttribute('download', `${archive.Title}.${ext}`);

    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(url);
  } catch (err) {
    showToast('下载失败');
    console.error(err);
  }
}

</script>

<style scoped>
.page {
  padding: 16px;
  margin-bottom: 60px;
  background-color: #f8f8f8;
  min-height: 100vh;
}

/* 吸顶容器 */
.sticky-header {
  position: sticky;
  top: 0;
  z-index: 999;
  background: #f8f8f8;
  padding-bottom: 10px;
}

/* 标题大字号手机友好 */
.title {
  text-align: center;
  font-size: 48px;
  font-weight: 600;
  padding: 10px 0;
  margin: 0;
}

/* search 也跟随吸顶 */
.search-bar {
  position: sticky;
  top: 70px; /* 标题高度 */
  z-index: 998;
  background: #f8f8f8;
}

.empty {
  margin-top: 40px;
}
</style>
