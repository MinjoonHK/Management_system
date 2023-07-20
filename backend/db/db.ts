const mysql = require("mysql2/promise");

const pool = mysql.createPool({
  host: "localhost",
  user: "minjoon2",
  password: "Minjun369!",
  database: "electrictracker",
  waitForConnections: true,
  connectionLimit: 10,
  maxIdle: 10,
  idleTimeout: 60000,
  queueLimit: 0,
  enableKeepAlive: true,
  keepAliveInitialDelay: 0,
});

export { pool };
