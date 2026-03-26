<template>
  <div class="feed-log-list">
    <h2>履歴 📖</h2>
    <ul v-if="logs.length > 0">
      <li v-for="log in logs" :key="log.log_id">
        <span class="dot"></span>
        <div class="log-body">
          <span class="log-time">{{ formatTime(log.created_at) }}</span>
          <span class="log-method">{{ foodEmoji(log.method) }} {{ log.method ?? '不明' }}</span>
          <span v-if="log.note" class="log-note">{{ log.note }}</span>
        </div>
      </li>
    </ul>
    <p v-else class="empty">まだ記録がありません</p>
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
  return new Date(isoString).toLocaleString('ja-JP', {
    month: 'numeric', day: 'numeric',
    hour: '2-digit', minute: '2-digit'
  })
}

const emojiMap = { '豚バラ': '🥩', '家系ラーメン': '🍜', 'ビール': '🍺' }
const foodEmoji = (name) => emojiMap[name] ?? '🍽️'
</script>

<style scoped>
.feed-log-list {
  background: white;
  border-radius: 24px;
  padding: 1.5rem;
  box-shadow: 0 4px 20px rgba(255, 130, 50, 0.12);
}

h2 {
  font-size: 1rem;
  color: #FF7020;
  font-weight: bold;
  margin-bottom: 1rem;
  text-align: center;
}

ul {
  list-style: none;
  padding: 0;
}

li {
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
  padding: 0.6rem 0;
  border-bottom: 1px solid #F5F0EB;
}

li:last-child {
  border-bottom: none;
}

.dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #FFB347;
  flex-shrink: 0;
  margin-top: 0.35rem;
}

.log-body {
  display: flex;
  flex-wrap: wrap;
  align-items: baseline;
  gap: 0.4rem;
  flex: 1;
}

.log-time {
  font-size: 0.75rem;
  color: #BBB;
  flex-shrink: 0;
}

.log-method {
  font-size: 0.9rem;
  font-weight: bold;
  color: #444;
}

.log-note {
  font-size: 0.8rem;
  color: #888;
}

.empty {
  text-align: center;
  color: #CCC;
  font-size: 0.9rem;
  padding: 1rem 0;
}
</style>
