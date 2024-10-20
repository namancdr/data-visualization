import sqlite3 from 'sqlite3';
import { open } from 'sqlite';

let db;

async function getDb() {
  if (!db) {
    db = await open({
      filename: './analytics.db',
      driver: sqlite3.Database
    });
  }
  return db;
}



export async function createUser(email: string, password: string) {
  const db = await getDb();
  await db.run('INSERT INTO users (email, password) VALUES (?, ?)', [email, password]);
}

export async function getUserByEmail(email: string) {
  const db = await getDb();
  return db.get('SELECT * FROM users WHERE email = ?', [email]);
}

export async function getFilteredData(ageGroup: string, gender: string, startDate: Date | string | null, endDate: Date | string | null) {
  const db = await getDb();
  let query = 'SELECT * FROM analytics_data WHERE 1=1';
  const params = [];

  if (ageGroup !== 'all') {
    query += ' AND age = ?';
    params.push(ageGroup);
  }

  if (gender !== 'all') {
    query += ' AND gender = ?';
    params.push(gender);
  }

  if (startDate) {
    query += ' AND day >= ?';
    params.push(formatDate(startDate));
  }

  if (endDate) {
    query += ' AND day <= ?';
    params.push(formatDate(endDate));
  }

  console.log('filters', params)

  return db.all(query, params);
}

function formatDate(date: any): string {
  if (!date) return '';
  const [year, month, day] = date.split('T')[0].split('-');
  return `${day}/${month}/${year}`;
}
