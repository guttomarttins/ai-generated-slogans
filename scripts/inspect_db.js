const Database = require('better-sqlite3');
const path = require('path');
const db = new Database(path.join(__dirname, '..', 'data', 'app.db'));
console.log('Users:');
console.log(db.prepare('SELECT id, email, created_at FROM users').all());
console.log('Sessions:');
console.log(db.prepare('SELECT id, user_id, token, expires_at FROM sessions').all());
console.log('Slogans:');
console.log(db.prepare('SELECT id, user_id, prompt, slogan, created_at FROM slogans').all());
