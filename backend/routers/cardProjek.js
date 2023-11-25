const express = require('express');
const router = express.Router();
const db = require("../config/db");

// semua data
router.get('/', (req, res) => {
    const sql= " SELECT * FROM card_project";
    db.query(sql , (err, result)=>{
        if(err){
            res.status(500).json({message: err.message});
        }else{
            res.json(result)
        }
    });
});
// pake id
router.get('/:id', (req, res) =>{
    const { id } = req.params;
    const sql = 'SELECT * FROM profil_guru WHERE id = ?';
    db.query(sql , id, (err, result )=>{
        if(err){
            res.status(500).json({message: err.message});
        }else{
            if (result.length === 1) {
                res.json(result[0]);
              } else {
                res.status(404).json({ message: 'Data guru tidak ditemukan' });
              }
        }
    });
});

// tambah projek
router.post('/', (req, res) => {
    const { nama_project,pembuat_project,kelas,deskripsi_project,link_project,upload_at, gambar } = req.body;
    const sql = 'INSERT INTO card_project (nama_project, pembuat_project, kelas, deskripsi_project, link_project, upload_at, gambar) VALUES (?, ?, ?, ?, ?, ?, ?)';
    db.query(sql, [nama_project, pembuat_project, kelas, deskripsi_project, link_project, upload_at, gambar], (err, result) => {
      if (err) {
        res.status(400).json({ message: err.message });
      } else {
        res.status(201).json({ message: 'project berhasil ditambahkan' });
      }
    });
  });

  router.delete('/:id', (req, res) => {
    const { id } = req.params;
    const sql = 'DELETE FROM card_project WHERE id = ?';
    db.query(sql, id, (err, result) => {
      if (err) {
        res.status(404).json({ message: err.message });
      } else {
        res.json({ message: 'project berhasil dihapus' });
      }
    });
  });

  router.patch('/:id', (req, res) => {
    const { id } = req.params;
    const { nama_project, pembuat_project, kelas, deskripsi_project, link_project, upload_at, gambar } = req.body;
    const sql = 'UPDATE card_project SET nama_project = ?, pembuat_project  = ?, kelas = ?, deskripsi_project = ?,upload_at = ?, gambar = ? WHERE id = ?';
    db.query(sql, [nama_project, pembuat_project, kelas, deskripsi_project, link_project, upload_at, gambar], (err, result) => {
      if (err) {
        res.status(400).json({ message: err.message });
      } else {
        res.json({ message: 'project berhasil diupdate' });
      }
    });
  });
  
  module.exports = router;



