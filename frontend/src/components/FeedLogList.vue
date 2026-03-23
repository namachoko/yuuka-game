<template>
  <div class="feed-log-list">
    <h2>📋 給餌ログ</h2>
    <ul v-if="logs.length > 0">
      <li v-for="log in logs" :key="log.id">
        <span class="time">{{ formatTime(log.created_at) }}</span>
        <span class="method">{{ log.method ?? '不明' }}</span>
        <span v-if="log.note" class="note">（{{ log.note }}）</span>
      </li>
    </ul>
    <p v-else>まだ記録がありません</p>
  </div>
</template>

<script setup>
defineProps({
  logs: {
    type: Array,
    default: () => []
  }
})

const formatTime = (isoString) => {
  if (!isoString) return '---'
  return new Date(isoString).toLocaleString('ja-JP')
}
</script>

<style scoped>
.feed-log-list {
  border: 1px solid #ccc;
  padding: 1rem;
  margin: 2rem auto;
  border-radius: 12px;
  max-width: 400px;
  text-align: left;
}
ul {
  list-style: none;
  padding: 0;
}
li {
  padding: 0.4rem 0;
  border-bottom: 1px solid #eee;
}
.time {
  color: #888;
  margin-right: 0.5rem;
  font-size: 0.85em;
}
.method {
  font-weight: bold;
}
.note {
  color: #555;
  margin-left: 0.5rem;
}
</style>
