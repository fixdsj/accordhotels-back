import userSchema from "../models/user.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import {getDbConnection} from "../config/db.js";

export async function createUser(req, res) {
    const {email, pseudo, password, role} = req.body;
    const {error} = userSchema.validate(req.body);
    if (error) {
        return res.status(400).json({error: error.details[0].message});
    }
    // Verification if the user already exists
    try {
        const pool = await getDbConnection();
        const [result] = await pool.query("SELECT * FROM users WHERE email = ?", [email]);
        if (result.length > 0) {
            pool.close();
            return res.status(409).json({error: "A user already exists with this email."});
        }
    } catch (err) {
        console.error("Database error:", err);
        return res.status(500).json({error: err});
    }
    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const pool = await getDbConnection();
        const [result] = await pool.query(
            "INSERT INTO users (email, pseudo, password, role) VALUES (?, ?, ?, ?)",
            [email, pseudo, hashedPassword, role]
        );
        const userId = result.insertId;
        //Stockage de l'ID et du role de l'utilisateur dans le token
        const token = jwt.sign({userId: userId, role: role}, process.env.JWT_SECRET, {expiresIn: "1h"});
        res.status(201).json({
            message: "User created successfully.",
            userId,
            token,
        });
        pool.close();
    } catch (err) {
        console.error("Database error:", err);
        return res.status(500).json({error: err});
    }
}

export async function login(req, res) {
    const {email, password} = req.body;
    try {
        const pool = await getDbConnection();
        const [result] = await pool.query("SELECT * FROM users WHERE email = ?", [email]);
        if (result.length === 0) {
            return res.status(401).json({error: "Email ou mot de passe incorrect."});
        }
        const user = result[0];
        const passwordValid = await bcrypt.compare(password, user.password);
        if (!passwordValid) {
            return res.status(401).json({error: "Email ou mot de passe incorrect."});
        }
        //Stockage de l'ID et du role de l'utilisateur dans le token
        const token = jwt.sign({userId: user.userId, role: user.role}, process.env.JWT_SECRET, {expiresIn: "1h"});
        res.status(200).json({token});
        pool.close();
    } catch (err) {
        console.error("Database error:", err);
        res.status(500).json({error: err});
    }
}

export async function readAll(req, res) {
    //Verifier dans le token si l'utilisateur a le role employee
    const {role} = req.user;
    if (role !== "employee") {
        return res.status(403).json({error: "Non autorisé."});
    }
    const {email} = req.query;
    //Recherche de l'utilisateur par email
    try {
        const pool = await getDbConnection();
        const [result] = await pool.query("SELECT userId, email, pseudo, role FROM user WHERE email = ?", [email]);
        res.status(200).json(result);
        pool.close();


    } catch (err) {
        console.error("Database error:", err);
        res.status(500).json({error: err});
    }

}
