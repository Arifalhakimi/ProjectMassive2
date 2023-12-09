const express = require('express');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const query = require("../database");
const bcryptjs = require("bcryptjs");

const app = express();



// Gunakan cookie-parser untuk mengelola cookie
app.use(cookieParser());

const checkAuth = (req, res, next) => {
  if (req.session && req.session.user) {
    // Pengguna sudah login
    next();
  } else {
    // Pengguna belum login
    res.status(401).json("Unauthorized");
  }
};

async function register(req, res) {
  const { nama, email, password, confPassword } = req.body;

  if (
    nama === undefined ||
    nama === "" ||
    email === undefined ||
    email === "" ||
    password === undefined ||
    password === "" ||
    confPassword === undefined ||
    confPassword === ""
  )
    return res.status(400).json("Invalid data!");

  if (password !== confPassword) return res.status(400).json("Password not match!");

  try {
    // logic handling
    const isDuplicate = await query(
      `
        SELECT id_user FROM users WHERE email = ? 
    `,
      [email]
    );

    if (isDuplicate.length > 0) return res.status(400).json("User already exists!");

    const salt = await bcryptjs.genSalt(12);
    const hash = await bcryptjs.hash(password, salt);
    const role = "user";
    await query(
      `
        INSERT INTO users (
            nama, email, password,role
        ) VALUES (
            ?, ?, ?,?
        );
    `,
      [nama, email, hash, role]
    );

    return res.status(200).json("Register success!");
  } catch (error) {
    return res.status(400).json(`Error during registration: ${error.message}`);
  }
}

async function login(req, res) {
  
  const { email, password } = req.body;
  try {
    // logic handling
    const user = await query(
      `
        SELECT id_user, email, password, role FROM users WHERE email = ? 
      `,
      [email]
    );
    console.log("User data:", user)

    // Jika pengguna tidak ditemukan
    if (user.length === 0) {
      return res.status(401).json("Invalid email or password");
    }

    // Bandingkan password yang dimasukkan dengan password di database
    const isPasswordValid = await bcryptjs.compare(password, user[0].password);

    // Jika password tidak valid
    if (!isPasswordValid) {
      return res.status(401).json("Invalid email or password");
    }

    // Role-based routing
    if (user && user.length > 0) {
      if (user[0].role === 'user') {
        req.session.user = {
          id: user[0].id_user,
          email: user[0].email,
          nama: user[0].nama,
          role: user[0].role,
        }
        // Redirect ke halaman utama untuk pengguna
        return res.status(200).json({ redirectUrl: "/" });
      } else if (user[0].role === 'mitra') {
        req.session.user = {
          id: user[0].id_user,
          email: user[0].email,
          nama: user[0].nama,
          role: user[0].role,
        }
        // Redirect ke halaman dashboard mitra
        return res.status(200).json({ redirectUrl: "/mitra/dashboard" });
      }
    }
    // Jika role tidak valid
    return res.status(401).json({ message: "Invalid role" });
  } catch (error) {
    return res.status(400).json(`Error during login: ${error.message}`);
  }
}



module.exports = {
  register,
  login,
};
