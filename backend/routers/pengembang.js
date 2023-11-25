const express = require('express');
const router = express.Router();
const db = require("../config/db");

// semua data
router.get('/', (req, res) => {
    const sql= " SELECT * FROM pengembang";
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
    const sql = 'SELECT * FROM pengembang WHERE id = ?';
    db.query(sql , id, (err, result )=>{
        if(err){
            res.status(500).json({message: err.message});
        }else{
            if (result.length === 1) {
                res.json(result[0]);
              } else {
                res.status(404).json({ message: 'pengembang tidak ada' });
              }
        }
    });
});
  
  module.exports = router;



