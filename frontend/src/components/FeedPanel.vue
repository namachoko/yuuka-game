<template>
  <div class="feed-panel">
    <h2>ごはんをあげよう 🍴</h2>

    <div class="food-options">
      <button
        v-for="food in foods"
        :key="food.name"
        class="food-btn"
        :class="{ selected: method === food.name }"
        @click="method = food.name"
      >
        <span class="food-emoji">{{ food.emoji }}</span>
        <span class="food-name">{{ food.name }}</span>
      </button>
    </div>

    <input
      class="note-input"
      type="text"
      v-model="note"
      placeholder="ひとこと（任意）"
    />

    <transition name="fade">
      <div v-if="feedMessage" class="feed-message">{{ feedMessage }}</div>
    </transition>

    <button class="feed-btn" @click="feed" :disabled="!method || loading">
      {{ loading ? 'あげてる…' : '💝 あげる' }}
    </button>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import axios from 'axios'

const emit = defineEmits(['feedSuccess'])

const foods = [
  { name: '豚バラ',     emoji: '🥩' },
  { name: '家系ラーメン', emoji: '🍜' },
  { name: 'ビール',     emoji: '🍺' },
]

const method = ref('')
const note = ref('')
const loading = ref(false)
const feedMessage = ref('')

const feed = async () => {
  loading.value = true
  feedMessage.value = ''
  try {
    await axios.post('http://localhost:3001/feed', {
      method: method.value,
      note: note.value,
    })
    feedMessage.value = `ゆうかちゃん、${method.value} を食べてくれた！ 😊`
    method.value = ''
    note.value = ''
    emit('feedSuccess')
  } catch (err) {
    console.error('❌ Error feeding:', err)
    feedMessage.value = 'エラーが発生しました…'
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.feed-panel {
  background: white;
  border-radius: 24px;
  padding: 1.5rem;
  margin-bottom: 1rem;
  box-shadow: 0 4px 20px rgba(255, 130, 50, 0.12);
}

h2 {
  font-size: 1rem;
  color: #FF7020;
  font-weight: bold;
  margin-bottom: 1rem;
  text-align: center;
}

.food-options {
  display: flex;
  gap: 0.6rem;
  justify-content: center;
  margin-bottom: 1rem;
  flex-wrap: wrap;
}

.food-btn {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.25rem;
  padding: 0.6rem 1rem;
  border: 2px solid #EEE;
  border-radius: 16px;
  background: #FAFAFA;
  cursor: pointer;
  transition: all 0.15s ease;
  font-size: 0.85rem;
  color: #555;
  min-width: 80px;
}

.food-btn:hover {
  border-color: #FFB347;
  background: #FFF8F0;
}

.food-btn.selected {
  border-color: #FF7A30;
  background: #FFF2E5;
  color: #FF7A30;
  font-weight: bold;
}

.food-emoji {
  font-size: 1.5rem;
}

.note-input {
  width: 100%;
  padding: 0.6rem 1rem;
  border: 2px solid #EEE;
  border-radius: 12px;
  font-size: 0.9rem;
  outline: none;
  transition: border-color 0.15s;
  margin-bottom: 0.8rem;
  font-family: inherit;
}

.note-input:focus {
  border-color: #FFB347;
}

.feed-message {
  text-align: center;
  font-size: 0.88rem;
  color: #FF7A30;
  font-weight: bold;
  margin-bottom: 0.8rem;
  padding: 0.5rem;
  background: #FFF4E0;
  border-radius: 10px;
}

.feed-btn {
  width: 100%;
  padding: 0.85rem;
  background: linear-gradient(135deg, #FF7A30, #FFB347);
  color: white;
  font-size: 1.05rem;
  font-weight: bold;
  border: none;
  border-radius: 16px;
  cursor: pointer;
  transition: opacity 0.2s, transform 0.1s;
  letter-spacing: 0.05em;
  font-family: inherit;
}

.feed-btn:hover:not(:disabled) {
  opacity: 0.92;
  transform: translateY(-1px);
}

.feed-btn:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

.fade-enter-active, .fade-leave-active { transition: opacity 0.3s; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
</style>
