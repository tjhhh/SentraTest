require('dotenv').config();
const { Pool } = require('pg');

const p = new Pool({
  host: process.env.PGHOST,
  port: Number(process.env.PGPORT),
  user: process.env.PGUSER,
  password: process.env.PGPASSWORD,
  database: process.env.PGDATABASE,
});

console.log('Connecting to:', process.env.PGHOST + ':' + process.env.PGPORT + '/' + process.env.PGDATABASE);

p.query("INSERT INTO users (email, username, password_hash) VALUES ('testdebug@example.com', 'testdebug', 'hash123') RETURNING id")
  .then(r => {
    console.log('SUCCESS:', JSON.stringify(r.rows));
    p.end();
  })
  .catch(e => {
    console.error('FAIL:', e.message);
    console.error('PG code:', e.code);
    console.error('Detail:', e.detail);
    p.end();
  });
