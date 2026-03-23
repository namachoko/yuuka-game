<template>
  <div id="app">
    <h1>ゆうかちゃんへの餌やり</h1>
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


<style scoped>
#app {
  max-width: 600px;
  margin: 2rem auto;
  font-family: sans-serif;
  text-align: center;
}
</style>
