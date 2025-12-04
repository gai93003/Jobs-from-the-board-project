import bcrypt from "bcrypt";
import { pool } from "../DB/db.js";

//Create a new user in DB
async function signup(full_name,email,password,user_role,description,account_status,mentor_id){
    //Create Hash password
  const password_hash = await bcrypt.hash(password, 10);

  // Insert new user to DB
  const result = await pool.query(
    `INSERT INTO users 
    (full_name, email, password_hash, user_role, description, account_status, mentor_id)
     VALUES ($1,$2,$3,$4,$5,$6,$7)
     RETURNING user_id, full_name, email, user_role, description, account_status, mentor_id`,
    [full_name, email, password_hash, user_role, description, account_status, mentor_id]
  );
  return result.rows[0]
}

async function checkUniqEmail(email){
    // Check email uniqueness
    const emailCheck = await pool.query(
        "SELECT * FROM users WHERE email = $1",
        [email]
    );

    return emailCheck.rows.length > 0; // true if exists
}

//Show users list from DB
async function usersList(){
    const usersList = await pool.query(
        `SELECT * FROM users`
    );
    return usersList.rows
}

//Get user by email for login
async function getUserByEmail(email) {
    const result = await pool.query(
        "SELECT * FROM users WHERE email = $1",
        [email]
    );
    return result.rows[0]; // return user or undefined
}

export{signup, checkUniqEmail, usersList, getUserByEmail}
