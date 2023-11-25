const express = require('express');
const router = express.Router();
const db = require("../config/db")


// Mendapatkan semua data guru
router.get('/', (req, res) => {
  const sql = 'SELECT * FROM profil_guru';
  db.query(sql, (err, result) => {
    if (err) {
      res.status(500).json({ message: err.message });
    } else {
      res.json(result);
    }
  });
});

// Mengambil data guru berdasarkan ID
router.get('/:id', (req, res) => {
    const { id } = req.params;
    const sql = 'SELECT * FROM profil_guru WHERE id = ?';
    db.query(sql, id, (err, result) => {
      if (err) {
        res.status(404).json({ message: err.message });
      } else {
        if (result.length === 1) {
          res.json(result[0]);
        } else {
          res.status(404).json({ message: 'Data guru tidak ditemukan' });
        }
      }
    });
  });

// Menambah data guru baru
router.post('/', (req, res) => {
  const { nama, jabatan, mapel, hoby, alamat, motto_hidup, foto_profil } = req.body;
  const sql = 'INSERT INTO profil_guru (nama, jabatan, mapel, hoby, alamat, motto_hidup, foto_profil) VALUES (?, ?, ?, ?, ?, ?, ?)';
  db.query(sql, [nama, jabatan, mapel, hoby, alamat, motto_hidup, foto_profil], (err, result) => {
    if (err) {
      res.status(400).json({ message: err.message });
    } else {
      res.status(201).json({ message: 'Data guru berhasil ditambahkan' });
    }
  });
});

// Menghapus data guru
router.delete('/:id', (req, res) => {
  const { id } = req.params;
  const sql = 'DELETE FROM profil_guru WHERE id = ?';
  db.query(sql, id, (err, result) => {
    if (err) {
      res.status(404).json({ message: err.message });
    } else {
      res.json({ message: 'Data guru berhasil dihapus' });
    }
  });
});

// Update data guru
router.patch('/:id', (req, res) => {
  const { id } = req.params;
  const { nama, mata_pelajaran } = req.body;
  const sql = 'UPDATE profil_guru SET nama = ?, jabatan = ?, mapel = ?, hoby = ?,alamat = ?, motto_hidup = ?, foto_profil = ? WHERE id = ?';
  db.query(sql, [nama, mapel ,hoby, alamat,motto_hidup,foto_profil, id], (err, result) => {
    if (err) {
      res.status(400).json({ message: err.message });
    } else {
      res.json({ message: 'Data guru berhasil diupdate' });
    }
  });
});

module.exports = router;
