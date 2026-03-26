<template>
  <div id="app">
    <h1>💕 ゆうかちゃん</h1>
    <StatusPanel ref="statusPanel" />
    <FeedPanel @feedSuccess="handleFeed" />
    <FeedLogList :logs="logs" :error="logsError" />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'
import StatusPanel from './components/StatusPanel.vue'
import FeedPanel from './components/FeedPanel.vue'
import FeedLogList from './components/FeedLogList.vue'

const API_URL = process.env.VUE_APP_API_URL || 'http://localhost:3001'

const logs = ref([])
const logsError = ref(false)
const statusPanel = ref(null)

const fetchLogs = async () => {
  try {
    const res = await axios.get(`${API_URL}/logs`)
    logs.value = res.data
    logsError.value = false
  } catch (err) {
    console.error('❌ Error fetching logs:', err)
    logsError.value = true
  }
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
