const mysql = require('mysql2');

const pool = mysql.createPool({
  host: process.env.MYSQLHOST || process.env.DB_HOST,
  user: process.env.USUARIO_MYSQL || process.env.MYSQLUSER || process.env.DB_USER,
  password: process.env.CONTRASEÑA_DE_MYSQL || process.env.MYSQLPASSWORD || process.env.DB_PASSWORD,
  database: process.env.BASE_DE_DATOS_MYSQL || process.env.MYSQLDATABASE || process.env.DB_NAME,
  port: process.env.MYSQLPORT || process.env.DB_PORT || 3306,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Exportamos usando .promise() para que funcionen los 'await db.query()'
module.exports = pool.promise();