import pool from '../config/database';

export const getDeviceDataInRange = async (device_id: string, from: string, to: string) => {
  const query = `
    SELECT *
    FROM "DeviceData"
    WHERE device_id = $1
      AND recorded_at BETWEEN $2 AND $3
    ORDER BY recorded_at ASC;
  `;
  const { rows } = await pool.query(query, [device_id, from, to]);
  return rows;
};

export const getLatestDeviceData = async (device_id: string) => {
  const query = `
    SELECT *
    FROM "DeviceData"
    WHERE device_id = $1
    ORDER BY recorded_at DESC
    LIMIT 1;
  `;
  const { rows } = await pool.query(query, [device_id]);
  return rows[0];
};
