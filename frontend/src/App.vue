<template>
  <div id="app">
    <h1>💕 ゆうかちゃん</h1>
    <StatusPanel ref="statusPanel" />
    <FeedPanel @feedSuccess="handleFeed" />
    <FeedLogList :logs="logs" />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'
import StatusPanel from './components/StatusPanel.vue'
import FeedPanel from './components/FeedPanel.vue'
import FeedLogList from './components/FeedLogList.vue'

const logs = ref([])
const statusPanel = ref(null)

const fetchLogs = async () => {
  const res = await axios.get('http://localhost:3001/logs')
  logs.value = res.data
}

const handleFeed = () => {
  fetchLogs()
  statusPanel.value?.fetchStatus()
}

onMounted(fetchLogs)
</script>

<style>
* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}
body {
  background: #FFF8F0;
  font-family: 'Hiragino Kaku Gothic ProN', 'Hiragino Sans', 'Noto Sans JP', sans-serif;
  color: #444;
}
</style>

<style scoped>
#app {
  max-width: 480px;
  margin: 0 auto;
  padding: 1.5rem 1rem 3rem;
}

h1 {
  font-size: 1.5rem;
  color: #FF7020;
  font-weight: bold;
  text-align: center;
  margin-bottom: 1.5rem;
  letter-spacing: 0.08em;
}
</style>
