import mysql from "mysql2/promise";

const connection = await mysql.createConnection(process.env.DATABASE_URL);
const [rows] = await connection.query("SHOW COLUMNS FROM orders");
console.log(JSON.stringify(rows, null, 2));
await connection.end();
