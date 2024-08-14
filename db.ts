import { Pool } from 'pg';
import { UserEntity, UserPayload } from './payload';

const connectionString =
  'postgresql://postgres:KlPenbmYrZTbURLOaGQUDfSteyjOJXmR@roundhouse.proxy.rlwy.net:27193/railway';

// Создание пула соединений
const pool = new Pool({
  connectionString: connectionString,
});

export const findOrCreateUser = async (
  data: UserPayload
): Promise<UserEntity> => {
  const query = `
    WITH ins AS (
  INSERT INTO users_bo (user_id, first_name, last_name, username)
  VALUES ($1, $2, $3, $4)
  ON CONFLICT (user_id) DO NOTHING
  RETURNING user_id, first_name, last_name, username, duel_rate, total_answers, correct_answers
)
SELECT user_id, first_name, last_name, username, duel_rate, total_answers, correct_answers
FROM ins
UNION ALL
SELECT user_id, first_name, last_name, username, duel_rate, total_answers, correct_answers
FROM users_bo
WHERE user_id = $1
LIMIT 1;
  `;
  const values = [data.id, data.first_name, data.last_name, data.username];
  const res = await pool.query(query, values);
  return res.rows[0];
};

export const increaseAnswersCount = async (
  data: UserPayload,
  isWin = false
) => {
  const correct_answers = Number(isWin);

  const query = `
		UPDATE users_bo
		SET total_answers = total_answers + 1, correct_answers = correct_answers + $2
		WHERE user_id = $1
		RETURNING user_id, first_name, last_name, username;
	`;
  const values = [data.id, correct_answers];
  let res = await pool.query(query, values);

  if (res.rows.length === 0) {
    await findOrCreateUser(data);
    res = await pool.query(query, values);
  }

  const rateUpdate = isWin ? 25 : -25;

  await updateDuelRate(data, rateUpdate);

  return res.rows[0];
};

export const updateDuelRate = async (data: UserPayload, rate: number) => {
  const query = `
		UPDATE users_bo
		SET duel_rate = duel_rate + $2
		WHERE user_id = $1
		RETURNING user_id, first_name, last_name, username;
	`;
  const values = [data.id, rate];
  let res = await pool.query(query, values);

  if (res.rows.length === 0) {
    await findOrCreateUser(data);
    res = await pool.query(query, values);
  }

  return res.rows[0];
};

// Update the duel rate for a user

const isUserExist = async (userId) => {
  const query = `
    SELECT user_id
    FROM users_bo
    WHERE user_id = $1;
  `;
  const values = [userId];
  const res = await pool.query(query, values);
  return res.rows.length > 0;
};

export const getUser = async (data: Partial<UserPayload>) => {
  const query = `
    SELECT user_id, first_name, last_name, username
    FROM users_bo
    WHERE user_id = $1;
  `;
  const values = [data.id];
  const res = await pool.query(query, values);

  return res.rows[0];
};
