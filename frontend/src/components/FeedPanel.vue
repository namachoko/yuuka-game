<template>
    <div class="feed-panel">
      <h2>🍽️ ゆうかちゃんにごはんをあげよう</h2>
  
      <div>
        <label>🍱 食事はどれにする？</label>
        <select v-model="method">
          <option disabled value="">選んでね</option>
          <option value="豚バラ">豚バラ</option>
          <option value="家系ラーメン">家系ラーメン</option>
          <option value="ビール">ビール</option>
        </select>
      </div>
  
      <div>
        <label>📝 コメント（任意）</label>
        <input type="text" v-model="note" placeholder="どんな様子？" />
      </div>
  
      <button @click="feed" :disabled="!method">🐾 あげる</button>
    </div>
  </template>
  
  <script setup>
  import { ref } from 'vue'
  import axios from 'axios'

  const emit = defineEmits(['feedSuccess'])

  const method = ref('')
  const note = ref('')

  const feed = async () => {
    try {
        await axios.post('http://localhost:3001/feed', {
        method: method.value,
        note: note.value,
      })
      alert(`ゆうかちゃんに ${method.value} をあげました！`)
      method.value = ''
      note.value = ''
      emit('feedSuccess')
    } catch (err) {
      console.error('❌ Error feeding:', err)
      alert('エラーが発生しました')
    }
  }
  </script>
  
  <style scoped>
  .feed-panel {
    border: 1px solid #ccc;
    padding: 1rem;
    border-radius: 12px;
    max-width: 400px;
    margin: auto;
  }
  label {
    display: block;
    margin-top: 1rem;
  }
  button {
    margin-top: 1.5rem;
    padding: 0.5rem 1rem;
  }
  </style>