const express = require('express');
const adminRouters = require('./routers/adminRouters');
const guruRouters = require('./routers/profilGuruRouters');
const cardProjek = require('./routers/cardProjek')
const pengembang = require('./routers/pengembang')
const app = express();
const cors = require('cors')


app.use(cors())
app.use(express.json());
app.get('/', (req, res)=>{
    res.send('hello world')
})

app.use('/admin', adminRouters);
app.use('/guru', guruRouters);
app.use('/projek', cardProjek );
app.use('/pengembang', pengembang);

const PORT = 8080;
app.listen(PORT, () => {
    console.log(`Server berjalan di port ${PORT}`);
});
