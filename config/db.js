import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

let dbConfig = {
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT, 10), // Convert to integer
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
};

export async function getDbConnection() {
    try {
        const connection = await mysql.createConnection(dbConfig);
        console.log("Database connected.");
        return connection;
    } catch (error) {
        console.error("Database connection error:", error);
        return null;
    }
}
