<template>
    <div class="status-panel">
      <h2>🧡 ゆうかちゃんの今のようす</h2>
      <p>満腹度：<strong>{{ status?.fullness ?? '読み込み中...' }}</strong></p>
      <p>最後にごはんをあげた時間：<strong>{{ formattedTime }}</strong></p>
      <button @click="fetchStatus">🔄 更新</button>
    </div>
  </template>
  
  <script setup>
  import { ref, computed, onMounted } from 'vue'
  import axios from 'axios'
  
  const status = ref(null)
  
  const fetchStatus = async () => {
    try {
      const res = await axios.get('http://localhost:3001/status')
      status.value = res.data
    } catch (err) {
      console.error('❌ Error fetching status:', err)
    }
  }
  
  // 初回読み込み時に呼ぶ
  onMounted(fetchStatus)
  
  const formattedTime = computed(() => {
    if (!status.value?.last_fed_at) return '---'
    const date = new Date(status.value.last_fed_at)
    return date.toLocaleString('ja-JP')
  })

  defineExpose({ fetchStatus })
  </script>
  
  <style scoped>
  .status-panel {
    border: 1px solid #ccc;
    padding: 1rem;
    margin: 2rem auto;
    border-radius: 12px;
    max-width: 400px;
  }
  button {
    margin-top: 1rem;
  }
  </style>
  