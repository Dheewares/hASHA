import { config } from "dotenv";
import mysql from "mysql2";
config();

const db = mysql.createConnection({
  host: process.env.HOST,
  user: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE,
});

export default db;
