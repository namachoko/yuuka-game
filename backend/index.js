// index.js

require('dotenv').config();

const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');

const app = express();
const port = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

// 食事ごとの満腹度回復量
const FOOD_RESTORE = {
  '豚バラ':      40,
  '家系ラーメン': 60,
  'ビール':      20,
};

// 満腹度の減少設定（10分ごとに1ポイント減少 = 約16.7時間で0になる）
const DECAY_INTERVAL_MS = 10 * 60 * 1000;
const DECAY_AMOUNT = 1;

setInterval(async () => {
  try {
    await pool.query(`
      UPDATE yuuka_status
      SET fullness = GREATEST(0, fullness - $1),
          updated_at = CURRENT_TIMESTAMP
      WHERE status_id = 1 AND fullness > 0
    `, [DECAY_AMOUNT]);
  } catch (err) {
    console.error('❌ Decay error:', err);
  }
}, DECAY_INTERVAL_MS);

// API: GET /status
app.get('/status', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM yuuka_status LIMIT 1');
    res.json(result.rows[0]);
  } catch (err) {
    console.error('❌ Error fetching status:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// API: GET /logs
app.get('/logs', async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM feed_log ORDER BY created_at DESC LIMIT 20'
    );
    res.json(result.rows);
  } catch (err) {
    console.error('❌ Error fetching logs:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// API: POST /feed
app.post('/feed', async (req, res) => {
  const { method, note } = req.body;
  const restore = FOOD_RESTORE[method] || 30;

  try {
    await pool.query('BEGIN');

    // 現在のstreakを取得
    const current = await pool.query(
      'SELECT streak, last_streak_date FROM yuuka_status WHERE status_id = 1'
    );
    const { streak, last_streak_date } = current.rows[0];

    // ストリーク計算（日本時間基準）
    const now = new Date();
    const todayJST = new Date(now.toLocaleString('en-US', { timeZone: 'Asia/Tokyo' }));
    todayJST.setHours(0, 0, 0, 0);

    const yesterdayJST = new Date(todayJST);
    yesterdayJST.setDate(yesterdayJST.getDate() - 1);

    let newStreak = 1;
    if (last_streak_date) {
      const lastDate = new Date(last_streak_date);
      lastDate.setHours(0, 0, 0, 0);
      if (lastDate.getTime() === todayJST.getTime()) {
        newStreak = streak; // 今日は既にカウント済み
      } else if (lastDate.getTime() === yesterdayJST.getTime()) {
        newStreak = streak + 1; // 連続中
      } else {
        newStreak = 1; // 途切れリセット
      }
    }

    // 満腹度を回復（上限100）+ streak更新
    await pool.query(`
      UPDATE yuuka_status
      SET fullness = LEAST(100, fullness + $1),
          last_fed_at = CURRENT_TIMESTAMP,
          updated_at = CURRENT_TIMESTAMP,
          streak = $2,
          last_streak_date = CURRENT_DATE
      WHERE status_id = 1
    `, [restore, newStreak]);

    // ログ追加
    const result = await pool.query(`
      INSERT INTO feed_log (method, note)
      VALUES ($1, $2)
      RETURNING *
    `, [method || null, note || null]);

    await pool.query('COMMIT');
    res.status(201).json({ ...result.rows[0], restore, streak: newStreak });
  } catch (err) {
    await pool.query('ROLLBACK');
    console.error('❌ Error during feeding:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.listen(port, () => {
  console.log(`🚀 Server is running on http://localhost:${port}`);
});
