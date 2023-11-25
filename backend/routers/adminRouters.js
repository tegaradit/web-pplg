const express = require('express');
const jwt = require('jsonwebtoken');
const db = require('../config/db'); 
const router = express.Router();


// Daftar token yang sudah logout
const revokedTokens = [];

// Middleware untuk memeriksa keberadaan token pada setiap permintaan yang membutuhkan otentikasi
function verifyToken(req, res, next) {
    const token = req.headers['authorization'];

    if (!token) {
        return res.status(403).json({ error: 'Token tidak tersedia' });
    }

    // Memeriksa apakah token sudah dicabut atau belum
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

            // Menandatangani token JWT dengan kunci rahasia
            const token = jwt.sign(payload, 'kunci_rahasia_anda', { expiresIn: '1h' });

            let message;
            if (user.role === 'super_admin') {
                message = 'Login sebagai super admin berhasil';
            } else if (user.role === 'admin') {
                message = 'Login sebagai admin berhasil';
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


router.post('/logout', verifyToken, (req, res) => {
    const token = req.headers['authorization'];
    const decoded = jwt.decode(token);

    // Menambahkan token sesuai role dari daftar yang sudah dicabut
    if (decoded.role === 'admin' || decoded.role === 'super_admin') {
        revokedTokens.push({ token, role: decoded.role });
        res.status(200).json({ message: 'Logout berhasil' });
    } else {
        res.status(403).json({ error: 'Tidak diizinkan untuk logout' });
    }
});


module.exports = router;
