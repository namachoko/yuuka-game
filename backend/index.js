// index.js

require('dotenv').config();
console.log('✅ Loaded DATABASE_URL:', process.env.DATABASE_URL);

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

// API: GET /status → 現在の満腹度や最終給餌時刻を取得
app.get('/status', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM yuuka_status LIMIT 1');
    res.json(result.rows[0]);
  } catch (err) {
    console.error('❌ Error fetching status:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// API: GET /logs → 給餌ログを一覧取得
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

// API: POST /feed → 給餌（満腹度更新＆ログ追加）
app.post('/feed', async (req, res) => {
  const { method, note } = req.body;
  try {
    await pool.query('BEGIN');

    // 満腹度を100に戻す（簡易仕様）
    const updateStatusQuery = `
      UPDATE yuuka_status
      SET fullness = 100,
          last_fed_at = CURRENT_TIMESTAMP,
          updated_at = CURRENT_TIMESTAMP
      WHERE status_id = 1
    `;
    await pool.query(updateStatusQuery);

    // ログ追加
    const insertLogQuery = `
      INSERT INTO feed_log (method, note)
      VALUES ($1, $2)
      RETURNING *
    `;
    const result = await pool.query(insertLogQuery, [method || null, note || null]);

    await pool.query('COMMIT');
    res.status(201).json(result.rows[0]);
  } catch (err) {
    await pool.query('ROLLBACK');
    console.error('❌ Error during feeding:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.listen(port, () => {
  console.log(`🚀 Server is running on http://localhost:${port}`);
});
