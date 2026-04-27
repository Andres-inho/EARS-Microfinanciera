import mysql from 'mysql2/promise';
import detoenv from 'dotenv';

detoenv.config();

export const EARS_ConexionDb = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME
});