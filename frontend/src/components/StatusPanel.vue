<template>
  <div class="status-panel">
    <div class="character-area">
      <div class="speech-bubble">{{ speechText }}</div>
      <img src="./yuuka.png" class="yuuka-img" alt="ゆうかちゃん" />
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

const status = ref(null)

const fetchStatus = async () => {
  try {
    const res = await axios.get('http://localhost:3001/status')
    status.value = res.data
  } catch (err) {
    console.error('❌ Error fetching status:', err)
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

.character-area {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 1.2rem;
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
