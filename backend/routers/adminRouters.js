const express = require('express');
const jwt = require('jsonwebtoken');
const db = require('../config/db'); 
const router = express.Router();

const revokedTokens = [];

function verifyToken(req, res, next) {
    const token = req.headers['authorization'];

    if (!token) {
        return res.status(403).json({ error: 'Token tidak tersedia' });
    }

    // periksa token
    if (revokedTokens.includes(token)) {
        return res.status(401).json({ error: 'Token sudah dicabut' });
    }

    jwt.verify(token, 'kunci_rahasia_anda', (err, decoded) => {
        if (err) {
            return res.status(401).json({ error: 'Token tidak valid' });
        }
        req.decoded = decoded;
        next();
    });
}

router.post('/login', (req, res) => {
    const { username, password } = req.body;

    const query = 'SELECT * FROM admin WHERE username_admin = ? AND password_admin = ?';
    db.query(query, [username, password], (err, results) => {
        if (err) {
            res.status(500).json({ error: 'Error querying database' });
            return;
        }
        if (results.length > 0) {
            const user = results[0];
            const payload = { username: user.username_admin, role: user.role };

            const token = jwt.sign(payload, 'kunci_rahasia_anda');
            if (user.role === 'user') {
                expiresIn = '1h';
            }
            let message;
            if (user.role === 'super_admin') {
                message = 'Login sebagai super admin berhasil';
                return res.redirect('/superadmin');
            } else if (user.role === 'admin') {
                message = 'Login sebagai admin berhasil';
                return res.redirect('/admin');
            }else if(user.role === 'user'){
                message = 'login sebagai user berhasil';
                return res.redirect('/user');
            } else {
                res.status(403).json({ error: 'Role tidak valid' });
                return;
            }

            res.status(200).json({ message, token });
        } else {
            res.status(401).json({ error: 'Username dan password salah' });
        }
    });
});

router.post('/buatUser',  (req, res) => {
    const { username, password } = req.body;

    const query = 'INSERT INTO admin (username_admin, password_admin, role, waktu) VALUES (?, ?, "user" ,2)';
    db.query(query, [username, password], (err, results) => {
        if (err){
            return res.status(500).json({ error: 'Error creating user' });
        }else{
        res.status(201).json({ message: 'User created successfully' });
}});
});


router.post('/logout', verifyToken, (req, res) => {
    const token = req.headers['authorization'];
    const decoded = jwt.decode(token);

    // Menambahkan token sesuai role dari daftar yang sudah dicabut
    if (decoded.role === 'admin' || decoded.role === 'super_admin' || decoded.role === 'user') {
        revokedTokens.push({ token, role: decoded.role });
        res.status(200).json({ message: 'Logout berhasil' });
    } else {
        res.status(403).json({ error: 'Tidak diizinkan untuk logout' });
    }
});

router.use((err, req, res, next) => {
    if (err.name === 'TokenExpiredError') {
        res.redirect('/'); 
    } else {
        next(err);
    }
});


module.exports = router;
