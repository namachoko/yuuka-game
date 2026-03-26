<template>
  <div class="status-panel">
    <div v-if="error" class="error-banner">
      接続エラー。バックエンドが起動しているか確認してください。
    </div>

    <div class="character-area">
      <div class="speech-bubble">{{ speechText }}</div>
      <img
        src="./yuuka.png"
        class="yuuka-img"
        :class="hungerClass"
        alt="ゆうかちゃん"
      />
    </div>

    <div v-if="status?.streak > 0" class="streak-badge">
      {{ streakEmoji }} {{ status.streak }}日連続ごはん中！
    </div>

    <div class="fullness-section">
      <div class="fullness-bar-wrap">
        <div
          class="fullness-bar"
          :class="barClass"
          :style="{ width: (status?.fullness ?? 0) + '%' }"
        ></div>
      </div>
      <span class="fullness-num">{{ status?.fullness ?? '--' }}%</span>
    </div>

    <p class="last-fed-text">最後のごはん：{{ formattedTime }}</p>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import axios from 'axios'

const API_URL = process.env.VUE_APP_API_URL || 'http://localhost:3001'

const status = ref(null)
const error = ref(false)

const fetchStatus = async () => {
  try {
    const res = await axios.get(`${API_URL}/status`)
    status.value = res.data
    error.value = false
  } catch (err) {
    console.error('❌ Error fetching status:', err)
    error.value = true
  }
}

onMounted(fetchStatus)

const formattedTime = computed(() => {
  if (!status.value?.last_fed_at) return '---'
  return new Date(status.value.last_fed_at).toLocaleString('ja-JP')
})

const speechText = computed(() => {
  const f = status.value?.fullness ?? 50
  if (f === 100) return 'お腹いっぱい！幸せ〜 💕'
  if (f >= 80)   return 'まだまだ元気だよ！😊'
  if (f >= 60)   return 'そろそろ何か食べたいかも… 🍴'
  if (f >= 40)   return 'お腹空いてきた… ごはんほしい 😢'
  if (f >= 20)   return 'お腹ペコペコ… 早く… 💦'
  if (f > 0)     return 'もう限界…たすけて… 😵'
  return '読み込み中…'
})

const barClass = computed(() => {
  const f = status.value?.fullness ?? 0
  if (f >= 70) return 'bar-full'
  if (f >= 40) return 'bar-mid'
  return 'bar-low'
})

const hungerClass = computed(() => {
  const f = status.value?.fullness ?? 100
  if (f >= 60) return ''
  if (f >= 30) return 'img-hungry'
  return 'img-starving'
})

const streakEmoji = computed(() => {
  const s = status.value?.streak ?? 0
  if (s >= 7) return '🔥🔥🔥'
  if (s >= 3) return '🔥🔥'
  return '🔥'
})

defineExpose({ fetchStatus })
</script>

<style scoped>
.status-panel {
  background: white;
  border-radius: 24px;
  padding: 1.5rem 1.5rem 1.2rem;
  margin-bottom: 1rem;
  box-shadow: 0 4px 20px rgba(255, 130, 50, 0.12);
}

.error-banner {
  background: #FFF0F0;
  border: 1px solid #FFAAAA;
  color: #CC3333;
  border-radius: 10px;
  padding: 0.5rem 0.75rem;
  font-size: 0.8rem;
  text-align: center;
  margin-bottom: 1rem;
}

.character-area {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 0.8rem;
}

.speech-bubble {
  position: relative;
  background: #FFF4E0;
  border: 2px solid #FFB347;
  border-radius: 20px;
  padding: 0.5rem 1.2rem;
  font-size: 0.95rem;
  font-weight: bold;
  color: #333;
  margin-bottom: 0.9rem;
  max-width: 260px;
  text-align: center;
}

.speech-bubble::before {
  content: '';
  position: absolute;
  bottom: -13px;
  left: 50%;
  transform: translateX(-50%);
  border: 9px solid transparent;
  border-top-color: #FFB347;
}

.speech-bubble::after {
  content: '';
  position: absolute;
  bottom: -10px;
  left: 50%;
  transform: translateX(-50%);
  border: 7px solid transparent;
  border-top-color: #FFF4E0;
}

.yuuka-img {
  width: 160px;
  height: 160px;
  object-fit: contain;
  border-radius: 16px;
  transition: filter 0.6s ease;
}

.img-hungry {
  filter: brightness(0.88) saturate(0.7);
}

.img-starving {
  filter: grayscale(0.5) brightness(0.78);
}

.streak-badge {
  text-align: center;
  font-size: 0.82rem;
  font-weight: bold;
  color: #FF7A30;
  background: #FFF4E0;
  border-radius: 20px;
  padding: 0.25rem 0.9rem;
  display: inline-block;
  margin: 0 auto 0.8rem;
  width: 100%;
}

.fullness-section {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 0.6rem;
}

.fullness-bar-wrap {
  flex: 1;
  height: 14px;
  background: #F0EDE8;
  border-radius: 8px;
  overflow: hidden;
}

.fullness-bar {
  height: 100%;
  border-radius: 8px;
  transition: width 0.6s cubic-bezier(0.4, 0, 0.2, 1);
}

.bar-full { background: linear-gradient(90deg, #FF7A30, #FFB347); }
.bar-mid  { background: linear-gradient(90deg, #F5C430, #FFE080); }
.bar-low  { background: linear-gradient(90deg, #E05050, #FF8888); }

.fullness-num {
  font-size: 0.95rem;
  font-weight: bold;
  color: #888;
  width: 40px;
  text-align: right;
  flex-shrink: 0;
}

.last-fed-text {
  font-size: 0.78rem;
  color: #BBB;
  text-align: center;
}
</style>
